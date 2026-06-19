export type DisplayMember = {
  id?: string;
  name: string;
  position: string;
  imageUrl: string;
  isActing?: boolean;
};

export const COMMITTEE_SECTION_ID = "committee-members";

export const IMAGE_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLUEwLi0tLTAtQFBGPzpNPUBAR1hXVFdgaWZmYEVHZIhlYWf/2wBDARUXFx4aHh8eHWBQQFBnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const fallbackCommitteeMembers: DisplayMember[] = [
  {
    name: "Robin Fleming",
    position: "Club President",
    imageUrl: "/images/committee/robin-fleming.jpg",
  },
  {
    name: "Philip Tabuchi",
    position: "Vice President",
    imageUrl: "/images/committee/philip-tabuchi.jpg",
  },
  {
    name: "Andrew Langley",
    position: "Treasurer",
    imageUrl: "/images/committee/andrew-langley.jpg",
  },
  {
    name: "Brett Cox",
    position: "Assistant Treasurer",
    imageUrl: "/images/committee/brett-cox.jpg",
  },
  {
    name: "Kathlyne Tabuchi",
    position: "Secretary",
    imageUrl: "/images/committee/kathlyne-resson-tabuchi.jpg",
  },
  {
    name: "Adelaide Senior",
    position: "Assistant Secretary",
    imageUrl: "/images/committee/adelaide-senior.webp",
  },
  {
    name: "Diana Hakena",
    position: "Publicity Officer",
    imageUrl: "",
  },
  {
    name: "Toby Davis",
    position: "Social Director",
    imageUrl: "",
  },
  {
    name: "Iain Kaiulo",
    position: "Technical Director",
    imageUrl: "/images/committee/iain-kaiulo.jpg",
  },
  {
    name: "William Aisi",
    position: "Tennis Director",
    imageUrl: "/images/committee/william-aisi.jpg",
  },
  {
    name: "Anna Togolo",
    position: "Squash Director",
    imageUrl: "/images/committee/anna-togolo.jpg",
  },
  {
    name: "Barbara Stubbings",
    position: "Ex Officio",
    imageUrl: "/images/committee/barbara-stubbings.jpg",
  },
];

const fallbackPhotoByName = new Map(
  fallbackCommitteeMembers
    .filter((member) => member.imageUrl)
    .map((member) => [member.name.trim().toLowerCase(), member.imageUrl])
);

export function resolveMemberPhotoUrl(
  name: string,
  cmsPhotoUrl?: string | null
): string {
  const trimmed = cmsPhotoUrl?.trim();
  if (trimmed) {
    return trimmed;
  }

  return fallbackPhotoByName.get(name.trim().toLowerCase()) ?? "";
}
