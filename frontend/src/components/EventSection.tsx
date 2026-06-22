import EventCard from "./EventCard";
import type { Event } from "@/data/events";

type EventSectionLayout = "list" | "poster" | "compact";
type EventSectionSize = "default" | "subtle";

interface EventSectionProps {
  title: string;
  events: Event[];
  layout?: EventSectionLayout;
  size?: EventSectionSize;
  isLast?: boolean;
}

const layoutGridClasses: Record<"poster" | "compact", string> = {
  poster: "grid gap-8 sm:grid-cols-2",
  compact: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
};

export default function EventSection({
  title,
  events,
  layout = "compact",
  size = "default",
  isLast = false,
}: EventSectionProps) {
  if (events.length === 0) {
    return null;
  }

  const headingClasses =
    size === "subtle"
      ? "text-xl font-semibold text-dark-teal"
      : "text-2xl font-bold text-dark-teal";

  return (
    <section className={isLast ? "mb-0" : "mb-10"}>
      <div className="mb-6 border-b border-dark-teal/20 pb-3">
        <h2 className={headingClasses}>{title}</h2>
      </div>

      {layout === "list" ? (
        <div className="divide-y divide-dark-teal/10 overflow-hidden rounded-xl bg-white ring-1 ring-dark-teal/10">
          {events.map((event) => (
            <EventCard key={event.id} event={event} variant="list" />
          ))}
        </div>
      ) : (
        <div className={layoutGridClasses[layout]}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} variant="card" />
          ))}
        </div>
      )}
    </section>
  );
}
