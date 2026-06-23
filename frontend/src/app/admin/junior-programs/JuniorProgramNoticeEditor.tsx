"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import type { JuniorProgramNoticeRecord } from "@/lib/cms/types";
import { isJuniorProgramNoticePublic, normalizeJuniorProgramNoticeInput } from "@/lib/junior-programs/notice";

const defaultNotice: Pick<JuniorProgramNoticeRecord, "message" | "enabled"> = {
  message: "",
  enabled: false,
};

type NoticeForm = typeof defaultNotice;

export default function JuniorProgramNoticeEditor({
  notice,
}: {
  notice: JuniorProgramNoticeRecord | null;
}) {
  const [form, setForm] = useState<NoticeForm>({
    message: notice?.message || defaultNotice.message,
    enabled: notice?.enabled ?? defaultNotice.enabled,
  });
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isPublic = isJuniorProgramNoticePublic(form);

  async function saveNotice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("Saving notice...");

    const payload = normalizeJuniorProgramNoticeInput(form);

    const response = await fetch("/api/admin/junior-program-notice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Notice save failed");
      return;
    }

    setForm({
      message: result.data.message || "",
      enabled: Boolean(result.data.enabled),
    });
    setStatus(null);
    setToastMessage("Notice saved");
    window.setTimeout(() => {
      setOpen(false);
    }, 1200);
  }

  return (
    <>
      <Toast
        message={toastMessage ?? ""}
        open={toastMessage !== null}
        onClose={() => setToastMessage(null)}
      />
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-dark-teal">
                Important notice
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isPublic
                    ? "bg-light-teal text-dark-teal"
                    : "bg-dark-teal/10 text-dark-teal/70"
                }`}
              >
                {isPublic ? "Live on public page" : "Not on public page"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-dark-teal/75">
              {isPublic
                ? "Visitors see this notice at the top of the junior programs page."
                : form.message.trim()
                  ? "Notice is saved but hidden until you turn it on."
                  : "No notice is shown on the public page yet."}
            </p>
            {isPublic && (
              <div className="mt-4 rounded-md border-l-4 border-deep-red bg-red-50 p-3 text-sm text-deep-red">
                <p className="font-semibold">Preview</p>
                <p className="mt-1 whitespace-pre-line">{form.message}</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStatus(null);
              setOpen(true);
            }}
            className="shrink-0 rounded-md border border-muted-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
          >
            Edit notice
          </button>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed inset-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-muted-teal/30 bg-light-cream p-0 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg">
          <DialogHeader className="shrink-0 space-y-1 border-b border-muted-teal/30 px-4 py-4 text-left sm:px-6">
            <DialogTitle className="text-xl font-semibold text-dark-teal sm:text-2xl">
              Important notice
            </DialogTitle>
            <DialogDescription className="text-sm text-dark-teal/75">
              Shown at the top of the junior programs page when enabled. Leave
              the message blank to hide the notice from the public page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <form
              id="junior-program-notice-form"
              onSubmit={saveNotice}
              className="space-y-5"
            >
              <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  disabled={!form.message.trim()}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      enabled: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-muted-teal text-dark-teal disabled:cursor-not-allowed disabled:opacity-50"
                />
                Show notice on junior programs page
              </label>
              {!form.message.trim() && (
                <p className="text-sm text-dark-teal/70">
                  Add a message above to show a notice, or save with a blank
                  message to keep the public page clear.
                </p>
              )}

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
                  onChange={(event) => {
                    const message = event.target.value;
                    setForm((current) => ({
                      ...current,
                      message,
                      enabled: message.trim() ? current.enabled : false,
                    }));
                  }}
                  rows={4}
                  className="mt-2 w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                />
              </div>

              {error && <p className="text-sm text-deep-red">{error}</p>}
              {status && <p className="text-sm text-muted-teal">{status}</p>}
            </form>
          </div>

          <div className="flex shrink-0 gap-2 border-t border-muted-teal/30 px-4 py-4 sm:px-6">
            <button
              type="submit"
              form="junior-program-notice-form"
              className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
            >
              Save notice
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-muted-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
