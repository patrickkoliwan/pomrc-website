"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClubEventRecord } from "@/lib/cms/types";
import {
  classifyAdminEvents,
  isWeeklyEvent,
} from "@/lib/events/classify-events";
import CroppedImageUploader from "../components/CroppedImageUploader";
import { CMS_IMAGE_PRESETS } from "../components/image-presets";

const EVENT_POSTER_PRESET = CMS_IMAGE_PRESETS.eventPoster;

type EventType = "weekly" | "dated";

type EventDraft = {
  id?: string;
  title: string;
  description: string;
  day: string;
  event_date: string;
  start_time: string;
  end_time: string;
  price: string;
  members_free: boolean;
  image_url: string;
  display_order: number;
  published: boolean;
};

const EVENT_DESCRIPTION_MAX = 400;

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function normalizeWeekday(day: string): string {
  if (!day.trim()) {
    return "";
  }

  const lower = day.toLowerCase();

  return (
    WEEKDAYS.find(
      (name) =>
        lower === name.toLowerCase() ||
        lower.includes(name.toLowerCase()) ||
        lower.includes(name.slice(0, 3).toLowerCase())
    ) ?? ""
  );
}

const EMPTY_DRAFT: EventDraft = {
  title: "",
  description: "",
  day: "",
  event_date: "",
  start_time: "",
  end_time: "",
  price: "",
  members_free: false,
  image_url: "",
  display_order: 0,
  published: true,
};

function recordToDraft(record: ClubEventRecord): EventDraft {
  return {
    id: record.id,
    title: record.title,
    description: record.description ?? "",
    day: normalizeWeekday(record.day ?? ""),
    event_date: record.event_date ?? "",
    start_time: record.start_time ?? "",
    end_time: record.end_time ?? "",
    price: record.price ?? "",
    members_free: record.members_free ?? false,
    image_url: record.image_url ?? "",
    display_order: record.display_order,
    published: record.published,
  };
}

function inferEventType(draft: EventDraft): EventType | null {
  if (draft.day && !draft.event_date) {
    return "weekly";
  }
  if (draft.event_date) {
    return "dated";
  }
  return null;
}

function eventDateLabel(record: ClubEventRecord): string {
  if (isWeeklyEvent(record)) {
    return record.day ?? "—";
  }
  if (record.event_date) {
    return record.event_date;
  }
  return "—";
}

export default function AdminEventsManager({
  records,
}: {
  records: ClubEventRecord[];
}) {
  const [items, setItems] = useState<ClubEventRecord[]>(records);
  const [editing, setEditing] = useState<EventDraft | null>(null);
  const [eventType, setEventType] = useState<EventType | null>("weekly");
  const [typeError, setTypeError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { current, past, archived } = useMemo(
    () => classifyAdminEvents(items),
    [items]
  );

  function beginCreate() {
    setEditing({ ...EMPTY_DRAFT });
    setEventType("weekly");
    setTypeError(null);
    setScheduleError(null);
    setError(null);
    setStatus(null);
  }

  function beginEdit(record: ClubEventRecord) {
    const draft = recordToDraft(record);
    setEditing(draft);
    setEventType(inferEventType(draft));
    setTypeError(null);
    setScheduleError(null);
    setError(null);
    setStatus(null);
  }

  function closeEditing() {
    setEditing(null);
    setEventType(null);
    setTypeError(null);
    setScheduleError(null);
    setError(null);
    setStatus(null);
  }

  function updateField<K extends keyof EventDraft>(name: K, value: EventDraft[K]) {
    setEditing((current) => (current ? { ...current, [name]: value } : current));
    if (name === "day" || name === "event_date") {
      setScheduleError(null);
    }
  }

  function selectEventType(type: EventType) {
    setEventType(type);
    setTypeError(null);
    setScheduleError(null);
    setEditing((current) => {
      if (!current) {
        return current;
      }
      if (type === "weekly") {
        return { ...current, event_date: "" };
      }
      return { ...current, day: "" };
    });
  }

  function buildPayload(draft: EventDraft, type: EventType): EventDraft {
    const normalized = {
      ...draft,
      price: draft.price.trim(),
      start_time: draft.start_time.trim(),
      end_time: draft.end_time.trim(),
    };

    if (type === "weekly") {
      return {
        ...normalized,
        day: draft.day.trim(),
        event_date: "",
      };
    }
    return {
      ...normalized,
      day: "",
      event_date: draft.event_date,
    };
  }

  function validateForm(type: EventType | null, draft: EventDraft): boolean {
    let valid = true;

    if (!type) {
      setTypeError("Choose whether this is a weekly or dated event.");
      valid = false;
    } else {
      setTypeError(null);
    }

    if (type === "weekly" && !draft.day.trim()) {
      setScheduleError("Select the day of the week for weekly events.");
      valid = false;
    } else if (type === "dated" && !draft.event_date) {
      setScheduleError("Choose a date for dated events.");
      valid = false;
    } else {
      setScheduleError(null);
    }

    return valid;
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }

    if (!validateForm(eventType, editing)) {
      return;
    }

    const payload = buildPayload(editing, eventType as EventType);

    setError(null);
    setStatus("Saving...");
    const isUpdate = Boolean(editing.id);
    const url = isUpdate
      ? `/api/admin/cms/club_events/${editing.id}`
      : "/api/admin/cms/club_events";

    const response = await fetch(url, {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Save failed");
      return;
    }

    setItems((current) => {
      if (isUpdate) {
        return current.map((item) =>
          item.id === result.data.id ? result.data : item
        );
      }
      return [...current, result.data];
    });
    closeEditing();
  }

  async function deleteRecord(record: ClubEventRecord) {
    if (!window.confirm("Delete this event permanently?")) {
      return;
    }

    setError(null);
    setStatus("Deleting...");
    const response = await fetch(`/api/admin/cms/club_events/${record.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      setStatus(null);
      setError(result.error || "Delete failed");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== record.id));
    setStatus("Deleted.");
  }

  async function toggleArchive(record: ClubEventRecord) {
    const isPublished = record.published !== false;
    const action = isPublished ? "Archiving" : "Restoring";

    setError(null);
    setStatus(`${action}...`);
    const response = await fetch(`/api/admin/cms/club_events/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...record, published: !isPublished }),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || `${action} failed`);
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === result.data.id ? result.data : item))
    );
    if (editing?.id === result.data.id) {
      setEditing(recordToDraft(result.data));
      setEventType(inferEventType(recordToDraft(result.data)));
    }
    setStatus(isPublished ? "Archived." : "Restored.");
  }

  async function uploadImage(file: File | null) {
    if (!file) {
      return "";
    }

    setError(null);
    setStatus("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Upload failed");
      throw new Error(result.error || "Upload failed");
    }

    updateField("image_url", result.url);
    setStatus("Image uploaded.");
    return result.url as string;
  }

  return (
    <>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={beginCreate}
            className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
          >
            Add Event
          </button>
        </div>
        {items.length === 0 ? (
          <p className="rounded-md border border-muted-teal/20 bg-light-teal p-4 text-dark-teal">
            No events yet.
          </p>
        ) : (
          <div className="space-y-8">
            <EventGroup
              title="Current events"
              records={current}
              emptyMessage="No current events."
              onArchive={toggleArchive}
              onEdit={beginEdit}
              onDelete={deleteRecord}
            />
            <EventGroup
              title="Past events"
              records={past}
              emptyMessage="No past events."
              onArchive={toggleArchive}
              onEdit={beginEdit}
              onDelete={deleteRecord}
            />
            <EventGroup
              title="Archived events"
              records={archived}
              emptyMessage="No archived events."
              onArchive={toggleArchive}
              onEdit={beginEdit}
              onDelete={deleteRecord}
            />
          </div>
        )}
      </section>

      <Dialog open={!!editing} onOpenChange={(open) => !open && closeEditing()}>
        <DialogContent className="fixed inset-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-muted-teal/30 bg-light-cream p-0">
          <DialogHeader className="shrink-0 space-y-1 border-b border-muted-teal/30 px-4 py-4 text-left sm:px-6">
            <DialogTitle className="text-xl font-semibold text-dark-teal sm:text-2xl">
              {editing?.id ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editing?.id ? "Edit event details" : "Create a new event"}
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <form
                  id="admin-event-form"
                  onSubmit={saveRecord}
                  className="space-y-5"
                >
                  <EventTypeSelector
                    value={eventType}
                    onChange={selectEventType}
                    error={typeError}
                  />

                  {eventType === "weekly" && (
                    <FieldFrame label="Day of week" id="event-day" required>
                      <select
                        id="event-day"
                        required
                        value={editing.day}
                        onChange={(event) =>
                          updateField("day", event.target.value)
                        }
                        className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      >
                        <option value="">Select a day</option>
                        {WEEKDAYS.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </FieldFrame>
                  )}

                  {eventType === "dated" && (
                    <FieldFrame label="Event date" id="event-date" required>
                      <input
                        id="event-date"
                        type="date"
                        value={editing.event_date}
                        onChange={(event) =>
                          updateField("event_date", event.target.value)
                        }
                        className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      />
                    </FieldFrame>
                  )}

                  {scheduleError && (
                    <p className="text-sm text-deep-red">{scheduleError}</p>
                  )}

                  <FieldFrame label="Title" id="event-title" required>
                    <input
                      id="event-title"
                      type="text"
                      required
                      value={editing.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    />
                  </FieldFrame>

                  <FieldFrame
                    label="Description"
                    id="event-description"
                    helpText="Keep it brief — about 1–2 sentences. Descriptions over 120 characters are collapsed on the events page."
                  >
                    <textarea
                      id="event-description"
                      value={editing.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      maxLength={EVENT_DESCRIPTION_MAX}
                      rows={5}
                      className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    />
                    <p className="mt-1 text-xs text-muted-teal" aria-live="polite">
                      {editing.description.length}/{EVENT_DESCRIPTION_MAX} characters
                    </p>
                  </FieldFrame>

                  <FieldFrame label="Start time" id="event-start">
                    <input
                      id="event-start"
                      type="text"
                      value={editing.start_time}
                      onChange={(event) =>
                        updateField("start_time", event.target.value)
                      }
                      className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    />
                  </FieldFrame>

                  <FieldFrame label="End time" id="event-end">
                    <input
                      id="event-end"
                      type="text"
                      value={editing.end_time}
                      onChange={(event) => updateField("end_time", event.target.value)}
                      className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    />
                  </FieldFrame>

                  <FieldFrame
                    label="Price"
                    id="event-price"
                    helpText="Optional. Shown on the public events page, e.g. K5 per ticket or K20 entry."
                  >
                    <input
                      id="event-price"
                      type="text"
                      value={editing.price}
                      onChange={(event) => updateField("price", event.target.value)}
                      placeholder="e.g. K5 per ticket"
                      className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    />
                  </FieldFrame>

                  <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
                    <input
                      type="checkbox"
                      checked={Boolean(editing.members_free)}
                      onChange={(event) =>
                        updateField("members_free", event.target.checked)
                      }
                      className="h-4 w-4 rounded border-muted-teal text-dark-teal"
                    />
                    Members attend free
                  </label>

                  <FieldFrame label="Image" id="event-image">
                    <CroppedImageUploader
                      value={editing.image_url}
                      onChange={(value) => updateField("image_url", value)}
                      onUpload={uploadImage}
                      freeAspect
                      targetWidth={EVENT_POSTER_PRESET.targetWidth}
                      maxSizeMB={EVENT_POSTER_PRESET.maxSizeMB}
                      previewAlt="Event poster preview"
                      helpText="Phone photos welcome, including HEIC. Drag the crop corners to match your poster shape; large files are compressed automatically to WebP around 1200px."
                    />
                  </FieldFrame>

                  <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
                    <input
                      type="checkbox"
                      checked={Boolean(editing.published)}
                      onChange={(event) =>
                        updateField("published", event.target.checked)
                      }
                      className="h-4 w-4 rounded border-muted-teal text-dark-teal"
                    />
                    Visible on events page
                  </label>

                  {error && <p className="text-sm text-deep-red">{error}</p>}
                  {status && <p className="text-sm text-muted-teal">{status}</p>}
                </form>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-muted-teal/30 px-4 py-4 sm:px-6">
                <button
                  type="submit"
                  form="admin-event-form"
                  className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeEditing}
                  className="rounded-md border border-muted-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EventGroup({
  title,
  records,
  emptyMessage,
  onArchive,
  onEdit,
  onDelete,
}: {
  title: string;
  records: ClubEventRecord[];
  emptyMessage: string;
  onArchive: (record: ClubEventRecord) => void;
  onEdit: (record: ClubEventRecord) => void;
  onDelete: (record: ClubEventRecord) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-dark-teal">{title}</h3>
      {records.length === 0 ? (
        <p className="rounded-md border border-muted-teal/20 bg-light-teal p-4 text-sm text-dark-teal">
          {emptyMessage}
        </p>
      ) : (
        <div className="divide-y divide-muted-teal/20 rounded-md border border-muted-teal/20">
          {records.map((record) => (
            <EventListRow
              key={record.id}
              record={record}
              onArchive={onArchive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function EventListRow({
  record,
  onArchive,
  onEdit,
  onDelete,
}: {
  record: ClubEventRecord;
  onArchive: (record: ClubEventRecord) => void;
  onEdit: (record: ClubEventRecord) => void;
  onDelete: (record: ClubEventRecord) => void;
}) {
  return (
    <div className="flex gap-3 bg-white px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
      <EventPosterThumbnail record={record} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-sm leading-snug text-dark-teal">
          <span className="text-muted-teal">{eventDateLabel(record)}</span>
          <span className="mx-2 text-muted-teal">·</span>
          <span className="font-semibold">{record.title}</span>
        </p>
        <div className="flex flex-wrap gap-1.5 sm:shrink-0 sm:gap-2">
          <button
            type="button"
            onClick={() => onArchive(record)}
            className="min-w-[4.75rem] flex-1 rounded-md border border-muted-teal px-2 py-1.5 text-xs font-medium text-dark-teal hover:bg-light-teal sm:flex-none sm:px-3 sm:py-2 sm:text-sm"
          >
            {record.published === false ? "Restore" : "Archive"}
          </button>
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="min-w-[4.75rem] flex-1 rounded-md border border-muted-teal px-2 py-1.5 text-xs font-medium text-dark-teal hover:bg-light-teal sm:flex-none sm:px-3 sm:py-2 sm:text-sm"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(record)}
            className="min-w-[4.75rem] flex-1 rounded-md border border-deep-red px-2 py-1.5 text-xs font-medium text-deep-red hover:bg-deep-red/10 sm:flex-none sm:px-3 sm:py-2 sm:text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EventPosterThumbnail({ record }: { record: ClubEventRecord }) {
  const weekly = isWeeklyEvent(record);

  return (
    <div
      className="relative h-[4.25rem] w-[3.25rem] shrink-0 overflow-hidden rounded-lg border border-muted-teal/25 bg-light-teal shadow-sm sm:h-[4.5rem] sm:w-[3.5rem]"
      aria-hidden={!record.image_url}
    >
      {record.image_url ? (
        <Image
          src={record.image_url}
          alt=""
          width={weekly ? 80 : 56}
          height={72}
          className={
            weekly
              ? "h-full w-full object-contain p-0.5"
              : "h-full w-full object-cover object-center"
          }
          sizes="56px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-teal/70">
          <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

function EventTypeSelector({
  value,
  onChange,
  error,
}: {
  value: EventType | null;
  onChange: (type: EventType) => void;
  error: string | null;
}) {
  return (
    <fieldset>
      <legend className="mb-3 block text-sm font-medium text-dark-teal">
        Event type
      </legend>
      <div
        role="radiogroup"
        aria-label="Event type"
        className="grid gap-3 sm:grid-cols-2"
      >
        <EventTypeCard
          type="weekly"
          selected={value === "weekly"}
          title="Weekly event"
          description="Repeats on the same day each week"
          hint="Shown in Weekly Events on the public site"
          onSelect={() => onChange("weekly")}
        />
        <EventTypeCard
          type="dated"
          selected={value === "dated"}
          title="Dated event"
          description="Happens once on a specific date"
          hint="Shown in Upcoming Events by date"
          onSelect={() => onChange("dated")}
        />
      </div>
      {error && <p className="mt-2 text-sm text-deep-red">{error}</p>}
    </fieldset>
  );
}

function EventTypeCard({
  type,
  selected,
  title,
  description,
  hint,
  onSelect,
}: {
  type: EventType;
  selected: boolean;
  title: string;
  description: string;
  hint: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`rounded-lg border p-4 text-left transition-colors ${
        selected
          ? "border-dark-teal bg-light-teal ring-2 ring-dark-teal"
          : "border-muted-teal/40 bg-white hover:bg-light-teal/50"
      }`}
    >
      <span className="block font-semibold text-dark-teal">{title}</span>
      <span className="mt-1 block text-sm text-dark-teal/80">{description}</span>
      <span className="mt-2 block text-xs text-muted-teal">{hint}</span>
      <span className="sr-only">{type} event</span>
    </button>
  );
}

function FieldFrame({
  label,
  id,
  children,
  required,
  helpText,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  required?: boolean;
  helpText?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-dark-teal">
        {label}
        {required ? " *" : ""}
      </label>
      <div className="mt-2">{children}</div>
      {helpText && (
        <p className="mt-1 text-xs leading-5 text-muted-teal">{helpText}</p>
      )}
    </div>
  );
}
