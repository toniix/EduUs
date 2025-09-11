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
