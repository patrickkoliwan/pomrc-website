import type { JuniorProgramNoticeRecord } from "@/lib/cms/types";

export function normalizeJuniorProgramNoticeInput(input: {
  message?: string;
  enabled?: boolean;
}) {
  const message = (input.message ?? "").trim();

  return {
    message,
    enabled: Boolean(input.enabled) && message.length > 0,
  };
}

export function isJuniorProgramNoticePublic(
  notice: Pick<JuniorProgramNoticeRecord, "enabled" | "message"> | null
): boolean {
  return Boolean(notice?.enabled && notice.message.trim());
}
