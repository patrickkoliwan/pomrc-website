"use client";

import { useMemo, useState } from "react";
import type { CmsTable, SitePageBodySection } from "@/lib/cms/types";
import { Toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CroppedImageUploader from "./CroppedImageUploader";
import {
  CMS_IMAGE_PRESETS,
  compressImageForWeb,
  supportedUploadAccept,
  validateSourceImage,
} from "./image-processing";
import { sortJuniorProgramRecordItems } from "@/lib/junior-programs/programs";

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "image"
  | "date"
  | "select"
  | "tags"
  | "sections";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helpText?: string;
  imageProcessing?: {
    aspect?: number;
    targetWidth?: number;
  };
  options?: { label: string; value: string }[];
};

type RecordShape = Record<string, unknown> & { id?: string };

export default function AdminResourceManager({
  table,
  records,
  fields,
  titleField,
  newRecord,
  disableDelete = false,
  enableArchive = false,
  resourceLabel = { singular: "Record", plural: "Records" },
}: {
  table: CmsTable;
  records: RecordShape[];
  fields: Field[];
  titleField: string;
  newRecord: RecordShape;
  disableDelete?: boolean;
  enableArchive?: boolean;
  resourceLabel?: { singular: string; plural: string };
}) {
  const [items, setItems] = useState<RecordShape[]>(records);
  const [editing, setEditing] = useState<RecordShape | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const sortedItems = useMemo(() => {
    if (table === "junior_programs") {
      return sortJuniorProgramRecordItems(items);
    }

    return items;
  }, [items, table]);

  function beginCreate() {
    setEditing({ ...newRecord });
    setError(null);
    setStatus(null);
  }

  function beginEdit(record: RecordShape) {
    setEditing({ ...record });
    setError(null);
    setStatus(null);
  }

  function closeEditing() {
    setEditing(null);
    setError(null);
    setStatus(null);
  }

  function updateField(name: string, value: unknown) {
    setEditing((current) => (current ? { ...current, [name]: value } : current));
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) {
      return;
    }

    setError(null);
    setStatus("Saving...");
    const isUpdate = Boolean(editing.id);
    const url = isUpdate
      ? `/api/admin/cms/${table}/${editing.id}`
      : `/api/admin/cms/${table}`;

    const response = await fetch(url, {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
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

    if (table === "junior_programs") {
      setStatus(null);
      setToastMessage(
        isUpdate
          ? `${resourceLabel.singular} saved`
          : `${resourceLabel.singular} created`
      );
      window.setTimeout(() => {
        closeEditing();
      }, 1200);
      return;
    }

    closeEditing();
  }

  async function deleteRecord(record: RecordShape) {
    if (
      !record.id ||
      !window.confirm(`Delete this ${resourceLabel.singular.toLowerCase()} permanently?`)
    ) {
      return;
    }

    setError(null);
    setStatus("Deleting...");
    const response = await fetch(`/api/admin/cms/${table}/${record.id}`, {
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

  async function toggleArchive(record: RecordShape) {
    if (!record.id) {
      return;
    }

    const isPublished = record.published !== false;
    const action = isPublished ? "Archiving" : "Restoring";

    setError(null);
    setStatus(`${action}...`);
    const response = await fetch(`/api/admin/cms/${table}/${record.id}`, {
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
      setEditing(result.data);
    }
    setStatus(isPublished ? "Archived." : "Restored.");
  }

  async function uploadProcessedImage(fieldName: string, file: File | null) {
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

    updateField(fieldName, result.url);
    setStatus("Image uploaded.");
    return result.url as string;
  }

  async function uploadRawImage(fieldName: string, file: File | null) {
    if (!file) {
      return "";
    }

    if (file.type !== "image/gif") {
      const validationError = validateSourceImage(file);

      if (validationError) {
        setError(validationError);
        throw new Error(validationError);
      }
    }

    setError(null);
    setStatus("Preparing image...");

    try {
      const processed =
        file.type === "image/gif"
          ? file
          : await compressImageForWeb(file, CMS_IMAGE_PRESETS.directUpload);

      return uploadProcessedImage(fieldName, processed);
    } catch (uploadError) {
      setStatus(null);
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Could not prepare this photo for upload.";
      setError(message);
      throw new Error(message);
    }
  }

  return (
    <>
      <Toast
        message={toastMessage ?? ""}
        open={toastMessage !== null}
        onClose={() => setToastMessage(null)}
      />
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-dark-teal">
            {resourceLabel.plural}
          </h2>
          <button
            type="button"
            onClick={beginCreate}
            className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
          >
            Add {resourceLabel.singular}
          </button>
        </div>
        {sortedItems.length === 0 ? (
          <p className="rounded-md border border-muted-teal/20 bg-light-teal p-4 text-dark-teal">
            No {resourceLabel.plural.toLowerCase()} yet.
          </p>
        ) : (
          <div className="divide-y divide-muted-teal/20">
            {sortedItems.map((record) => (
              <div
                key={record.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-dark-teal">
                    {String(record[titleField] || "Untitled")}
                  </h3>
                  <p className="text-sm text-muted-teal">
                    {"published" in record
                      ? record.published
                        ? "Published"
                        : enableArchive
                          ? "Archived"
                          : "Unpublished"
                      : `Active ${resourceLabel.singular.toLowerCase()}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {enableArchive && "published" in record && (
                    <button
                      type="button"
                      onClick={() => toggleArchive(record)}
                      className="rounded-md border border-muted-teal px-3 py-2 text-sm font-medium text-dark-teal hover:bg-light-teal"
                    >
                      {record.published === false ? "Restore" : "Archive"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => beginEdit(record)}
                    className="rounded-md border border-muted-teal px-3 py-2 text-sm font-medium text-dark-teal hover:bg-light-teal"
                  >
                    Edit
                  </button>
                  {!disableDelete && (
                    <button
                      type="button"
                      onClick={() => deleteRecord(record)}
                      className="rounded-md border border-deep-red px-3 py-2 text-sm font-medium text-deep-red hover:bg-deep-red/10"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!editing} onOpenChange={(open) => !open && closeEditing()}>
        <DialogContent className="fixed inset-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-muted-teal/30 bg-light-cream p-0">
          <DialogHeader className="shrink-0 space-y-1 border-b border-muted-teal/30 px-4 py-4 text-left sm:px-6">
            <DialogTitle className="text-xl font-semibold text-dark-teal sm:text-2xl">
              {editing?.id
                ? `Edit ${resourceLabel.singular}`
                : `Add ${resourceLabel.singular}`}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editing?.id
                ? `Edit ${resourceLabel.singular.toLowerCase()} details`
                : `Create a new ${resourceLabel.singular.toLowerCase()}`}
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <form
                  id="admin-resource-form"
                  onSubmit={saveRecord}
                  className="space-y-5"
                >
                  {fields.map((field) => (
                    <FieldInput
                      key={field.name}
                      field={field}
                      value={editing[field.name]}
                      onChange={(value) => updateField(field.name, value)}
                      onUpload={(file) => uploadProcessedImage(field.name, file)}
                      onRawUpload={(file) => uploadRawImage(field.name, file)}
                    />
                  ))}
                  {error && <p className="text-sm text-deep-red">{error}</p>}
                  {status && <p className="text-sm text-muted-teal">{status}</p>}
                </form>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-muted-teal/30 px-4 py-4 sm:px-6">
                <button
                  type="submit"
                  form="admin-resource-form"
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

function FieldInput({
  field,
  value,
  onChange,
  onUpload,
  onRawUpload,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  onUpload: (file: File | null) => Promise<string>;
  onRawUpload: (file: File | null) => Promise<string>;
}) {
  const id = `field-${field.name}`;
  const stringValue = typeof value === "string" ? value : "";

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-muted-teal text-dark-teal"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <FieldFrame field={field} id={id}>
        <textarea
          id={id}
          required={field.required}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        />
      </FieldFrame>
    );
  }

  if (field.type === "image") {
    return (
      <FieldFrame field={field} id={id}>
        {field.imageProcessing ? (
          <CroppedImageUploader
            value={stringValue}
            onChange={onChange}
            onUpload={onUpload}
            aspect={field.imageProcessing.aspect}
            targetWidth={field.imageProcessing.targetWidth}
          />
        ) : (
          <>
            <input
              id={id}
              type="text"
              value={stringValue}
              onChange={(event) => onChange(event.target.value)}
              placeholder="/clubhouse.jpg or uploaded URL"
              className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
            />
            <input
              type="file"
              accept={supportedUploadAccept}
              onChange={(event) => {
                void onRawUpload(event.target.files?.[0] || null);
                event.target.value = "";
              }}
              className="mt-2 block w-full text-sm text-dark-teal file:mr-3 file:rounded-md file:border-0 file:bg-light-teal file:px-3 file:py-2 file:text-dark-teal"
            />
          </>
        )}
      </FieldFrame>
    );
  }

  if (field.type === "tags") {
    return (
      <FieldFrame field={field} id={id}>
        <textarea
          id={id}
          value={Array.isArray(value) ? value.join("\n") : ""}
          onChange={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
          rows={4}
          className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        />
      </FieldFrame>
    );
  }

  if (field.type === "select") {
    return (
      <FieldFrame field={field} id={id}>
        <select
          id={id}
          required={field.required}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        >
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldFrame>
    );
  }

  if (field.type === "sections") {
    return (
      <FieldFrame field={field} id={id}>
        <textarea
          id={id}
          value={sectionsToText(value)}
          onChange={(event) => onChange(textToSections(event.target.value))}
          rows={10}
          className="w-full rounded-md border border-muted-teal px-3 py-2 font-mono text-sm text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        />
      </FieldFrame>
    );
  }

  return (
    <FieldFrame field={field} id={id}>
      <input
        id={id}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        required={field.required}
        value={field.type === "number" ? Number(value ?? 0) : stringValue}
        onChange={(event) =>
          onChange(
            field.type === "number"
              ? Number(event.target.value)
              : event.target.value
          )
        }
        className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
      />
    </FieldFrame>
  );
}

function FieldFrame({
  field,
  id,
  children,
}: {
  field: Field;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-dark-teal">
        {field.label}
      </label>
      <div className="mt-2">{children}</div>
      {field.helpText && (
        <p className="mt-1 text-xs leading-5 text-muted-teal">{field.helpText}</p>
      )}
    </div>
  );
}

function sectionsToText(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return (value as SitePageBodySection[])
    .map((section) => `${section.heading}\n${section.content}`)
    .join("\n---\n");
}

function textToSections(value: string) {
  return value
    .split(/\n---\n/g)
    .map((section) => {
      const [heading, ...content] = section.split("\n");
      return {
        heading: heading?.trim() || "Section",
        content: content.join("\n").trim(),
      };
    })
    .filter((section) => section.heading && section.content);
}
