// src/services/dashboardService.js
import { supabase } from "../lib/supabase";

/**
 * Fetches the total number of registered users.
 */
export async function getUserCount() {
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
}

/**
 * Fetches the total number of published opportunities.
 */
export async function getOpportunitiesCount() {
  const { count, error } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
}

/**
 * Fetches the number of active opportunities (not expired).
 * Assumes there is a 'deadline' or 'end_date' field and 'status' field.
 */
export async function getActiveOpportunitiesCount() {
  const today = new Date().toISOString();
  const { count, error } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .gte("deadline", today);
  if (error) throw error;
  return count;
}

/**
 * Fetches the number of expired opportunities (deadline < today).
 */
export async function getExpiredOpportunitiesCount() {
  const today = new Date().toISOString();
  const { count, error } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .lt("deadline", today);
  if (error) throw error;
  return count;
}

/**
 * Fetches previous period statistics for growth calculation.
 * You can adapt this to your needs, e.g., for last week/month.
 */
export async function getPreviousUserCount(sinceDate) {
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .lt("created_at", sinceDate);
  if (error) throw error;
  return count;
}

export async function getPreviousOpportunitiesCount(sinceDate) {
  const { count, error } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .lt("created_at", sinceDate);
  if (error) throw error;
  return count;
}

/**
 * Fetches the total number of events.
 */
export async function getEventsCount() {
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

/**
 * Fetches the number of upcoming events (starts_at >= now).
 */
export async function getUpcomingEventsCount() {
  const now = new Date().toISOString();
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .gte("starts_at", now);
  if (error) throw error;
  return count || 0;
}

/**
 * Fetches the total number of event registrations.
 */
export async function getEventRegistrationsCount() {
  const { count, error } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

/**
 * Fetches previous events count for growth calculation.
 */
export async function getPreviousEventsCount(sinceDate) {
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .lt("created_at", sinceDate);
  if (error) throw error;
  return count || 0;
}

/**
 * Fetches previous registrations count for growth calculation.
 */
export async function getPreviousEventRegistrationsCount(sinceDate) {
  const { count, error } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .lt("registered_at", sinceDate);
  if (error) throw error;
  return count || 0;
}

/**
 * Fetches recent dynamic activities across registrations and opportunities.
 */
export async function getRecentActivity() {
  try {
    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("id, name, registered_at, event:events(title)")
      .order("registered_at", { ascending: false })
      .limit(6);

    const { data: opportunities } = await supabase
      .from("opportunities")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    const acts = [];
    if (registrations) {
      registrations.forEach((r) => {
        acts.push({
          id: `reg-${r.id}`,
          user: r.name,
          action: "se inscribió al evento",
          item: r.event?.title || "Evento EDU-US",
          date: r.registered_at,
          type: "event",
        });
      });
    }
    if (opportunities) {
      opportunities.forEach((o) => {
        acts.push({
          id: `opp-${o.id}`,
          user: "Administración / Editor",
          action: "publicó la oportunidad",
          item: o.title,
          date: o.created_at,
          type: "opportunity",
        });
      });
    }

    acts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return acts.slice(0, 6);
  } catch (err) {
    console.error("Error fetching recent activity:", err);
    return [];
  }
}
