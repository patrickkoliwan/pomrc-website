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

const DAY_OF_WEEK_ORDER: readonly { names: string[]; index: number }[] = [
  { names: ["monday", "mon"], index: 0 },
  { names: ["tuesday", "tue", "tues"], index: 1 },
  { names: ["wednesday", "wed"], index: 2 },
  { names: ["thursday", "thu", "thur", "thurs"], index: 3 },
  { names: ["friday", "fri"], index: 4 },
  { names: ["saturday", "sat"], index: 5 },
  { names: ["sunday", "sun"], index: 6 },
];

const UNKNOWN_DAY_SORT_INDEX = 99;

/** Earliest day mentioned in free-text `day` (Mon=0 … Sun=6). Multi-day strings use the first day in the week. */
export function getDayOfWeekSortIndex(day: string | null | undefined): number {
  if (!day?.trim()) {
    return UNKNOWN_DAY_SORT_INDEX;
  }

  const normalized = day.toLowerCase();
  let earliest = UNKNOWN_DAY_SORT_INDEX;

  for (const { names, index } of DAY_OF_WEEK_ORDER) {
    if (names.some((name) => normalized.includes(name))) {
      earliest = Math.min(earliest, index);
    }
  }

  return earliest;
}

function sortWeeklyEvents(a: ClubEventRecord, b: ClubEventRecord): number {
  const byDay = getDayOfWeekSortIndex(a.day) - getDayOfWeekSortIndex(b.day);
  if (byDay !== 0) {
    return byDay;
  }

  return a.display_order - b.display_order;
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

function sortByDisplayOrder(a: ClubEventRecord, b: ClubEventRecord): number {
  return a.display_order - b.display_order;
}

export function classifyAdminEvents(
  records: ClubEventRecord[],
  referenceDate = new Date()
) {
  const today = getClubTodayDate(referenceDate);

  const currentWeekly: ClubEventRecord[] = [];
  const currentUpcoming: ClubEventRecord[] = [];
  const past: ClubEventRecord[] = [];
  const archived: ClubEventRecord[] = [];

  for (const record of records) {
    if (record.published === false) {
      archived.push(record);
      continue;
    }

    if (isWeeklyEvent(record) || !record.event_date) {
      if (isWeeklyEvent(record)) {
        currentWeekly.push(record);
      } else {
        currentUpcoming.push(record);
      }
      continue;
    }

    if (compareIsoDates(record.event_date, today) >= 0) {
      currentUpcoming.push(record);
    } else {
      past.push(record);
    }
  }

  currentWeekly.sort(sortWeeklyEvents);
  currentUpcoming.sort(sortUpcoming);
  past.sort(sortRecent);
  archived.sort(sortByDisplayOrder);

  return {
    current: [...currentWeekly, ...currentUpcoming],
    past,
    archived,
  };
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

  weekly.sort(sortWeeklyEvents);
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
    price: record.price || undefined,
    membersFree: record.members_free,
    imageUrl: record.image_url || undefined,
  };
}
