export interface PremisesArea {
  id: string;
  label: string;
}

/** Areas available when "Other specific area" is selected (excludes hire venues). */
export const premisesAreas: PremisesArea[] = [
  { id: "southern-courts", label: "Southern Tennis Courts (1–4)" },
  { id: "northern-courts", label: "Northern Tennis Courts (5–7)" },
  { id: "squash-courts", label: "Squash Courts (1–3)" },
  { id: "clubhouse", label: "Clubhouse" },
  { id: "hauswin", label: "Hauswin Seating" },
  { id: "amenities", label: "Amenities" },
  { id: "playground", label: "Children's Play Area" },
  { id: "basketball", label: "Basketball & Practice Wall" },
  { id: "other", label: "Other (please specify)" },
];

export function getPremisesAreaLabel(id: string): string {
  return premisesAreas.find((a) => a.id === id)?.label ?? id;
}
