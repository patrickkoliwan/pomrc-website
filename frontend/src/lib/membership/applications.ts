import "server-only";

import { z } from "zod";
import type { MembershipFormData } from "@/app/membership/utils/types";
import type { MembershipType } from "@/app/membership/utils/types";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/cms/types";
import { sendMembershipApprovalEmail } from "@/app/membership/utils/approvalEmail";
import { isValidApplicantEmail } from "@/lib/membership/email-validation";
import {
  membershipApplicationStatuses,
  membershipPaymentStatuses,
  sortMembershipApplications,
  type MembershipApplicationRecord,
  type MembershipApprovalEmailStatus,
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

function isMissingSchemaCacheColumnError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST204" &&
    Boolean(error.message?.includes("schema cache"))
  );
}

async function insertMembershipApplication(
  payload: Partial<ReturnType<typeof toMembershipApplicationInsert>>
) {
  const supabase = getSupabaseAdminClient();
  return supabase
    .from("membership_applications")
    .insert(payload)
    .select("*")
    .single();
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
  const payload = toMembershipApplicationInsert(data, resolved);
  let { data: record, error } = await insertMembershipApplication(payload);

  if (
    error &&
    isMissingSchemaCacheColumnError(error) &&
    error.message.includes("'pricing_period_id'")
  ) {
    const legacyPayload: Partial<typeof payload> = { ...payload };
    delete legacyPayload.pricing_period_id;
    const retry = await insertMembershipApplication(legacyPayload);
    record = retry.data;
    error = retry.error;
  }

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

export async function updateMembershipApplicationApprovalEmailStatus(
  id: string,
  payload: {
    approval_email_status: MembershipApprovalEmailStatus;
    approval_email_error?: string | null;
    approval_email_sent_at?: string | null;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("membership_applications")
    .update({
      approval_email_status: payload.approval_email_status,
      approval_email_error: payload.approval_email_error ?? null,
      approval_email_sent_at: payload.approval_email_sent_at ?? null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export type ApprovalEmailResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

export async function sendApprovalEmailForApplication(
  application: MembershipApplicationRecord
): Promise<ApprovalEmailResult> {
  if (!isValidApplicantEmail(application.email)) {
    const error = "Invalid email address";
    await updateMembershipApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "skipped",
      approval_email_error: error,
      approval_email_sent_at: null,
    });

    return { sent: false, skipped: true, error };
  }

  try {
    await sendMembershipApprovalEmail(application);
    const sentAt = new Date().toISOString();
    await updateMembershipApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "sent",
      approval_email_error: null,
      approval_email_sent_at: sentAt,
    });

    return { sent: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send approval email";

    await updateMembershipApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "failed",
      approval_email_error: message,
      approval_email_sent_at: null,
    });

    return { sent: false, error: message };
  }
}

export async function getMembershipApplicationById(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as MembershipApplicationRecord;
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
