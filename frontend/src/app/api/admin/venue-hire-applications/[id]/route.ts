import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/firebase/admin";
import {
  getVenueHireApplicationById,
  sendApprovalEmailForVenueHireApplication,
  updateVenueHireApplication,
  venueHireApplicationUpdateSchema,
  type ApprovalEmailResult,
} from "@/lib/venue-applications/venue-hire";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  try {
    const { id } = await context.params;
    const currentApplication = await getVenueHireApplicationById(id);
    const payload = venueHireApplicationUpdateSchema.parse(
      await request.json()
    );
    const data = await updateVenueHireApplication(id, payload);

    let approvalEmail: ApprovalEmailResult | undefined;

    if (
      currentApplication.status !== "approved" &&
      payload.status === "approved"
    ) {
      approvalEmail = await sendApprovalEmailForVenueHireApplication(data);
      const refreshed = await getVenueHireApplicationById(id);

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
          error: "Invalid venue hire application payload",
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
