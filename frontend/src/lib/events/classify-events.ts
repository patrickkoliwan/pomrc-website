import type { Event } from "@/data/events";
import type { ClubEventRecord } from "@/lib/cms/types";

const CLUB_TIMEZONE = "Pacific/Port_Moresby";
const RECENT_WINDOW_DAYS = 7;

export function getClubTodayDate(referenceDate = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CLUB_TIMEZONE,
  }).format(referenceDate);
}

export function addDays(isoDate: string, delta: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + delta);

  const nextYear = date.getUTCFullYear();
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getUTCDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function isWeeklyEvent(record: ClubEventRecord): boolean {
  return Boolean(record.day && !record.event_date);
}

function compareIsoDates(left: string, right: string): number {
  return left.localeCompare(right);
}

function sortUpcoming(a: ClubEventRecord, b: ClubEventRecord): number {
  if (a.event_date && b.event_date) {
    const byDate = compareIsoDates(a.event_date, b.event_date);
    if (byDate !== 0) {
      return byDate;
    }
  } else if (a.event_date) {
    return -1;
  } else if (b.event_date) {
    return 1;
  }

  return a.display_order - b.display_order;
}

function sortRecent(a: ClubEventRecord, b: ClubEventRecord): number {
  if (!a.event_date || !b.event_date) {
    return a.display_order - b.display_order;
  }

  return compareIsoDates(b.event_date, a.event_date);
}

export function classifyPublishedEvents(
  records: ClubEventRecord[],
  referenceDate = new Date()
) {
  const today = getClubTodayDate(referenceDate);
  const recentCutoff = addDays(today, -RECENT_WINDOW_DAYS);

  const weekly: ClubEventRecord[] = [];
  const upcoming: ClubEventRecord[] = [];
  const recent: ClubEventRecord[] = [];

  for (const record of records) {
    if (isWeeklyEvent(record)) {
      weekly.push(record);
      continue;
    }

    if (!record.event_date) {
      upcoming.push(record);
      continue;
    }

    if (compareIsoDates(record.event_date, today) >= 0) {
      upcoming.push(record);
      continue;
    }

    if (compareIsoDates(record.event_date, recentCutoff) >= 0) {
      recent.push(record);
    }
  }

  weekly.sort((a, b) => a.display_order - b.display_order);
  upcoming.sort(sortUpcoming);
  recent.sort(sortRecent);

  return { weekly, upcoming, recent };
}

export function mapClubEvent(record: ClubEventRecord): Event {
  return {
    id: record.id,
    title: record.title,
    description: record.description || "",
    date: record.event_date || record.day || "Date to be confirmed",
    eventDate: record.event_date || undefined,
    time:
      record.start_time && record.end_time
        ? `${record.start_time} - ${record.end_time}`
        : record.start_time || "Time to be confirmed",
    location: "POMRC",
    isWeekly: isWeeklyEvent(record),
    imageUrl: record.image_url || undefined,
  };
}
