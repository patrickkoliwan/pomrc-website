import { NextResponse } from "next/server";
import { z } from "zod";
import { parseCmsPayload } from "@/lib/cms/schemas";
import type { CmsTable } from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const tables: CmsTable[] = [
  "club_events",
  "committee_members",
  "contact_routing",
];

function parseTable(table: string): CmsTable {
  if (!tables.includes(table as CmsTable)) {
    throw new Error("Unsupported CMS table");
  }

  return table as CmsTable;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ table: string; id: string }> }
) {
  await requireAdmin();

  try {
    const { table: tableParam, id } = await context.params;
    const table = parseTable(tableParam);
    const payload = parseCmsPayload(table, await request.json()) as Record<
      string,
      unknown
    >;
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from(table)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid CMS payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ table: string; id: string }> }
) {
  await requireAdmin();

  try {
    const { table: tableParam, id } = await context.params;
    const table = parseTable(tableParam);
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 400 }
    );
  }
}
