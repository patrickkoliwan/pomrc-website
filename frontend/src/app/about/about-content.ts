export type AboutGalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type AboutHeroSlide = {
  src: string;
  alt: string;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutTimelineMilestone = {
  year: string;
  title: string;
  description: string;
};

export type AboutQuickLink = {
  label: string;
  href: string;
};

export type AboutSectionPresentation = {
  imageUrl: string;
  imageAlt: string;
};

export const DEFAULT_HERO_TAGLINE =
  "Where competition meets community in the heart of Port Moresby";

export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFZJOjU6PUFXYWNkY2lrbW1pf3x/e4iKc4KDgP/2wBDARUXFx4aHh4gICD4lJSU+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export const galleryImages: AboutGalleryImage[] = [
  {
    src: "/clubhouse.jpg",
    alt: "POMRC Clubhouse",
    caption: "Built for the 2015 Pacific Games",
  },
  {
    src: "/southern-court.jpg",
    alt: "Tennis Courts",
    caption: "Seven competition-grade synthetic grass courts",
  },
  {
    src: "/squash-courts.jpg",
    alt: "Squash Courts",
    caption: "Three glass-backed courts",
  },
  {
    src: "/pomrc-open.jpg",
    alt: "POMRC Open Tournament",
    caption: "PNG's premier annual racquets championship",
  },
];

export const defaultHeroSlides: AboutHeroSlide[] = galleryImages.map(
  ({ src, alt }) => ({ src, alt })
);

export const heroStats: AboutStat[] = [
  { value: "Est. 2015", label: "Pacific Games legacy venue" },
  { value: "7", label: "Tennis courts" },
  { value: "3", label: "Squash courts" },
];

export const timelineMilestones: AboutTimelineMilestone[] = [
  {
    year: "2015",
    title: "Pacific Games legacy",
    description:
      "Opened as part of the Games Legacy Agreement, establishing a permanent home for racquets in Port Moresby.",
  },
  {
    year: "2016",
    title: "POMRC Open begins",
    description:
      "Launched the tournament that would become Papua New Guinea's premier racquets championship.",
  },
  {
    year: "2020",
    title: "A brief pause",
    description:
      "The Open paused during the pandemic; the club remained open for members throughout.",
  },
  {
    year: "2026",
    title: "A decade of excellence",
    description:
      "The Open enters its tenth year as an official ranking event for Team PNG selection.",
  },
];

export const mobileQuickLinks: AboutQuickLink[] = [
  { label: "Facilities", href: "/facilities" },
  { label: "Membership", href: "/membership" },
];

export const desktopQuickLinks: AboutQuickLink[] = [
  { label: "Our Legacy", href: "#our-legacy" },
  { label: "Championship Tradition", href: "#championship-tradition" },
  { label: "Gallery", href: "#gallery" },
  { label: "Facilities", href: "/facilities" },
  { label: "Membership", href: "/membership" },
];

export const sectionPresentationBySlug: Record<string, AboutSectionPresentation> =
  {
    "our-legacy": {
      imageUrl: "/clubhouse.jpg",
      imageAlt: "POMRC Clubhouse exterior",
    },
    "championship-tradition": {
      imageUrl: "/pomrc-open.jpg",
      imageAlt: "POMRC Open tournament",
    },
  };

export const defaultSectionPresentation: AboutSectionPresentation = {
  imageUrl: "/clubhouse.jpg",
  imageAlt: "Port Moresby Racquets Club",
};

export const GALLERY_SECTION_ID = "gallery";
export const JOIN_SECTION_ID = "join";

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getSectionPresentation(heading: string): AboutSectionPresentation {
  const slug = slugifyHeading(heading);
  return sectionPresentationBySlug[slug] ?? defaultSectionPresentation;
}

export function buildHeroSlides(cmsHeroImageUrl?: string | null): AboutHeroSlide[] {
  if (!cmsHeroImageUrl) {
    return defaultHeroSlides;
  }

  const cmsSlide: AboutHeroSlide = {
    src: cmsHeroImageUrl,
    alt: "POMRC Clubhouse exterior",
  };

  const remainingSlides = defaultHeroSlides.filter(
    (slide) => slide.src !== cmsHeroImageUrl
  );

  return [cmsSlide, ...remainingSlides];
}

export function buildNavItems(sectionHeadings: string[]) {
  const sectionItems = sectionHeadings.map((heading) => ({
    title: heading,
    id: slugifyHeading(heading),
  }));

  return [
    ...sectionItems,
    { title: "Gallery", id: GALLERY_SECTION_ID },
    { title: "Join", id: JOIN_SECTION_ID },
  ];
}
