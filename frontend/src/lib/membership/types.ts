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
  quoted_amount: number | null;
  quoted_price_label: string | null;
  pricing_period_id: string | null;
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

export type ApplicationDisplayStatusVariant =
  | "rejected"
  | "completed"
  | "payment_received"
  | "approved"
  | "pending_review";

export type ApplicationDisplayStatus = {
  label: string;
  variant: ApplicationDisplayStatusVariant;
  badgeClassName: string;
  borderClassName: string;
};

export type ApplicationStatusBadge = {
  label: string;
  badgeClassName: string;
  borderClassName?: string;
};

const approvalStatusStyles: Record<
  MembershipApplicationStatus,
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

const paymentStatusStyles: Record<
  MembershipPaymentStatus,
  { badge: string }
> = {
  not_required: {
    badge: "bg-slate-100 text-slate-700",
  },
  pending: {
    badge: "bg-amber-100 text-amber-800",
  },
  received: {
    badge: "bg-green-100 text-green-800",
  },
};

export function getApplicationApprovalDisplayStatus(
  status: MembershipApplicationStatus
): ApplicationStatusBadge {
  const styles = approvalStatusStyles[status];
  const labels: Record<MembershipApplicationStatus, string> = {
    pending_review: "Approval pending",
    approved: "Membership approved",
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
  paymentStatus: MembershipPaymentStatus
): ApplicationStatusBadge {
  const styles = paymentStatusStyles[paymentStatus];
  const labels: Record<MembershipPaymentStatus, string> = {
    not_required: "Payment not required",
    pending: "Payment pending",
    received: "Payment received",
  };

  return {
    label: labels[paymentStatus],
    badgeClassName: styles.badge,
  };
}

export function isApplicationCompleted(
  application: Pick<MembershipApplicationRecord, "status" | "payment_status">
): boolean {
  return (
    application.status === "completed" ||
    (application.status === "approved" &&
      application.payment_status === "received")
  );
}

export function getApplicationListStatusPills(
  application: Pick<MembershipApplicationRecord, "status" | "payment_status">
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
  application: Pick<MembershipApplicationRecord, "status" | "payment_status">
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

const displayStatusStyles: Record<
  ApplicationDisplayStatusVariant,
  { badge: string; border: string }
> = {
  rejected: {
    badge: "bg-red-100 text-red-800",
    border: "border-deep-red",
  },
  completed: {
    badge: "bg-green-100 text-green-800",
    border: "border-green-600",
  },
  payment_received: {
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-500",
  },
  approved: {
    badge: "bg-orange-100 text-orange-800",
    border: "border-orange-500",
  },
  pending_review: {
    badge: "bg-light-teal text-dark-teal",
    border: "border-muted-teal",
  },
};

export function getApplicationDisplayStatus(
  application: Pick<MembershipApplicationRecord, "status" | "payment_status">
): ApplicationDisplayStatus {
  let variant: ApplicationDisplayStatusVariant;
  let label: string;

  if (application.status === "rejected") {
    variant = "rejected";
    label = applicationStatusLabels.rejected;
  } else if (
    application.status === "completed" ||
    (application.status === "approved" &&
      application.payment_status === "received")
  ) {
    variant = "completed";
    label = applicationStatusLabels.completed;
  } else if (application.payment_status === "received") {
    variant = "payment_received";
    label = "Payment received";
  } else if (application.status === "approved") {
    variant = "approved";
    label = applicationStatusLabels.approved;
  } else {
    variant = "pending_review";
    label = applicationStatusLabels.pending_review;
  }

  const styles = displayStatusStyles[variant];
  return {
    label,
    variant,
    badgeClassName: styles.badge,
    borderClassName: styles.border,
  };
}

const statusSortPriority: Record<MembershipApplicationStatus, number> = {
  pending_review: 0,
  approved: 1,
  rejected: 2,
  completed: 3,
};

export function sortMembershipApplications(
  applications: MembershipApplicationRecord[]
): MembershipApplicationRecord[] {
  return [...applications].sort((a, b) => {
    const priorityDiff =
      statusSortPriority[a.status] - statusSortPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });
}

export type ApplicationListFilter = "pending" | "all" | "completed" | "rejected";

export function isApplicationPending(
  application: Pick<MembershipApplicationRecord, "status" | "payment_status">
): boolean {
  if (application.status === "rejected" || isApplicationCompleted(application)) {
    return false;
  }

  return (
    application.status === "pending_review" ||
    application.payment_status === "pending"
  );
}

export function filterMembershipApplications(
  applications: MembershipApplicationRecord[],
  filter: ApplicationListFilter
): MembershipApplicationRecord[] {
  switch (filter) {
    case "pending":
      return applications.filter(isApplicationPending);
    case "completed":
      return applications.filter(
        (application) =>
          application.status === "completed" ||
          (application.status === "approved" &&
            application.payment_status === "received")
      );
    case "rejected":
      return applications.filter(
        (application) => application.status === "rejected"
      );
    case "all":
    default:
      return applications;
  }
}
