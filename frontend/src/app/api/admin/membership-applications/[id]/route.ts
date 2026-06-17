import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/firebase/admin";
import {
  membershipApplicationUpdateSchema,
  updateMembershipApplication,
} from "@/lib/membership/applications";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  try {
    const { id } = await context.params;
    const payload = membershipApplicationUpdateSchema.parse(
      await request.json()
    );
    const data = await updateMembershipApplication(id, payload);

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid membership application payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
