import "server-only";

import { z } from "zod";
import type { MembershipFormData } from "@/app/membership/utils/types";
import type { MembershipType } from "@/app/membership/utils/types";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/cms/types";
import {
  membershipApplicationStatuses,
  membershipPaymentStatuses,
  sortMembershipApplications,
  type MembershipApplicationRecord,
  type MembershipEmailStatus,
} from "./types";
import {
  resolveMembershipPrice,
  type ResolvedMembershipPrice,
} from "./pricing-types";

export const membershipApplicationUpdateSchema = z.object({
  status: z.enum(membershipApplicationStatuses),
  payment_status: z.enum(membershipPaymentStatuses),
  admin_notes: z
    .string()
    .max(5000, "Admin notes are too long")
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
});

export type MembershipApplicationUpdate = z.infer<
  typeof membershipApplicationUpdateSchema
>;

export function toMembershipApplicationInsert(
  data: MembershipFormData,
  pricing: ResolvedMembershipPrice
) {
  return {
    first_name: data.personalInfo.firstName,
    surname: data.personalInfo.surname,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    membership_status: data.membershipStatus,
    membership_type: data.membershipType,
    submitted_data: data as unknown as Json,
    quoted_amount: pricing.amount,
    quoted_price_label: pricing.quotedPriceLabel,
    pricing_period_id: pricing.periodId,
  };
}

export async function resolveApplicationPricing(
  membershipType: MembershipType
): Promise<ResolvedMembershipPrice> {
  const config = await getMembershipPricingFromDb();
  return resolveMembershipPrice(membershipType, config);
}

async function getMembershipPricingFromDb() {
  const { getMembershipPricing } = await import("./pricing");
  return getMembershipPricing();
}

export async function createMembershipApplication(
  data: MembershipFormData,
  pricing?: ResolvedMembershipPrice
) {
  const resolved =
    pricing ?? (await resolveApplicationPricing(data.membershipType));
  const supabase = getSupabaseAdminClient();
  const { data: record, error } = await supabase
    .from("membership_applications")
    .insert(toMembershipApplicationInsert(data, resolved))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return record as MembershipApplicationRecord;
}

export async function updateMembershipApplicationEmailStatus(
  id: string,
  payload: {
    email_status: MembershipEmailStatus;
    email_error?: string | null;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("membership_applications")
    .update({
      email_status: payload.email_status,
      email_error: payload.email_error ?? null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function listMembershipApplications() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return sortMembershipApplications((data || []) as MembershipApplicationRecord[]);
}

export async function updateMembershipApplication(
  id: string,
  payload: MembershipApplicationUpdate
) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("membership_applications")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as MembershipApplicationRecord;
}
