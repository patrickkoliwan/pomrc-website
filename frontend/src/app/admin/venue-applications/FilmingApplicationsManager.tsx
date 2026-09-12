"use client";

import { useMemo, useState, type FormEvent } from "react";
import { getHireVenueLabel } from "@/data/hireVenues";
import { getPremisesAreaLabel } from "@/data/premisesAreas";
import {
  durationTypeLabels,
  filterApplications,
  getApplicationListBorderClassName,
  getApplicationListStatusPills,
  locationTypeLabels,
  sortApplications,
  type ApplicationListFilter,
  type FilmingApplicationRecord,
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

export default function FilmingApplicationsManager({
  applications,
}: {
  applications: FilmingApplicationRecord[];
}) {
  const [items, setItems] = useState<FilmingApplicationRecord[]>(() =>
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

    return filtered.filter(
      (application) =>
        application.name.toLowerCase().includes(query) ||
        application.organization.toLowerCase().includes(query)
    );
  }, [items, filter, searchQuery]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  function openApplication(application: FilmingApplicationRecord) {
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
      `/api/admin/filming-applications/${selected.id}`,
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
          No filming applications have been submitted yet.
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
            placeholder="Search by name or organization"
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
                    {application.organization} ·{" "}
                    {formatDate(application.activity_date)} ·{" "}
                    {durationTypeLabels[application.duration_type] ??
                      application.duration_type}
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
                  Filming application submitted{" "}
                  {formatDate(selected.created_at)}
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

                <FilmingApplicationDetails application={selected} />

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

function formatFilmingLocation(application: FilmingApplicationRecord): string {
  const data = application.submitted_data;
  const base =
    locationTypeLabels[data.locationSelection.locationType] ??
    data.locationSelection.locationType;

  if (data.locationSelection.locationType === "events-lawn") {
    return getHireVenueLabel("events-lawn");
  }

  if (data.locationSelection.locationType === "squash-courtyard") {
    return getHireVenueLabel("squash-courtyard");
  }

  if (data.locationSelection.specificArea === "other") {
    return `${base}: ${data.locationSelection.specificAreaOther ?? ""}`;
  }

  if (data.locationSelection.specificArea) {
    return `${base}: ${getPremisesAreaLabel(data.locationSelection.specificArea)}`;
  }

  return base;
}

function FilmingApplicationDetails({
  application,
}: {
  application: FilmingApplicationRecord;
}) {
  const data = application.submitted_data;

  return (
    <div className="space-y-5 border-t border-muted-teal/20 pt-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-teal">
        Submitted details
      </h3>
      <DetailSection
        title="Applicant"
        rows={[
          ["Name", data.applicantInfo.name],
          ["Phone", data.applicantInfo.phone],
          ["Email", data.applicantInfo.email],
          ["Organization", data.organization],
          ["Contact details", data.contactDetails],
          ["POMRC member involved", data.pomrcMemberInvolved || "-"],
        ]}
      />
      <DetailSection
        title="Production"
        rows={[
          ["Purpose", data.productionPurpose],
          ["Location", formatFilmingLocation(application)],
          ["Activity date", data.activityDate],
          ["Start time", data.activityStartTime],
          ["End time", data.activityEndTime],
          [
            "Duration / fee",
            durationTypeLabels[data.durationType] ?? data.durationType,
          ],
        ]}
      />
      <DetailSection
        title="People on grounds"
        rows={data.peopleOnGrounds.flatMap((person, index) => [
          [`Person ${index + 1} name`, person.name],
          [`Person ${index + 1} position`, person.position],
        ])}
      />
      <DetailSection
        title="Acknowledgements"
        rows={[
          ["Fees acknowledged", data.acknowledgements.feesAcknowledged],
          [
            "Damages and tidiness acknowledged",
            data.acknowledgements.damagesAndTidyAcknowledged,
          ],
          ["Insurance acknowledged", data.acknowledgements.insuranceAcknowledged],
          [
            "Committee approval acknowledged",
            data.acknowledgements.committeeApprovalAcknowledged,
          ],
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
  application: FilmingApplicationRecord
): EditableFields {
  return {
    status: application.status,
    payment_status: application.payment_status,
    admin_notes: application.admin_notes ?? "",
  };
}
