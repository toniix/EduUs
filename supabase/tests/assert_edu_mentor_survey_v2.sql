-- Run after refine_edu_mentor_survey.sql and the migration in an ephemeral DB.
DO $$
DECLARE
  v_v1 UUID;
  v_v2 UUID;
  v_response UUID;
  v_owner UUID := '11111111-1111-4111-8111-111111111111';
  v_other UUID := '22222222-2222-4222-8222-222222222222';
  v_rejected BOOLEAN;
BEGIN
  SELECT id INTO v_v1 FROM public.surveys WHERE survey_key = 'edu-mentor' AND version = 1;
  SELECT id INTO v_v2 FROM public.surveys WHERE survey_key = 'edu-mentor' AND version = 2;
  IF v_v1 IS NULL OR v_v2 IS NULL THEN RAISE EXCEPTION 'Missing a survey version'; END IF;
  IF (SELECT status FROM public.surveys WHERE id = v_v1) <> 'published'
    OR (SELECT status FROM public.surveys WHERE id = v_v2) <> 'draft' THEN
    RAISE EXCEPTION 'Migration changed publication state';
  END IF;
  IF (SELECT COUNT(*) FROM public.survey_questions WHERE survey_id = v_v1) <> 10
    OR (SELECT COUNT(*) FROM public.survey_questions WHERE survey_id = v_v2) <> 10
    OR EXISTS (
      SELECT 1 FROM public.survey_questions
      WHERE survey_id = v_v2 AND question_key = 'preferred_schedule'
    ) THEN
    RAISE EXCEPTION 'Question versions are not isolated';
  END IF;

  UPDATE public.surveys SET status = 'archived' WHERE id = v_v1;
  UPDATE public.surveys SET status = 'published' WHERE id = v_v2;
  INSERT INTO auth.users VALUES (v_owner), (v_other);
  INSERT INTO public.survey_responses (survey_id, owner_user_id)
  VALUES (v_v2, v_owner) RETURNING id INTO v_response;
  PERFORM set_config('request.jwt.claim.sub', v_owner::TEXT, TRUE);

  -- A partial response is stored before submission.
  PERFORM public.save_survey_answer(
    v_response, 'support_network',
    '{"selected":["Familia o amistades","Otra persona o recurso"],"other_text":"Orientador independiente"}'::JSONB
  );
  IF NOT EXISTS (
    SELECT 1 FROM public.survey_answers answer
    JOIN public.survey_questions question ON question.id = answer.question_id
    WHERE answer.response_id = v_response AND question.question_key = 'support_network'
  ) THEN RAISE EXCEPTION 'Partial answer was not saved'; END IF;

  v_rejected := FALSE;
  BEGIN
    PERFORM public.save_survey_answer(
      v_response, 'support_network',
      '{"selected":["Familia o amistades","No tengo a quién recurrir"],"other_text":""}'::JSONB
    );
  EXCEPTION WHEN OTHERS THEN v_rejected := TRUE;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Exclusive combination accepted'; END IF;

  v_rejected := FALSE;
  BEGIN
    PERFORM public.save_survey_answer(
      v_response, 'support_network',
      '{"selected":["Otra persona o recurso"],"other_text":""}'::JSONB
    );
  EXCEPTION WHEN OTHERS THEN v_rejected := TRUE;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Empty Other accepted'; END IF;

  v_rejected := FALSE;
  BEGIN
    PERFORM public.save_survey_answer(
      v_response, 'support_network',
      '["Familia o amistades","Familia o amistades"]'::JSONB
    );
  EXCEPTION WHEN OTHERS THEN v_rejected := TRUE;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Duplicate selection accepted'; END IF;

  v_rejected := FALSE;
  BEGIN
    PERFORM public.save_survey_answer(v_response, 'readiness', '2.5'::JSONB);
  EXCEPTION WHEN OTHERS THEN v_rejected := TRUE;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Fractional scale accepted'; END IF;

  PERFORM set_config('request.jwt.claim.sub', v_other::TEXT, TRUE);
  v_rejected := FALSE;
  BEGIN
    PERFORM public.save_survey_answer(v_response, 'support_network', '["Profesionales de mi sector"]'::JSONB);
  EXCEPTION WHEN OTHERS THEN v_rejected := TRUE;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Other owner altered the response'; END IF;
  PERFORM set_config('request.jwt.claim.sub', v_owner::TEXT, TRUE);

  v_rejected := FALSE;
  BEGIN
    PERFORM public.submit_survey_response(v_response);
  EXCEPTION WHEN OTHERS THEN v_rejected := TRUE;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Incomplete response submitted'; END IF;

  PERFORM public.save_survey_answer(v_response, 'age_range', '"18 a 21 años"'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'study_area', '"Economía"'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'current_stage', '"Estudiante"'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'employment_barriers', '["Falta"]'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'readiness', '3'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'valuable_components', '["Mentor o mentora con experiencia en mi sector"]'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'weekly_availability', '"2 a 3 horas"'::JSONB);
  PERFORM public.save_survey_answer(v_response, 'application_interest', '4'::JSONB);
  PERFORM public.submit_survey_response(v_response);
  IF (SELECT status FROM public.survey_responses WHERE id = v_response) <> 'submitted' THEN
    RAISE EXCEPTION 'Complete response was not submitted';
  END IF;
END;
$$;
