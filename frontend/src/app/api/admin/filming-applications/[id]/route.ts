import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/firebase/admin";
import {
  getFilmingApplicationById,
  filmingApplicationUpdateSchema,
  sendApprovalEmailForFilmingApplication,
  updateFilmingApplication,
  type ApprovalEmailResult,
} from "@/lib/venue-applications/filming";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  try {
    const { id } = await context.params;
    const currentApplication = await getFilmingApplicationById(id);
    const payload = filmingApplicationUpdateSchema.parse(await request.json());
    const data = await updateFilmingApplication(id, payload);

    let approvalEmail: ApprovalEmailResult | undefined;

    if (
      currentApplication.status !== "approved" &&
      payload.status === "approved"
    ) {
      approvalEmail = await sendApprovalEmailForFilmingApplication(data);
      const refreshed = await getFilmingApplicationById(id);

      return NextResponse.json({
        data: refreshed,
        approvalEmail,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid filming application payload",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
