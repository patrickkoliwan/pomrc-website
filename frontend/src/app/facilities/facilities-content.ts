import type { Json } from "@/lib/cms/types";

export type FacilityCategory =
  | "courts"
  | "squash"
  | "clubhouse"
  | "events"
  | "family";

export type FacilitiesHeroSlide = {
  src: string;
  alt: string;
};

export type FacilitiesStat = {
  value: string;
  label: string;
};

export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFZJOjU6PUFXYWNkY2lrbW1pf3x/e4iKc4KDgP/2wBDARUXFx4aHh4gICD4lJSU+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export const FACILITY_CATEGORIES: {
  id: FacilityCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "courts", label: "Courts" },
  { id: "squash", label: "Squash" },
  { id: "clubhouse", label: "Clubhouse & Social" },
  { id: "events", label: "Events & Hire" },
  { id: "family", label: "Family" },
];

export const facilityCategoryMap: Record<string, FacilityCategory> = {
  "southern-courts": "courts",
  "northern-courts": "courts",
  "squash-courts": "squash",
  amenities: "clubhouse",
  clubhouse: "clubhouse",
  hauswin: "clubhouse",
  "events-lawn": "events",
  "squash-courtyard": "events",
  playground: "family",
  basketball: "family",
};

export const featuredFacilityIds = new Set(["southern-courts", "northern-courts"]);

export const priorityImageIds = new Set(["southern-courts", "northern-courts"]);

export const heroSlides: FacilitiesHeroSlide[] = [
  {
    src: "/southern-court.jpg",
    alt: "Southern tennis courts at POMRC",
  },
  {
    src: "/northern-courts.jpg",
    alt: "Northern tennis courts at POMRC",
  },
  {
    src: "/squash-courts.jpg",
    alt: "Glass-backed squash courts at POMRC",
  },
  {
    src: "/clubhouse.jpg",
    alt: "POMRC Clubhouse",
  },
];

export const heroStats: FacilitiesStat[] = [
  { value: "7", label: "Tennis courts" },
  { value: "3", label: "Squash courts" },
  { value: "2", label: "Event spaces" },
  { value: "Est. 2015", label: "Pacific Games legacy" },
];

export const defaultFeaturesBySlug: Record<string, string[]> = {
  "southern-courts": [
    "Four terraced synthetic grass courts",
    "Professional-grade playing surface",
    "Ideal for casual and competitive play",
  ],
  "northern-courts": [
    "Three level synthetic grass courts",
    "Convenient northern carpark access",
    "Perfect for practice and match play",
  ],
  "squash-courts": [
    "2015 Pacific Games competition venue",
    "Glass-backed courts with spectator viewing",
    "Fan-equipped for player comfort",
  ],
  amenities: [
    "Members-only changing rooms",
    "Lockers and shower facilities",
    "Everything you need after a match",
  ],
  clubhouse: [
    "Fully serviced bar",
    "Indoor and outdoor seating",
    "Social hub for members",
  ],
  hauswin: [
    "Traditional PNG hauswin seating",
    "Overlooks courts 1–3",
    "Covered benches for spectators",
  ],
  "events-lawn": [
    "Capacity up to 200 guests",
    "BBQ facilities available",
    "Versatile outdoor setting",
  ],
  "squash-courtyard": [
    "Intimate courtyard setting",
    "Capacity up to 50 guests",
    "Adjacent to squash courts",
  ],
  playground: [
    "Playhouse and swingset",
    "Safe area for young children",
    "Perfect for member families",
  ],
  basketball: [
    "Half-court basketball setup",
    "Dedicated tennis hitting wall",
    "Multi-purpose practice area",
  ],
};

export function getCategory(slug: string): FacilityCategory {
  return facilityCategoryMap[slug] ?? "clubhouse";
}

export function parseFeatures(value: Json | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export function resolveFeatures(
  slug: string,
  cmsFeatures: string[]
): string[] {
  if (cmsFeatures.length > 0) return cmsFeatures;
  return defaultFeaturesBySlug[slug] ?? [];
}

export const HERO_TITLE = "Our Facilities";
export const HERO_TAGLINE =
  "World-class courts, clubhouse, and event spaces in the heart of Port Moresby";

export const CTA_HEADING = "Experience POMRC";
export const CTA_BODY =
  "Whether you want to play, relax, or host your next event, Port Moresby Racquets Club has a space for you.";
