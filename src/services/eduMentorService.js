import { supabase } from "../lib/supabase";

const DUPLICATE_EMAIL_CODE = "23505";

class EduMentorService {
  async registerInterest(email, source = "home_popup") {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return { success: true, alreadyRegistered: false, error: null };
    }

    const { error } = await supabase.from("edu_mentor_interest").insert({
      email: normalizedEmail,
      source,
      consent_marketing: true,
    });

    if (!error) {
      return { success: true, alreadyRegistered: false, error: null };
    }

    if (error.code === DUPLICATE_EMAIL_CODE) {
      return { success: true, alreadyRegistered: true, error: null };
    }

    return {
      success: false,
      alreadyRegistered: false,
      error: "No pudimos guardar tu correo, pero aún puedes responder la encuesta.",
    };
  }
}

export const eduMentorService = new EduMentorService();
