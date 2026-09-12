import type { FormData as VenueHireFormData } from "@/app/venue-hire/page";
import type { FilmingPublicityFormData } from "@/app/venue-hire/utils/filmingPublicitySchema";

export const applicationStatuses = [
  "pending_review",
  "approved",
  "rejected",
  "completed",
] as const;

export const applicationPaymentStatuses = [
  "not_required",
  "pending",
  "received",
] as const;

export const applicationEmailStatuses = ["not_sent", "sent", "failed"] as const;

export const applicationApprovalEmailStatuses = [
  "not_sent",
  "sent",
  "failed",
  "skipped",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type ApplicationPaymentStatus =
  (typeof applicationPaymentStatuses)[number];
export type ApplicationEmailStatus = (typeof applicationEmailStatuses)[number];
export type ApplicationApprovalEmailStatus =
  (typeof applicationApprovalEmailStatuses)[number];

export type VenueHireApplicationRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  status: ApplicationStatus;
  payment_status: ApplicationPaymentStatus;
  admin_notes: string | null;
  email_status: ApplicationEmailStatus;
  email_error: string | null;
  approval_email_status: ApplicationApprovalEmailStatus;
  approval_email_error: string | null;
  approval_email_sent_at: string | null;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  expected_guests: number;
  selected_venue: string;
  submitted_data: VenueHireFormData;
};

export type FilmingApplicationRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  status: ApplicationStatus;
  payment_status: ApplicationPaymentStatus;
  admin_notes: string | null;
  email_status: ApplicationEmailStatus;
  email_error: string | null;
  approval_email_status: ApplicationApprovalEmailStatus;
  approval_email_error: string | null;
  approval_email_sent_at: string | null;
  name: string;
  email: string;
  phone: string;
  organization: string;
  activity_date: string;
  duration_type: string;
  location_type: string;
  submitted_data: FilmingPublicityFormData;
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending_review: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

export const paymentStatusLabels: Record<ApplicationPaymentStatus, string> = {
  not_required: "Not required",
  pending: "Pending",
  received: "Received",
};

export const emailStatusLabels: Record<ApplicationEmailStatus, string> = {
  not_sent: "Not sent",
  sent: "Sent",
  failed: "Failed",
};

export const approvalEmailStatusLabels: Record<
  ApplicationApprovalEmailStatus,
  string
> = {
  not_sent: "Not sent",
  sent: "Sent",
  failed: "Failed",
  skipped: "Skipped",
};

export type ApplicationStatusBadge = {
  label: string;
  badgeClassName: string;
  borderClassName?: string;
};

const approvalStatusStyles: Record<
  ApplicationStatus,
  { badge: string; border: string }
> = {
  pending_review: {
    badge: "bg-light-teal text-dark-teal",
    border: "border-muted-teal",
  },
  approved: {
    badge: "bg-orange-100 text-orange-800",
    border: "border-orange-500",
  },
  rejected: {
    badge: "bg-red-100 text-red-800",
    border: "border-deep-red",
  },
  completed: {
    badge: "bg-green-100 text-green-800",
    border: "border-green-600",
  },
};

const paymentStatusStyles: Record<ApplicationPaymentStatus, { badge: string }> =
  {
    not_required: { badge: "bg-slate-100 text-slate-700" },
    pending: { badge: "bg-amber-100 text-amber-800" },
    received: { badge: "bg-green-100 text-green-800" },
  };

export function getApplicationApprovalDisplayStatus(
  status: ApplicationStatus
): ApplicationStatusBadge {
  const styles = approvalStatusStyles[status];
  const labels: Record<ApplicationStatus, string> = {
    pending_review: "Approval pending",
    approved: "Approved",
    rejected: "Approval rejected",
    completed: "Completed",
  };

  return {
    label: labels[status],
    badgeClassName: styles.badge,
    borderClassName: styles.border,
  };
}

export function getApplicationPaymentDisplayStatus(
  paymentStatus: ApplicationPaymentStatus
): ApplicationStatusBadge {
  const labels: Record<ApplicationPaymentStatus, string> = {
    not_required: "Payment not required",
    pending: "Payment pending",
    received: "Payment received",
  };

  return {
    label: labels[paymentStatus],
    badgeClassName: paymentStatusStyles[paymentStatus].badge,
  };
}

export function isApplicationCompleted(
  application: Pick<
    VenueHireApplicationRecord | FilmingApplicationRecord,
    "status" | "payment_status"
  >
): boolean {
  return (
    application.status === "completed" ||
    (application.status === "approved" &&
      application.payment_status === "received")
  );
}

export function getApplicationListStatusPills(
  application: Pick<
    VenueHireApplicationRecord | FilmingApplicationRecord,
    "status" | "payment_status"
  >
): ApplicationStatusBadge[] {
  if (isApplicationCompleted(application)) {
    return [
      {
        label: "Completed",
        badgeClassName: approvalStatusStyles.completed.badge,
        borderClassName: approvalStatusStyles.completed.border,
      },
    ];
  }

  if (application.status === "rejected") {
    return [getApplicationApprovalDisplayStatus("rejected")];
  }

  return [
    getApplicationApprovalDisplayStatus(application.status),
    getApplicationPaymentDisplayStatus(application.payment_status),
  ];
}

export function getApplicationListBorderClassName(
  application: Pick<
    VenueHireApplicationRecord | FilmingApplicationRecord,
    "status" | "payment_status"
  >
): string {
  if (isApplicationCompleted(application)) {
    return approvalStatusStyles.completed.border;
  }

  if (application.status === "rejected") {
    return approvalStatusStyles.rejected.border;
  }

  if (application.status === "approved") {
    return approvalStatusStyles.approved.border;
  }

  return approvalStatusStyles.pending_review.border;
}

const statusSortPriority: Record<ApplicationStatus, number> = {
  pending_review: 0,
  approved: 1,
  rejected: 2,
  completed: 3,
};

export function sortApplications<
  T extends { status: ApplicationStatus; created_at: string },
>(applications: T[]): T[] {
  return [...applications].sort((a, b) => {
    const priorityDiff =
      statusSortPriority[a.status] - statusSortPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export type ApplicationListFilter = "pending" | "all" | "completed" | "rejected";

export function isApplicationPending(
  application: Pick<
    VenueHireApplicationRecord | FilmingApplicationRecord,
    "status" | "payment_status"
  >
): boolean {
  if (application.status === "rejected" || isApplicationCompleted(application)) {
    return false;
  }

  return (
    application.status === "pending_review" ||
    application.payment_status === "pending"
  );
}

export function filterApplications<
  T extends Pick<
    VenueHireApplicationRecord | FilmingApplicationRecord,
    "status" | "payment_status"
  >,
>(applications: T[], filter: ApplicationListFilter): T[] {
  switch (filter) {
    case "pending":
      return applications.filter(isApplicationPending);
    case "completed":
      return applications.filter(isApplicationCompleted);
    case "rejected":
      return applications.filter(
        (application) => application.status === "rejected"
      );
    case "all":
    default:
      return applications;
  }
}

export const durationTypeLabels: Record<string, string> = {
  "half-day": "Half day (K500)",
  "full-day": "Full day (K1,000)",
};

export const locationTypeLabels: Record<string, string> = {
  "events-lawn": "Events Lawn",
  "squash-courtyard": "Squash Courtyard",
  "other-area": "Other specific area",
};
