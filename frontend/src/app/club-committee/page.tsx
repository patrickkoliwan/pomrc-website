"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

interface CommitteeMember {
  name: string;
  position: string;
  imageUrl: string;
}

// Memoize the committee member card component
const CommitteeMemberCard = memo(function CommitteeMemberCard({
  member,
  index,
}: {
  member: CommitteeMember;
  index: number;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-full max-w-[160px] sm:max-w-[180px] mx-auto">
      <div className="relative aspect-square w-full">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          priority={index < 6}
          loading={index < 6 ? "eager" : "lazy"}
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLUEwLi0tLTAtQFBGPzpNPUBAR1hXVFdgaWZmYEVHZIhlYWf/2wBDARUXFx4aHh8eHWBQQFBnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          placeholder="blur"
        />
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="text-sm sm:text-base font-semibold text-dark-teal mb-0.5 line-clamp-1">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-teal line-clamp-2">
          {member.position}
        </p>
      </div>
    </div>
  );
});

const committeeMembers: CommitteeMember[] = [
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
    name: "Kathlyne Resson Tabuchi",
    position: "Secretary",
    imageUrl: "/images/committee/kathlyne-resson-tabuchi.jpg",
  },
  {
    name: "Adelaide Senior",
    position: "Assistant Secretary",
    imageUrl: "/images/committee/adelaide-senior.jpg",
  },
  {
    name: "Diana Hakena",
    position: "Publicity Officer",
    imageUrl: "/images/committee/diana-hakena.jpg",
  },
  {
    name: "Toby Davis",
    position: "Social Director",
    imageUrl: "/images/committee/toby-davis.jpg",
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
    position: "Squash Director (President PNG Squash Federation)",
    imageUrl: "/images/committee/anna-togolo.jpg",
  },
  {
    name: "Barbara Stubbings",
    position: "Ex Officio (President PNG Tennis Association)",
    imageUrl: "/images/committee/barbara-stubbings.jpg",
  },
];

export default function CommitteePage() {
  return (
    <main className="min-h-screen bg-light-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-teal mb-4">
            Club Committee
          </h1>
          <p className="text-lg text-dark-teal/80 max-w-3xl mx-auto">
            Meet our dedicated committee members who volunteer their time to
            ensure the club runs smoothly and provides the best experience for
            all our members.
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-16"
          role="list"
          aria-label="Committee Members"
        >
          {committeeMembers.map((member, index) => (
            <CommitteeMemberCard
              key={member.name}
              member={member}
              index={index}
            />
          ))}
        </div>

        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Want to Make a Difference?
            </h2>
            <p className="text-dark-teal/80 mb-6">
              Join our community and help make the club an even better place. We
              welcome members who want to contribute their time and skills to
              support our club&apos;s activities and growth.
            </p>
          </div>
          <Link
            href="/membership"
            className="inline-block bg-dark-teal text-light-cream py-3 px-8 rounded-md font-medium hover:bg-muted-teal transition-colors"
            role="button"
            aria-label="Become a member"
          >
            Become a Member
          </Link>
        </div>
      </div>
    </main>
  );
}
