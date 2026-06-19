import Image from "next/image";
import {
  DisplayMember,
  getInitials,
  IMAGE_BLUR_DATA_URL,
} from "../committee-content";

function ActingBadge() {
  return (
    <span
      className="mt-1 inline-flex rounded-full bg-light-teal px-1.5 py-0.5 text-[10px] font-semibold text-dark-teal"
      aria-label="Acting in this role"
    >
      Acting
    </span>
  );
}

export default function CommitteeMemberCard({
  member,
  index,
}: {
  member: DisplayMember;
  index: number;
}) {
  const initials = getInitials(member.name);

  return (
    <div className="group w-full overflow-hidden rounded-lg bg-white ring-1 ring-dark-teal/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 14vw"
            priority={index < 5}
            loading={index < 5 ? "eager" : "lazy"}
            blurDataURL={IMAGE_BLUR_DATA_URL}
            placeholder="blur"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-light-teal">
            <span className="text-lg font-bold text-dark-teal md:text-xl">
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="p-2 md:p-2.5">
        <h3 className="truncate text-[11px] font-semibold leading-tight text-dark-teal sm:text-xs md:text-sm">
          {member.name}
        </h3>
        <p className="mt-0.5 truncate text-[10px] text-dark-teal/80 sm:text-[11px] md:text-xs">
          {member.position}
        </p>
        {member.isActing && <ActingBadge />}
      </div>
    </div>
  );
}
