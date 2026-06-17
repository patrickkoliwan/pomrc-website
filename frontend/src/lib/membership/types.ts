import type { MembershipFormData } from "@/app/membership/utils/types";

export const membershipApplicationStatuses = [
  "pending_review",
  "approved",
  "rejected",
  "completed",
] as const;

export const membershipPaymentStatuses = [
  "not_required",
  "pending",
  "received",
] as const;

export const membershipEmailStatuses = ["not_sent", "sent", "failed"] as const;

export type MembershipApplicationStatus =
  (typeof membershipApplicationStatuses)[number];

export type MembershipPaymentStatus = (typeof membershipPaymentStatuses)[number];

export type MembershipEmailStatus = (typeof membershipEmailStatuses)[number];

export type MembershipApplicationRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  status: MembershipApplicationStatus;
  payment_status: MembershipPaymentStatus;
  admin_notes: string | null;
  email_status: MembershipEmailStatus;
  email_error: string | null;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  membership_status: string;
  membership_type: string;
  submitted_data: MembershipFormData;
};

export const applicationStatusLabels: Record<MembershipApplicationStatus, string> =
  {
    pending_review: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Completed",
  };

export const paymentStatusLabels: Record<MembershipPaymentStatus, string> = {
  not_required: "Not required",
  pending: "Pending",
  received: "Received",
};

export const emailStatusLabels: Record<MembershipEmailStatus, string> = {
  not_sent: "Not sent",
  sent: "Sent",
  failed: "Failed",
};
