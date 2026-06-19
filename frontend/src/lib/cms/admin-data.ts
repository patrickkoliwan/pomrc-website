import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CmsRecord, CmsTable, JuniorProgramNoticeRecord } from "./types";

const orderColumns: Record<CmsTable, string> = {
  site_pages: "slug",
  facilities: "display_order",
  club_events: "display_order",
  junior_programs: "display_order",
  junior_program_notice: "id",
  committee_members: "display_order",
  committee_positions: "display_order",
  contact_routing: "label",
};

function isMissingRelationError(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

export async function listCmsRecords<T extends CmsRecord>(table: CmsTable) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderColumns[table], { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as T[];
}

export async function getJuniorProgramNotice() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("junior_program_notice")
    .select("*")
    .eq("id", "primary")
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error)) {
      return null;
    }

    throw new Error(error.message);
  }

  return data as JuniorProgramNoticeRecord | null;
}
