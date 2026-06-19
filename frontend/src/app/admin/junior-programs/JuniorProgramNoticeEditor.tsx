"use client";

import { useState } from "react";
import type {
  JuniorProgramNoticeRecord,
  JuniorProgramNoticeSection,
} from "@/lib/cms/types";

const defaultNotice: Pick<
  JuniorProgramNoticeRecord,
  "message" | "section" | "enabled"
> = {
  message: "",
  section: "tennis",
  enabled: false,
};

type NoticeForm = typeof defaultNotice;

const sectionOptions: { label: string; value: JuniorProgramNoticeSection }[] = [
  { label: "Top of junior programs page", value: "page" },
  { label: "Tennis Programs", value: "tennis" },
  { label: "Squash Programs", value: "squash" },
  { label: "Other Programs", value: "other" },
];

export default function JuniorProgramNoticeEditor({
  notice,
}: {
  notice: JuniorProgramNoticeRecord | null;
}) {
  const [form, setForm] = useState<NoticeForm>({
    message: notice?.message || defaultNotice.message,
    section: notice?.section || defaultNotice.section,
    enabled: notice?.enabled ?? defaultNotice.enabled,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveNotice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("Saving notice...");

    const response = await fetch("/api/admin/junior-program-notice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Notice save failed");
      return;
    }

    setForm({
      message: result.data.message || "",
      section: result.data.section || "tennis",
      enabled: Boolean(result.data.enabled),
    });
    setStatus("Notice saved.");
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark-teal">
          Important notice
        </h2>
        <p className="mt-1 text-sm leading-6 text-dark-teal/75">
          Manage the single notice shown before junior program cards.
        </p>
      </div>

      <form onSubmit={saveNotice} className="space-y-5">
        <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                enabled: event.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-muted-teal text-dark-teal"
          />
          Show notice on junior programs page
        </label>

        <div>
          <label
            htmlFor="junior-program-notice-section"
            className="block text-sm font-medium text-dark-teal"
          >
            Placement
          </label>
          <select
            id="junior-program-notice-section"
            value={form.section}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                section: event.target.value as JuniorProgramNoticeSection,
              }))
            }
            className="mt-2 w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
          >
            {sectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="junior-program-notice-message"
            className="block text-sm font-medium text-dark-teal"
          >
            Message
          </label>
          <textarea
            id="junior-program-notice-message"
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            rows={4}
            className="mt-2 w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
          />
        </div>

        {error && <p className="text-sm text-deep-red">{error}</p>}
        {status && <p className="text-sm text-muted-teal">{status}</p>}

        <button
          type="submit"
          className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
        >
          Save notice
        </button>
      </form>
    </section>
  );
}
