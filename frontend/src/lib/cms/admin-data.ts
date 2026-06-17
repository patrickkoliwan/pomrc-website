import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CmsRecord, CmsTable } from "./types";

const orderColumns: Record<CmsTable, string> = {
  site_pages: "slug",
  facilities: "display_order",
  club_events: "display_order",
  committee_members: "display_order",
  contact_routing: "label",
};

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
