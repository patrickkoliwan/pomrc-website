import "server-only";

import { z } from "zod";
import type { FormData as VenueHireFormData } from "@/app/venue-hire/page";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/cms/types";
import { isValidApplicantEmail } from "@/lib/membership/email-validation";
import { sendVenueHireApprovalEmail } from "./approval-emails";
import {
  applicationPaymentStatuses,
  applicationStatuses,
  sortApplications,
  type ApplicationApprovalEmailStatus,
  type ApplicationEmailStatus,
  type VenueHireApplicationRecord,
} from "./types";

export const venueHireApplicationUpdateSchema = z.object({
  status: z.enum(applicationStatuses),
  payment_status: z.enum(applicationPaymentStatuses),
  admin_notes: z
    .string()
    .max(5000, "Admin notes are too long")
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
});

export type VenueHireApplicationUpdate = z.infer<
  typeof venueHireApplicationUpdateSchema
>;

export function toVenueHireApplicationInsert(data: VenueHireFormData) {
  return {
    name: data.personalInfo.name,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    event_type: data.eventDetails.eventType,
    expected_guests: data.eventDetails.expectedGuests,
    selected_venue: data.venueSelection.selectedVenue,
    submitted_data: data as unknown as Json,
  };
}

export async function createVenueHireApplication(data: VenueHireFormData) {
  const supabase = getSupabaseAdminClient();
  const { data: record, error } = await supabase
    .from("venue_hire_applications")
    .insert(toVenueHireApplicationInsert(data))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return record as VenueHireApplicationRecord;
}

export async function updateVenueHireApplicationEmailStatus(
  id: string,
  payload: {
    email_status: ApplicationEmailStatus;
    email_error?: string | null;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("venue_hire_applications")
    .update({
      email_status: payload.email_status,
      email_error: payload.email_error ?? null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

async function updateVenueHireApplicationApprovalEmailStatus(
  id: string,
  payload: {
    approval_email_status: ApplicationApprovalEmailStatus;
    approval_email_error?: string | null;
    approval_email_sent_at?: string | null;
  }
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("venue_hire_applications")
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

export async function sendApprovalEmailForVenueHireApplication(
  application: VenueHireApplicationRecord
): Promise<ApprovalEmailResult> {
  if (!isValidApplicantEmail(application.email)) {
    const error = "Invalid email address";
    await updateVenueHireApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "skipped",
      approval_email_error: error,
      approval_email_sent_at: null,
    });

    return { sent: false, skipped: true, error };
  }

  try {
    await sendVenueHireApprovalEmail(application);
    const sentAt = new Date().toISOString();
    await updateVenueHireApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "sent",
      approval_email_error: null,
      approval_email_sent_at: sentAt,
    });

    return { sent: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send approval email";

    await updateVenueHireApplicationApprovalEmailStatus(application.id, {
      approval_email_status: "failed",
      approval_email_error: message,
      approval_email_sent_at: null,
    });

    return { sent: false, error: message };
  }
}

export async function getVenueHireApplicationById(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("venue_hire_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as VenueHireApplicationRecord;
}

export async function listVenueHireApplications() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("venue_hire_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return sortApplications((data || []) as VenueHireApplicationRecord[]);
}

export async function updateVenueHireApplication(
  id: string,
  payload: VenueHireApplicationUpdate
) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("venue_hire_applications")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as VenueHireApplicationRecord;
}
