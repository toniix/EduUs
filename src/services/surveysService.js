import { supabase } from "../lib/supabase";

export const SURVEY_CONSENT_VERSION = "edu-mentor-survey-v1";

class SurveysService {
  async getPublishedSurvey(surveyKey) {
    const { data, error } = await supabase
      .from("surveys")
      .select(
        "id,survey_key,version,title,intro_text,estimated_minutes,ends_at,survey_questions(id,question_key,prompt,helper_text,question_type,required,options,max_selections,scale_min,scale_max,scale_min_label,scale_max_label,text_max_length,position)",
      )
      .eq("survey_key", surveyKey)
      .eq("status", "published")
      .order("version", { ascending: false })
      .limit(1);

    if (error) throw error;
    const survey = data?.[0];
    if (!survey) return null;

    return {
      ...survey,
      survey_questions: [...(survey.survey_questions || [])].sort(
        (left, right) => left.position - right.position,
      ),
    };
  }

  async ensureSession() {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (sessionData.session) return sessionData.session;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    if (!data.session) throw new Error("No se pudo iniciar la sesión de encuesta.");
    return data.session;
  }

  async getMyResponse(surveyId) {
    const { data, error } = await supabase
      .from("survey_responses")
      .select(
        "id,email,adult_confirmed,consent_marketing,consent_text_version,status,current_question_key,submitted_at",
      )
      .eq("survey_id", surveyId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAnswers(responseId, questions) {
    const { data, error } = await supabase
      .from("survey_answers")
      .select("question_id,answer")
      .eq("response_id", responseId);

    if (error) throw error;

    const questionKeys = new Map(
      questions.map((question) => [question.id, question.question_key]),
    );
    return (data || []).reduce((answers, row) => {
      const key = questionKeys.get(row.question_id);
      if (key) answers[key] = row.answer;
      return answers;
    }, {});
  }

  async startResponse({ surveyId, email, consentMarketing, existingResponse }) {
    if (existingResponse?.status === "in_progress") {
      const { data, error } = await supabase
        .from("survey_responses")
        .update({
          email: email.trim().toLowerCase(),
          consent_marketing: consentMarketing,
        })
        .eq("id", existingResponse.id)
        .select(
          "id,email,adult_confirmed,consent_marketing,consent_text_version,status,current_question_key,submitted_at",
        )
        .single();

      if (error) throw error;
      return data;
    }

    const { data: authData, error: authError } =
      await supabase.auth.getUser();
    if (authError) throw authError;

    const { data, error } = await supabase
      .from("survey_responses")
      .insert({
        survey_id: surveyId,
        owner_user_id: authData.user.id,
        email: email.trim().toLowerCase(),
        adult_confirmed: true,
        consent_research: true,
        consent_marketing: consentMarketing,
        consent_text_version: SURVEY_CONSENT_VERSION,
      })
      .select(
        "id,email,adult_confirmed,consent_marketing,consent_text_version,status,current_question_key,submitted_at",
      )
      .single();

    if (error) throw error;
    return data;
  }

  async saveAnswer({ responseId, questionKey, answer }) {
    const { error } = await supabase.rpc("save_survey_answer", {
      p_response_id: responseId,
      p_question_key: questionKey,
      p_answer: answer,
    });

    if (error) throw error;
  }

  async submitResponse(responseId) {
    const { error } = await supabase.rpc("submit_survey_response", {
      p_response_id: responseId,
    });

    if (error) throw error;
  }
}

export const surveysService = new SurveysService();
