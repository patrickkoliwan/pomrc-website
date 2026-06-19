import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { juniorProgramNoticeSchema } from "@/lib/cms/schemas";
import { requireAdmin } from "@/lib/firebase/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

function isMissingRelationError(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

export async function GET() {
  await requireAdmin();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("junior_program_notice")
    .select("*")
    .eq("id", "primary")
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error)) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  await requireAdmin();

  try {
    const payload = juniorProgramNoticeSchema.parse(await request.json());
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("junior_program_notice")
      .upsert(
        {
          id: "primary",
          ...payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/junior-programs");

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid notice payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 400 }
    );
  }
}
