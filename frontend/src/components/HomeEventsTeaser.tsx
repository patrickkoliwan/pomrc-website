import Link from "next/link";
import type { Event } from "@/data/events";

const CLUB_TIMEZONE = "Pacific/Port_Moresby";

function formatEventDateLabel(event: Event): string {
  if (event.isWeekly) {
    return `Every ${event.date}`;
  }

  if (event.eventDate) {
    const [year, month, day] = event.eventDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));

    return new Intl.DateTimeFormat("en-AU", {
      timeZone: CLUB_TIMEZONE,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  }

  return event.date;
}

function EventTeaserRow({ event }: { event: Event }) {
  return (
    <li className="flex flex-col gap-1.5 min-w-0 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center justify-between gap-3 sm:contents">
        <span className="shrink-0 rounded-full bg-light-teal px-2.5 py-1 text-xs font-medium text-dark-teal">
          {formatEventDateLabel(event)}
        </span>
        <span className="shrink-0 text-sm text-dark-teal/70 sm:order-3">
          {event.time}
        </span>
      </div>
      <span className="font-medium text-dark-teal text-sm sm:min-w-0 sm:flex-1 sm:truncate sm:text-base">
        {event.title}
      </span>
    </li>
  );
}

interface HomeEventsTeaserProps {
  events: Event[];
}

export default function HomeEventsTeaser({ events }: HomeEventsTeaserProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Upcoming club events"
      className="border-y border-dark-teal/10 bg-light-cream"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="shrink-0">
            <p className="text-xs font-medium uppercase tracking-wide text-deep-red">
              Events
            </p>
            <h2 className="text-lg font-semibold text-dark-teal sm:text-xl">
              What&apos;s On Soon
            </h2>
          </div>

          <ul className="flex-1 space-y-2 sm:max-w-xl">
            {events.map((event) => (
              <EventTeaserRow key={event.id} event={event} />
            ))}
          </ul>

          <Link
            href="/events"
            className="shrink-0 inline-flex items-center text-sm font-medium text-deep-red hover:text-muted-teal transition-colors group sm:self-center"
          >
            <span>View all events</span>
            <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
