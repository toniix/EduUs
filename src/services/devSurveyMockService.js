import { answerError } from "../lib/surveyAnswers";

const STORAGE_KEY = "edu-us:dev-survey-mock:edu-mentor:v2";

const survey = {
  id: "dev-edu-mentor-survey",
  survey_key: "edu-mentor",
  version: 2,
  title: "Ayúdanos a diseñar EDU-MENTOR",
  intro_text:
    "Estamos diseñando EDU-MENTOR para acompañar a jóvenes que buscan prácticas o empleo. La propuesta combina orientación de profesionales, ejercicios prácticos y seguimiento personalizado; queremos saber qué partes realmente te ayudarían.\n\nCuéntanos tu experiencia en unos 3 minutos. Pediremos tu correo para guardar el avance; la encuesta no es anónima. En esta demo usa datos ficticios: nada se envía a Supabase.",
  estimated_minutes: 3,
  survey_questions: [
    {
      id: "dev-age-range",
      question_key: "age_range",
      prompt: "¿En qué rango de edad estás?",
      question_type: "single_choice",
      required: true,
      options: ["18 a 21 años", "22 a 25 años", "26 a 30 años", "31 años o más"],
      position: 1,
    },
    {
      id: "dev-study-area",
      question_key: "study_area",
      prompt: "¿Qué carrera estudiaste o estudias actualmente?",
      helper_text: "Elige la opción más cercana a tu área.",
      question_type: "single_choice",
      required: true,
      options: [
        "Administración de Empresas / Gestión Empresarial",
        "Economía",
        "Contabilidad y Finanzas",
        "Marketing / Publicidad",
        "Negocios Internacionales / Comercio Exterior",
        "Otra carrera relacionada a Negocios",
        "Otra carrera no relacionada a Negocios",
      ],
      position: 2,
    },
    {
      id: "dev-current-stage",
      question_key: "current_stage",
      prompt: "¿En qué etapa académica o laboral estás?",
      question_type: "single_choice",
      required: true,
      options: [
        "Estudiante de primeros o ciclos intermedios",
        "Estudiante de últimos ciclos",
        "Egresado/a en búsqueda de empleo o prácticas",
        "Egresado/a con empleo que busca mejorar o cambiar",
        "Emprendiendo o trabajando de forma independiente",
      ],
      position: 3,
    },
    {
      id: "dev-employment-barriers",
      question_key: "employment_barriers",
      prompt: "¿Cuáles son tus principales dificultades al buscar empleo o prácticas?",
      helper_text: "Selecciona hasta tres.",
      question_type: "multi_choice",
      required: true,
      options: [
        "Falta de experiencia laboral previa",
        "No tener una red de contactos en mi sector",
        "Inseguridad o falta de preparación para entrevistas",
        "No saber cómo mejorar mi CV o LinkedIn",
        "Falta de claridad sobre el área hacia la que dirigir mi carrera",
        "Falta de experiencia práctica resolviendo problemas reales",
        "Otra dificultad",
      ],
      max_selections: 3,
      other_option: "Otra dificultad",
      other_text_max_length: 160,
      position: 4,
    },
    {
      id: "dev-support-network",
      question_key: "support_network",
      prompt: "Cuando tienes dudas sobre tu futuro profesional o búsqueda laboral, ¿a quién recurres principalmente?",
      helper_text: "Selecciona hasta dos. Si no cuentas con alguien, elige solo esa opción.",
      question_type: "multi_choice",
      required: true,
      options: [
        "Familia o amistades",
        "Docentes o tutores",
        "Profesionales de mi sector",
        "Servicios de orientación de mi institución",
        "Recursos en internet o herramientas de IA",
        "No tengo a quién recurrir",
        "Otra persona o recurso",
      ],
      max_selections: 2,
      other_option: "Otra persona o recurso",
      other_text_max_length: 160,
      exclusive_options: ["No tengo a quién recurrir"],
      position: 5,
    },
    {
      id: "dev-readiness",
      question_key: "readiness",
      prompt: "Del 1 al 5, ¿qué tan preparado/a te sientes para ingresar al mercado laboral?",
      question_type: "scale",
      required: true,
      scale_min: 1,
      scale_max: 5,
      scale_min_label: "Nada preparado/a",
      scale_max_label: "Muy preparado/a",
      position: 6,
    },
    {
      id: "dev-valuable-components",
      question_key: "valuable_components",
      prompt: "¿Qué haría que una mentoría como EDU-MENTOR realmente valga la pena para ti?",
      helper_text: "Selecciona hasta tres.",
      question_type: "multi_choice",
      required: true,
      options: [
        "Mentor o mentora con experiencia en mi sector",
        "Feedback práctico sobre CV y entrevistas",
        "Objetivos claros y seguimiento personalizado",
        "Ejercicios y casos reales",
        "Acceso a contactos y oportunidades de mi sector",
        "Apoyo para definir mi camino profesional",
        "Orientación emocional con psicólogos, si se incorpora al programa",
        "Otra forma de apoyo",
      ],
      max_selections: 3,
      other_option: "Otra forma de apoyo",
      other_text_max_length: 160,
      position: 7,
    },
    {
      id: "dev-weekly-availability",
      question_key: "weekly_availability",
      prompt: "¿Cuánto tiempo podrías dedicar al programa cada semana?",
      question_type: "single_choice",
      required: true,
      options: ["2 a 3 horas", "4 a 6 horas", "Más de 6 horas", "No dispongo de tiempo actualmente"],
      position: 8,
    },
    {
      id: "dev-application-interest",
      question_key: "application_interest",
      prompt: "¿Qué tan interesado/a estarías en postular a la primera edición de EDU-MENTOR?",
      question_type: "scale",
      required: true,
      scale_min: 1,
      scale_max: 5,
      scale_min_label: "Nada interesado/a",
      scale_max_label: "Muy interesado/a",
      position: 9,
    },
    {
      id: "dev-expected-outcome",
      question_key: "expected_outcome",
      prompt: "¿Qué te gustaría llevarte al finalizar un programa como este?",
      helper_text: "Opcional; máximo 500 caracteres.",
      question_type: "long_text",
      required: false,
      text_max_length: 500,
      position: 10,
    },
  ],
};

function readState() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const devSurveyMockService = {
  async getPublishedSurvey(surveyKey) {
    return surveyKey === survey.survey_key ? survey : null;
  },

  async ensureSession() {
    return { user: { id: "dev-survey-participant" } };
  },

  async getMyResponse() {
    return readState().response || null;
  },

  async getAnswers() {
    return readState().answers || {};
  },

  async startResponse({ email, consentMarketing, existingResponse }) {
    const state = readState();
    const response = {
      ...(existingResponse || state.response || {}),
      id: "dev-survey-response",
      survey_id: survey.id,
      email,
      adult_confirmed: true,
      consent_text_version: "edu-mentor-survey-v1",
      consent_marketing: consentMarketing,
      status: "in_progress",
      current_question_key: state.response?.current_question_key || null,
      submitted_at: null,
    };
    writeState({ ...state, response });
    return response;
  },

  async saveAnswer({ questionKey, answer }) {
    const state = readState();
    const response = state.response;
    if (!response) throw new Error("Inicia la encuesta antes de guardar respuestas.");
    const question = survey.survey_questions.find((item) => item.question_key === questionKey);
    if (!question) throw new Error("La pregunta no existe.");
    if (answer !== null && answer !== undefined) {
      const error = answerError(question, answer);
      if (error) throw new Error(error);
    }
    const answers = { ...(state.answers || {}) };
    if (answer === null || answer === undefined) delete answers[questionKey];
    else answers[questionKey] = answer;
    writeState({
      ...state,
      answers,
      response: { ...response, current_question_key: questionKey },
    });
  },

  async submitResponse() {
    const state = readState();
    if (!state.response) throw new Error("No hay una respuesta de prueba activa.");
    const incomplete = survey.survey_questions.some(
      (question) => answerError(question, state.answers?.[question.question_key]),
    );
    if (incomplete) throw new Error("Faltan respuestas requeridas.");
    writeState({
      ...state,
      response: {
        ...state.response,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      },
    });
  },

  resetDemo() {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
