import "server-only";

import { z } from "zod";
import type { FilmingPublicityFormData } from "@/app/venue-hire/utils/filmingPublicitySchema";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/cms/types";
import { isValidApplicantEmail } from "@/lib/membership/email-validation";
import { sendFilmingApprovalEmail } from "./approval-emails";
import {
  applicationPaymentStatuses,
  applicationStatuses,
  sortApplications,
  type ApplicationApprovalEmailStatus,
  type ApplicationEmailStatus,
  type FilmingApplicationRecord,
} from "./types";

export const filmingApplicationUpdateSchema = z.object({
  status: z.enum(applicationStatuses),
  payment_status: z.enum(applicationPaymentStatuses),
  admin_notes: z
    .string()
    .max(5000, "Admin notes are too long")
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
});

export type FilmingApplicationUpdate = z.infer<
  typeof filmingApplicationUpdateSchema
>;

export function toFilmingApplicationInsert(data: FilmingPublicityFormData) {
  return {
    name: data.applicantInfo.name,
    email: data.applicantInfo.email,
    phone: data.applicantInfo.phone,
    organization: data.organization,
    activity_date: data.activityDate,
    duration_type: data.durationType,
    location_type: data.locationSelection.locationType,
    submitted_data: data as unknown as Json,
  };
}

export async function createFilmingApplication(data: FilmingPublicityFormData) {
  const supabase = getSupabaseAdminClient();
  const { data: record, error } = await supabase
    .from("filming_applications")
    .insert(toFilmingApplicationInsert(data))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return record as FilmingApplicationRecord;
}

export async function updateFilmingApplicationEmailStatus(
  id: string,
  payload: {
    email_status: ApplicationEmailStatus;
    email_error?: string | null;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("filming_applications")
    .update({
      email_status: payload.email_status,
      email_error: payload.email_error ?? null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

async function updateFilmingApplicationApprovalEmailStatus(
  id: string,
  payload: {
    approval_email_status: ApplicationApprovalEmailStatus;
    approval_email_error?: string | null;
    approval_email_sent_at?: string | null;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("filming_applications")
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

export async function sendApprovalEmailForFilmingApplication(
  application: FilmingApplicationRecord
): Promise<ApprovalEmailResult> {
  if (!isValidApplicantEmail(application.email)) {
    const error = "Invalid email address";
    await updateFilmingApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "skipped",
      approval_email_error: error,
      approval_email_sent_at: null,
    });

    return { sent: false, skipped: true, error };
  }

  try {
    await sendFilmingApprovalEmail(application);
    const sentAt = new Date().toISOString();
    await updateFilmingApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "sent",
      approval_email_error: null,
      approval_email_sent_at: sentAt,
    });

    return { sent: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send approval email";

    await updateFilmingApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "failed",
      approval_email_error: message,
      approval_email_sent_at: null,
    });

    return { sent: false, error: message };
  }
}

export async function getFilmingApplicationById(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("filming_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FilmingApplicationRecord;
}

export async function listFilmingApplications() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("filming_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return sortApplications((data || []) as FilmingApplicationRecord[]);
}

export async function updateFilmingApplication(
  id: string,
  payload: FilmingApplicationUpdate
) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("filming_applications")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FilmingApplicationRecord;
}
