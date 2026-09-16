import { supabase } from "../lib/supabase";

const DUPLICATE_EMAIL_CODE = "23505";

function matchesPath(campaign, pathname) {
  return (
    campaign.target_paths?.includes("*") ||
    campaign.target_paths?.includes(pathname)
  );
}

class SiteCampaignsService {
  async getActiveCampaign(pathname) {
    try {
      const { data, error } = await supabase
        .from("site_campaigns")
        .select(
          [
            "id",
            "campaign_key",
            "version",
            "target_paths",
            "starts_at",
            "ends_at",
            "priority",
            "cta_url",
            "cta_label",
            "eyebrow",
            "panel_title",
            "panel_description",
            "title",
            "description",
            "duration_label",
            "access_label",
            "email_capture_enabled",
            "email_label",
            "email_placeholder",
            "consent_copy",
            "open_delay_ms",
            "dismiss_for_days",
          ].join(","),
        )
        .order("priority", { ascending: false })
        .order("starts_at", { ascending: false });

      if (error) return null;
      return (data || []).find((campaign) => matchesPath(campaign, pathname)) || null;
    } catch {
      return null;
    }
  }

  async registerLead({ campaignId, email, sourcePath }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return { success: true, alreadyRegistered: false, error: null };
    }

    const { error } = await supabase.from("site_campaign_leads").insert({
      campaign_id: campaignId,
      email: normalizedEmail,
      source_path: sourcePath,
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
      error: "No pudimos guardar tu correo, pero aún puedes continuar.",
    };
  }
}

export const siteCampaignsService = new SiteCampaignsService();
