"use client";

import type { ReactNode } from "react";
import {
  applicationStatusLabels,
  approvalEmailStatusLabels,
  applicationStatuses,
  applicationPaymentStatuses,
  paymentStatusLabels,
  emailStatusLabels,
  type ApplicationListFilter,
  type ApplicationPaymentStatus,
  type ApplicationStatus,
} from "@/lib/venue-applications/types";

export const filterOptions: Array<{ value: ApplicationListFilter; label: string }> =
  [
    { value: "pending", label: "Pending" },
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ];

export type EditableFields = {
  status: ApplicationStatus;
  payment_status: ApplicationPaymentStatus;
  admin_notes: string;
};

export type ApprovalEmailResponse = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

export function ApplicationStatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-md px-2 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function FieldFrame({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-dark-teal">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function DetailSection({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string | boolean | null | undefined]>;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-teal">
        {title}
      </h3>
      <dl className="divide-y divide-muted-teal/20 rounded-md border border-muted-teal/20">
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </dl>
    </div>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | boolean | null | undefined;
}) {
  return (
    <div className="grid gap-1 px-3 py-2 text-sm sm:grid-cols-[150px_1fr]">
      <dt className="font-medium text-dark-teal">{label}</dt>
      <dd className="break-words text-dark-teal/75">
        {value === true ? "Yes" : value === false ? "No" : value || "-"}
      </dd>
    </div>
  );
}

export function ReviewStatusFields({
  editing,
  onChange,
}: {
  editing: EditableFields;
  onChange: (fields: EditableFields) => void;
}) {
  return (
    <>
      <FieldFrame label="Approval status" id="application-status">
        <select
          id="application-status"
          value={editing.status}
          onChange={(event) =>
            onChange({
              ...editing,
              status: event.target.value as ApplicationStatus,
            })
          }
          className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        >
          {applicationStatuses.map((value) => (
            <option key={value} value={value}>
              {applicationStatusLabels[value]}
            </option>
          ))}
        </select>
      </FieldFrame>

      <FieldFrame label="Payment status" id="payment-status">
        <select
          id="payment-status"
          value={editing.payment_status}
          onChange={(event) =>
            onChange({
              ...editing,
              payment_status: event.target.value as ApplicationPaymentStatus,
            })
          }
          className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        >
          {applicationPaymentStatuses.map((value) => (
            <option key={value} value={value}>
              {paymentStatusLabels[value]}
            </option>
          ))}
        </select>
      </FieldFrame>

      <FieldFrame label="Admin notes" id="admin-notes">
        <textarea
          id="admin-notes"
          value={editing.admin_notes}
          onChange={(event) =>
            onChange({ ...editing, admin_notes: event.target.value })
          }
          rows={4}
          className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        />
      </FieldFrame>
    </>
  );
}

export function ApprovalEmailNotice({
  currentStatus,
  editingStatus,
}: {
  currentStatus: ApplicationStatus;
  editingStatus: ApplicationStatus;
}) {
  if (editingStatus === "approved" && currentStatus !== "approved") {
    return (
      <p className="rounded-md border border-muted-teal/30 bg-light-teal px-3 py-2 text-sm text-dark-teal/75">
        Save the review as approved to send the approval email automatically.
      </p>
    );
  }

  return null;
}

export function ApprovalEmailStatusBlock({
  email,
  phone,
  approvalEmailStatus,
  approvalEmailSentAt,
  approvalEmailError,
}: {
  email: string;
  phone: string;
  approvalEmailStatus: string;
  approvalEmailSentAt: string | null;
  approvalEmailError: string | null;
}) {
  const statusLabel =
    approvalEmailStatusLabels[
      approvalEmailStatus as keyof typeof approvalEmailStatusLabels
    ] ?? approvalEmailStatus;

  return (
    <div className="space-y-2 rounded-md border border-muted-teal/30 bg-white p-4">
      <h3 className="text-sm font-semibold text-dark-teal">Approval email</h3>
      <p className="text-sm text-dark-teal/75">
        Applicant email:{" "}
        <span className="font-medium text-dark-teal">{email}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <ApplicationStatusBadge
          label={`Approval email: ${statusLabel}`}
          className={
            approvalEmailStatus === "sent"
              ? "bg-green-100 text-green-800"
              : approvalEmailStatus === "failed"
                ? "bg-red-100 text-red-800"
                : approvalEmailStatus === "skipped"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-light-teal text-dark-teal"
          }
        />
        {approvalEmailSentAt && (
          <span className="text-xs text-muted-teal">
            Sent {formatDate(approvalEmailSentAt)}
          </span>
        )}
      </div>
      {approvalEmailStatus === "skipped" && (
        <p className="text-sm text-amber-900">
          Approval email could not be sent — contact the applicant by phone on{" "}
          <span className="font-medium">{phone}</span>.
        </p>
      )}
      {approvalEmailError && (
        <p className="text-sm text-deep-red">{approvalEmailError}</p>
      )}
    </div>
  );
}

export function getSaveReviewToastMessage(
  email: string,
  approvalEmail?: ApprovalEmailResponse
) {
  if (!approvalEmail) {
    return "Review saved";
  }

  if (approvalEmail.sent) {
    return `Review saved. Approval email sent to ${email}.`;
  }

  if (approvalEmail.skipped) {
    return "Review saved. Approval email not sent — invalid email address.";
  }

  return "Review saved. Approval email failed to send — check status below.";
}

export function formatDate(value: string) {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatEmailTrackingRows(
  emailStatus: string,
  emailError: string | null,
  approvalEmailStatus: string,
  approvalEmailError: string | null,
  approvalEmailSentAt: string | null
): Array<[string, string | null | undefined]> {
  const approvalLabel =
    approvalEmailStatusLabels[
      approvalEmailStatus as keyof typeof approvalEmailStatusLabels
    ] ?? approvalEmailStatus;

  return [
    [
      "Submission notification",
      emailStatusLabels[emailStatus as keyof typeof emailStatusLabels] ??
        emailStatus,
    ],
    ["Submission email error", emailError],
    [
      "Approval email",
      approvalEmailSentAt
        ? `${approvalLabel} (${formatDate(approvalEmailSentAt)})`
        : approvalLabel,
    ],
    ["Approval email error", approvalEmailError],
  ];
}
