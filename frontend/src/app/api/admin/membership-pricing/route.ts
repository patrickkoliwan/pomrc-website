import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/firebase/admin";
import {
  getMembershipPricing,
  membershipPricingUpdateSchema,
  saveMembershipPricing,
} from "@/lib/membership/pricing";

export async function GET() {
  await requireAdmin();

  try {
    const data = await getMembershipPricing();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load membership pricing",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await requireAdmin();

  try {
    const payload = membershipPricingUpdateSchema.parse(await request.json());
    const data = await saveMembershipPricing(payload);

    revalidatePath("/membership");
    revalidatePath("/admin/membership-applications");

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors[0]?.message || "Invalid pricing payload",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save membership pricing",
      },
      { status: 400 }
    );
  }
}
