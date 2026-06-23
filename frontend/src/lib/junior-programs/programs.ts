import type { JuniorProgram } from "@/data/juniorPrograms";
import type { JuniorProgramRecord, JuniorProgramType } from "@/lib/cms/types";

export const juniorProgramTypes = ["tennis", "squash", "other"] as const;

const WEEKDAY_SORT_ORDER: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function getJuniorProgramDaySortKey(dayText: string): number {
  const normalized = dayText.toLowerCase();
  const matchedDays = Object.entries(WEEKDAY_SORT_ORDER)
    .filter(([day]) => normalized.includes(day))
    .map(([, order]) => order);

  if (matchedDays.length === 0) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Math.min(...matchedDays);
}

export function compareJuniorProgramsByDayOfWeek(
  leftDayText: string,
  rightDayText: string
): number {
  const leftKey = getJuniorProgramDaySortKey(leftDayText);
  const rightKey = getJuniorProgramDaySortKey(rightDayText);

  if (leftKey !== rightKey) {
    return leftKey - rightKey;
  }

  return leftDayText.localeCompare(rightDayText, undefined, {
    sensitivity: "base",
  });
}

export function sortJuniorProgramRecords(
  records: JuniorProgramRecord[]
): JuniorProgramRecord[] {
  return [...records].sort((left, right) =>
    compareJuniorProgramsByDayOfWeek(left.day_text, right.day_text)
  );
}

export function sortJuniorProgramRecordItems(
  records: Array<Record<string, unknown> & { id?: string }>
): Array<Record<string, unknown> & { id?: string }> {
  return sortJuniorProgramRecords(records as JuniorProgramRecord[]);
}

export function sortJuniorPrograms(programs: JuniorProgram[]): JuniorProgram[] {
  return [...programs].sort((left, right) =>
    compareJuniorProgramsByDayOfWeek(left.date, right.date)
  );
}

export function mapJuniorProgram(record: JuniorProgramRecord): JuniorProgram {
  return {
    id: record.id,
    type: record.program_type,
    title: record.title,
    description: record.description,
    date: record.day_text,
    time: record.time_text,
    location: record.location,
    isWeekly: true,
    price: record.price,
    imageUrl: record.image_url || "/images/junior-programs/tennis-beginners.jpg",
  };
}

export function groupJuniorPrograms(programs: JuniorProgram[]) {
  return juniorProgramTypes.reduce<Record<JuniorProgramType, JuniorProgram[]>>(
    (groups, type) => {
      groups[type] = sortJuniorPrograms(
        programs.filter((program) => program.type === type)
      );
      return groups;
    },
    { tennis: [], squash: [], other: [] }
  );
}
