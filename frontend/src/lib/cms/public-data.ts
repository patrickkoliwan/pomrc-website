import "server-only";

import { getSupabasePublicClient } from "@/lib/supabase/server";
import type {
  ClubEventRecord,
  CommitteeMemberRecord,
  CommitteePositionWithMember,
  ContactRoutingRecord,
  FacilityRecord,
  JuniorProgramNoticeRecord,
  JuniorProgramRecord,
  SitePage,
} from "./types";

async function publicSelect<T>(
  table: string,
  orderColumn = "display_order"
): Promise<T[]> {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const query = supabase.from(table).select("*").eq("published", true);
  const { data, error } = await query.order(orderColumn, { ascending: true });

  if (error) {
    console.error(`Failed to read ${table} from Supabase`, error);
    return [];
  }

  return (data || []) as T[];
}

function isMissingRelationError(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

export async function getPublishedFacilities() {
  return publicSelect<FacilityRecord>("facilities");
}

export async function getPublishedEvents() {
  return publicSelect<ClubEventRecord>("club_events");
}

export async function getPublishedJuniorPrograms() {
  return publicSelect<JuniorProgramRecord>("junior_programs");
}

export async function getPublishedJuniorProgramNotice() {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("junior_program_notice")
    .select("*")
    .eq("id", "primary")
    .eq("enabled", true)
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error)) {
      return null;
    }

    console.error("Failed to read junior program notice from Supabase", error);
    return null;
  }

  return data as JuniorProgramNoticeRecord | null;
}

export async function getPublishedCommitteeMembers() {
  return publicSelect<CommitteeMemberRecord>("committee_members");
}

export async function getPublishedCommitteePositions() {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("committee_positions")
    .select("*, member:committee_members(*)")
    .eq("published", true)
    .not("member_id", "is", null)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to read committee positions from Supabase", error);
    return [];
  }

  return (data || []) as CommitteePositionWithMember[];
}

export async function getPublishedSitePage(slug: string) {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`Failed to read site page ${slug} from Supabase`, error);
    return null;
  }

  return data as SitePage | null;
}

export async function getActiveContactRouting() {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("contact_routing")
    .select("*")
    .eq("active", true)
    .order("label", { ascending: true });

  if (error) {
    console.error("Failed to read contact routing from Supabase", error);
    return [];
  }

  return (data || []) as ContactRoutingRecord[];
}
