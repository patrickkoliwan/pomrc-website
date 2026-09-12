import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/admin";
import {
  getMembershipApplicationById,
  sendApprovalEmailForApplication,
} from "@/lib/membership/applications";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  try {
    const { id } = await context.params;
    const application = await getMembershipApplicationById(id);

    if (application.status !== "approved") {
      return NextResponse.json(
        { error: "Approval email can only be sent for approved applications" },
        { status: 400 }
      );
    }

    const approvalEmail = await sendApprovalEmailForApplication(application);
    const refreshed = await getMembershipApplicationById(id);

    if (approvalEmail.skipped) {
      return NextResponse.json(
        {
          data: refreshed,
          approvalEmail,
          error: approvalEmail.error ?? "Invalid email address",
        },
        { status: 422 }
      );
    }

    if (!approvalEmail.sent) {
      return NextResponse.json(
        {
          data: refreshed,
          approvalEmail,
          error: approvalEmail.error ?? "Failed to send approval email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: refreshed, approvalEmail });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
