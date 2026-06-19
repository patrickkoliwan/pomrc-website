import type { JuniorProgram } from "@/data/juniorPrograms";
import type { JuniorProgramRecord, JuniorProgramType } from "@/lib/cms/types";

export const juniorProgramTypes = ["tennis", "squash", "other"] as const;

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
      groups[type] = programs.filter((program) => program.type === type);
      return groups;
    },
    { tennis: [], squash: [], other: [] }
  );
}
