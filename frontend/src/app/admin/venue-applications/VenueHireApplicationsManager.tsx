"use client";

import { useMemo, useState, type FormEvent } from "react";
import { getHireVenueLabel } from "@/data/hireVenues";
import {
  filterApplications,
  getApplicationListBorderClassName,
  getApplicationListStatusPills,
  sortApplications,
  type ApplicationListFilter,
  type VenueHireApplicationRecord,
} from "@/lib/venue-applications/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import {
  ApplicationStatusBadge,
  ApprovalEmailNotice,
  ApprovalEmailStatusBlock,
  DetailSection,
  EditableFields,
  filterOptions,
  formatDate,
  formatEmailTrackingRows,
  getSaveReviewToastMessage,
  ReviewStatusFields,
} from "./shared-application-ui";

export default function VenueHireApplicationsManager({
  applications,
}: {
  applications: VenueHireApplicationRecord[];
}) {
  const [items, setItems] = useState<VenueHireApplicationRecord[]>(() =>
    sortApplications(applications)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
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
    const filtered = filterApplications(items, filter);
    const query = searchQuery.trim().toLowerCase();

    if (!query) return filtered;

    return filtered.filter((application) =>
      application.name.toLowerCase().includes(query)
    );
  }, [items, filter, searchQuery]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  function openApplication(application: VenueHireApplicationRecord) {
    setSelectedId(application.id);
    setEditing(toEditableFields(application));
    setIsSaving(false);
    setToastMessage(null);
    setError(null);
    setReviewOpen(true);
  }

  function closeReviewModal() {
    setReviewOpen(false);
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
      `/api/admin/venue-hire-applications/${selected.id}`,
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
      sortApplications(
        current.map((item) => (item.id === result.data.id ? result.data : item))
      )
    );
    setEditing(toEditableFields(result.data));
    setIsSaving(false);
    setToastMessage(
      getSaveReviewToastMessage(result.data.email, result.approvalEmail)
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm text-dark-teal/75">
          No venue hire requests have been submitted yet.
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
        duration={5000}
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
            No requests match this filter.
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
                      {application.name}
                    </span>
                    <time
                      dateTime={application.created_at}
                      className="shrink-0 text-xs text-muted-teal sm:text-sm"
                    >
                      {formatDate(application.created_at)}
                    </time>
                  </div>
                  <p className="text-sm text-dark-teal/75">
                    {application.event_type} · {application.expected_guests}{" "}
                    guests
                  </p>
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
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto border-muted-teal/30 bg-light-cream text-dark-teal">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-dark-teal">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="text-muted-teal">
                  Venue hire request submitted {formatDate(selected.created_at)}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={saveReview} className="space-y-5">
                <ReviewStatusFields
                  editing={editing}
                  onChange={setEditing}
                />

                {selected.status === "approved" && (
                  <ApprovalEmailStatusBlock
                    email={selected.email}
                    phone={selected.phone}
                    approvalEmailStatus={selected.approval_email_status}
                    approvalEmailSentAt={selected.approval_email_sent_at}
                    approvalEmailError={selected.approval_email_error}
                  />
                )}

                <ApprovalEmailNotice
                  currentStatus={selected.status}
                  editingStatus={editing.status}
                />

                <VenueHireApplicationDetails application={selected} />

                {error && <p className="text-sm text-deep-red">{error}</p>}

                <DialogFooter>
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
    </>
  );
}

function VenueHireApplicationDetails({
  application,
}: {
  application: VenueHireApplicationRecord;
}) {
  const data = application.submitted_data;

  return (
    <div className="space-y-5 border-t border-muted-teal/20 pt-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-teal">
        Submitted details
      </h3>
      <DetailSection
        title="Contact"
        rows={[
          ["Name", data.personalInfo.name],
          ["Phone", data.personalInfo.phone],
          ["Email", data.personalInfo.email],
        ]}
      />
      <DetailSection
        title="Event"
        rows={[
          ["Event type", data.eventDetails.eventType],
          ["Expected guests", String(data.eventDetails.expectedGuests)],
          ["Venue", getHireVenueLabel(data.venueSelection.selectedVenue)],
          ["Terms accepted", data.termsAccepted ? "Yes" : "No"],
        ]}
      />
      <DetailSection
        title="Tracking"
        rows={formatEmailTrackingRows(
          application.email_status,
          application.email_error,
          application.approval_email_status,
          application.approval_email_error,
          application.approval_email_sent_at
        )}
      />
    </div>
  );
}

function toEditableFields(
  application: VenueHireApplicationRecord
): EditableFields {
  return {
    status: application.status,
    payment_status: application.payment_status,
    admin_notes: application.admin_notes ?? "",
  };
}
