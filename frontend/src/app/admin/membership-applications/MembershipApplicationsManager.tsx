"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  applicationStatusLabels,
  emailStatusLabels,
  filterMembershipApplications,
  getApplicationListBorderClassName,
  getApplicationListStatusPills,
  membershipApplicationStatuses,
  membershipPaymentStatuses,
  paymentStatusLabels,
  sortMembershipApplications,
  type ApplicationListFilter,
  type MembershipApplicationRecord,
  type MembershipApplicationStatus,
  type MembershipPaymentStatus,
} from "@/lib/membership/types";
import type { MembershipFormData } from "@/app/membership/utils/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";

type EditableFields = {
  status: MembershipApplicationStatus;
  payment_status: MembershipPaymentStatus;
  admin_notes: string;
};

const filterOptions: Array<{ value: ApplicationListFilter; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export default function MembershipApplicationsManager({
  applications,
}: {
  applications: MembershipApplicationRecord[];
}) {
  const [items, setItems] = useState<MembershipApplicationRecord[]>(() =>
    sortMembershipApplications(applications)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<ApplicationListFilter>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<EditableFields>({
    status: "pending_review",
    payment_status: "pending",
    admin_notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const filtered = filterMembershipApplications(items, filter);
    const query = searchQuery.trim().toLowerCase();

    if (!query) return filtered;

    return filtered.filter((application) => {
      const fullName =
        `${application.first_name} ${application.surname}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [items, filter, searchQuery]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  function openApplication(application: MembershipApplicationRecord) {
    setSelectedId(application.id);
    setEditing(toEditableFields(application));
    setIsSaving(false);
    setToastMessage(null);
    setError(null);
    setReviewOpen(true);
  }

  function closeReviewModal() {
    setReviewOpen(false);
    setDetailsOpen(false);
    setSelectedId(null);
    setIsSaving(false);
    setToastMessage(null);
    setError(null);
  }

  async function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected) return;

    setIsSaving(true);
    setError(null);

    const response = await fetch(
      `/api/admin/membership-applications/${selected.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      setIsSaving(false);
      setError(result.error || "Save failed");
      return;
    }

    setItems((current) =>
      sortMembershipApplications(
        current.map((item) =>
          item.id === result.data.id ? result.data : item
        )
      )
    );
    setEditing(toEditableFields(result.data));
    setIsSaving(false);
    setToastMessage("Review saved");
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm text-dark-teal/75">
          No membership applications have been submitted yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toastMessage ?? ""}
        open={toastMessage !== null}
        onClose={() => setToastMessage(null)}
      />
      <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-nowrap gap-2 sm:w-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition sm:flex-none sm:px-3 sm:text-sm ${
                  filter === option.value
                    ? "bg-dark-teal text-light-cream"
                    : "bg-light-teal text-dark-teal hover:bg-muted-teal/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name"
            className="w-full rounded-md border border-muted-teal px-3 py-2 text-sm text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal sm:max-w-xs"
          />
        </div>

        {filteredItems.length === 0 ? (
          <p className="py-6 text-sm text-muted-teal">
            No applications match this filter.
          </p>
        ) : (
          <div className="divide-y divide-muted-teal/20 rounded-md border border-muted-teal/20">
            {filteredItems.map((application) => {
              const statusPills = getApplicationListStatusPills(application);
              const borderClassName =
                getApplicationListBorderClassName(application);

              return (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => openApplication(application)}
                  className={`flex w-full flex-col gap-2 border-l-4 px-3 py-3 text-left transition hover:bg-light-teal/60 ${borderClassName} ${
                    selectedId === application.id && reviewOpen
                      ? "bg-light-teal"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate font-semibold text-dark-teal">
                      {application.first_name} {application.surname}
                    </span>
                    <time
                      dateTime={application.created_at}
                      className="shrink-0 text-xs text-muted-teal sm:text-sm"
                    >
                      {formatDate(application.created_at)}
                    </time>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {statusPills.map((pill) => (
                      <ApplicationStatusBadge
                        key={pill.label}
                        label={pill.label}
                        className={pill.badgeClassName}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <Dialog
        open={reviewOpen}
        onOpenChange={(open) => {
          if (!open) closeReviewModal();
        }}
      >
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-xl overflow-y-auto border-muted-teal/30 bg-light-cream text-dark-teal">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-dark-teal">
                  {selected.first_name} {selected.surname}
                </DialogTitle>
                <DialogDescription className="text-muted-teal">
                  Submitted {formatDate(selected.created_at)}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={saveReview} className="space-y-5">
                <FieldFrame label="Review status" id="application-status">
                  <select
                    id="application-status"
                    value={editing.status}
                    onChange={(event) =>
                      setEditing((current) => ({
                        ...current,
                        status: event.target
                          .value as MembershipApplicationStatus,
                      }))
                    }
                    className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  >
                    {membershipApplicationStatuses.map((value) => (
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
                      setEditing((current) => ({
                        ...current,
                        payment_status: event.target
                          .value as MembershipPaymentStatus,
                      }))
                    }
                    className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  >
                    {membershipPaymentStatuses.map((value) => (
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
                      setEditing((current) => ({
                        ...current,
                        admin_notes: event.target.value,
                      }))
                    }
                    rows={6}
                    className="w-full rounded-md border border-muted-teal bg-white px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                  />
                </FieldFrame>

                {error && <p className="text-sm text-deep-red">{error}</p>}

                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setDetailsOpen(true)}
                    className="rounded-md border border-dark-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
                  >
                    View submitted details
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save review"}
                  </button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto border-muted-teal/30 bg-light-cream text-dark-teal">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-dark-teal">
                  Submitted details
                </DialogTitle>
                <DialogDescription className="text-muted-teal">
                  {selected.first_name} {selected.surname}
                </DialogDescription>
              </DialogHeader>
              <ApplicationDetails application={selected} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ApplicationStatusBadge({
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

function ApplicationDetails({
  application,
}: {
  application: MembershipApplicationRecord;
}) {
  const data = application.submitted_data;

  return (
    <div className="space-y-5">
      <DetailSection
        title="Personal information"
        rows={[
          ["First name", data.personalInfo.firstName],
          ["Surname", data.personalInfo.surname],
          ["Phone", data.personalInfo.phone],
          ["Email", data.personalInfo.email],
          ["Address", data.personalInfo.address],
        ]}
      />
      <DetailSection
        title="Membership"
        rows={[
          ["Status", formatValue(data.membershipStatus)],
          ["Type", formatValue(data.membershipType)],
          ["Email notification", emailStatusLabels[application.email_status]],
          ["Email error", application.email_error],
        ]}
      />
      <EndorsementsDetails data={data} />
      <FamilyDetails data={data} />
      <DetailSection
        title="Club involvement"
        rows={[
          [
            "Interested in club officer role",
            data.clubInvolvement.interestedInClubOfficer ? "Yes" : "No",
          ],
          ["Skills", data.clubInvolvement.skills],
          ["Declaration accepted", data.declaration ? "Yes" : "No"],
        ]}
      />
    </div>
  );
}

function EndorsementsDetails({ data }: { data: MembershipFormData }) {
  if (!data.endorsements) return null;

  return (
    <DetailSection
      title="Endorsements"
      rows={[
        ["First endorser", data.endorsements.firstEndorser.name],
        ["First endorser contact", data.endorsements.firstEndorser.contact],
        ["Second endorser", data.endorsements.secondEndorser.name],
        ["Second endorser contact", data.endorsements.secondEndorser.contact],
      ]}
    />
  );
}

function FamilyDetails({ data }: { data: MembershipFormData }) {
  const spouse = data.familyDetails?.spouse;
  const children = data.familyDetails?.children || [];

  if (!spouse && children.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-teal">
        Family details
      </h3>
      {spouse && (
        <dl className="mb-4 divide-y divide-muted-teal/20 rounded-md border border-muted-teal/20">
          <DetailRow label="Spouse name" value={spouse.name} />
          <DetailRow label="Spouse gender" value={spouse.gender} />
          <DetailRow
            label="Spouse playing level"
            value={formatValue(spouse.playingLevel)}
          />
        </dl>
      )}
      {children.map((child, index) => (
        <dl
          key={`${child.name}-${index}`}
          className="mb-3 divide-y divide-muted-teal/20 rounded-md border border-muted-teal/20"
        >
          <DetailRow label={`Child ${index + 1} name`} value={child.name} />
          <DetailRow label="Gender" value={child.gender} />
          <DetailRow label="Date of birth" value={child.dateOfBirth} />
          <DetailRow
            label="Playing level"
            value={formatValue(child.playingLevel)}
          />
        </dl>
      ))}
    </div>
  );
}

function DetailSection({
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

function DetailRow({
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

function FieldFrame({
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

function toEditableFields(
  application: MembershipApplicationRecord
): EditableFields {
  return {
    status: application.status,
    payment_status: application.payment_status,
    admin_notes: application.admin_notes ?? "",
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatValue(value: string | undefined) {
  return value ? value.replace(/_/g, " ").toLowerCase() : "-";
}
