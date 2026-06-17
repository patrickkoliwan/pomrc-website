import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/admin";
import { listMembershipApplications } from "@/lib/membership/applications";

export async function GET() {
  await requireAdmin();

  try {
    const data = await listMembershipApplications();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
