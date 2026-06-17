"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  applicationStatusLabels,
  emailStatusLabels,
  membershipApplicationStatuses,
  membershipPaymentStatuses,
  paymentStatusLabels,
  type MembershipApplicationRecord,
  type MembershipApplicationStatus,
  type MembershipPaymentStatus,
} from "@/lib/membership/types";
import type { MembershipFormData } from "@/app/membership/utils/types";

type EditableFields = {
  status: MembershipApplicationStatus;
  payment_status: MembershipPaymentStatus;
  admin_notes: string;
};

export default function MembershipApplicationsManager({
  applications,
}: {
  applications: MembershipApplicationRecord[];
}) {
  const [items, setItems] =
    useState<MembershipApplicationRecord[]>(applications);
  const [selectedId, setSelectedId] = useState<string | null>(
    applications[0]?.id ?? null
  );
  const [editing, setEditing] = useState<EditableFields>(() =>
    toEditableFields(applications[0])
  );
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0] ?? null,
    [items, selectedId]
  );

  function selectApplication(application: MembershipApplicationRecord) {
    setSelectedId(application.id);
    setEditing(toEditableFields(application));
    setStatus(null);
    setError(null);
  }

  async function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected) return;

    setStatus("Saving...");
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
      setStatus(null);
      setError(result.error || "Save failed");
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === result.data.id ? result.data : item))
    );
    setStatus("Saved.");
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark-teal">
              Applications
            </h2>
            <p className="text-sm text-muted-teal">
              Newest submissions appear first.
            </p>
          </div>
          <p className="text-sm font-medium text-dark-teal">
            {items.length} total
          </p>
        </div>

        <div className="divide-y divide-muted-teal/20">
          {items.map((application) => (
            <button
              key={application.id}
              type="button"
              onClick={() => selectApplication(application)}
              className={`block w-full py-4 text-left transition ${
                selected?.id === application.id
                  ? "bg-light-teal px-3"
                  : "hover:bg-light-teal/60"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-dark-teal">
                    {application.first_name} {application.surname}
                  </h3>
                  <p className="text-sm text-muted-teal">
                    {application.email} - {application.phone}
                  </p>
                  <p className="mt-1 text-sm text-dark-teal/75">
                    {formatValue(application.membership_type)} -{" "}
                    {formatValue(application.membership_status)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <StatusPill label={applicationStatusLabels[application.status]} />
                  <StatusPill
                    label={`Payment: ${
                      paymentStatusLabels[application.payment_status]
                    }`}
                  />
                  <StatusPill label={formatDate(application.created_at)} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <aside className="space-y-6">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-dark-teal">
              Review application
            </h2>
            <p className="mt-1 text-sm text-muted-teal">
              Submitted {formatDate(selected.created_at)}
            </p>

            <form onSubmit={saveReview} className="mt-5 space-y-5">
              <FieldFrame label="Review status" id="application-status">
                <select
                  id="application-status"
                  value={editing.status}
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      status: event.target.value as MembershipApplicationStatus,
                    }))
                  }
                  className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
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
                  className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
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
                  className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                />
              </FieldFrame>

              {error && <p className="text-sm text-deep-red">{error}</p>}
              {status && <p className="text-sm text-muted-teal">{status}</p>}

              <button
                type="submit"
                className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
              >
                Save review
              </button>
            </form>
          </section>

          <ApplicationDetails application={selected} />
        </aside>
      )}
    </div>
  );
}

function ApplicationDetails({
  application,
}: {
  application: MembershipApplicationRecord;
}) {
  const data = application.submitted_data;

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-dark-teal">
        Submitted details
      </h2>
      <div className="mt-5 space-y-5">
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
    </section>
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

function StatusPill({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-light-teal px-2 py-1 text-xs font-medium text-dark-teal">
      {label}
    </span>
  );
}

function toEditableFields(
  application: MembershipApplicationRecord | undefined
): EditableFields {
  return {
    status: application?.status ?? "pending_review",
    payment_status: application?.payment_status ?? "pending",
    admin_notes: application?.admin_notes ?? "",
  };
}

function formatDate(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatValue(value: string | undefined) {
  return value ? value.replace(/_/g, " ").toLowerCase() : "-";
}
