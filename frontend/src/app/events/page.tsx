import EventSection from "@/components/EventSection";
import { weeklyEvents, upcomingEvents } from "@/data/events";
import { getPublishedEvents } from "@/lib/cms/public-data";

export const revalidate = 3600;

export default async function Events() {
  const cmsEvents = await getPublishedEvents();
  const mappedEvents = cmsEvents.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    date: event.event_date || event.day || "Date to be confirmed",
    time:
      event.start_time && event.end_time
        ? `${event.start_time} - ${event.end_time}`
        : event.start_time || "Time to be confirmed",
    location: "POMRC",
    isWeekly: Boolean(event.day && !event.event_date),
  }));
  const displayedWeeklyEvents = mappedEvents.length
    ? mappedEvents.filter((event) => event.isWeekly)
    : weeklyEvents;
  const displayedUpcomingEvents = mappedEvents.length
    ? mappedEvents.filter((event) => !event.isWeekly)
    : upcomingEvents;

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-teal mb-4">
            Club Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay up to date with regular club activities, fundraising nights,
            tournaments, and special community events at POMRC.
          </p>
        </div>

        <EventSection title="Weekly Events" events={displayedWeeklyEvents} />
        <EventSection
          title="Upcoming Events"
          events={displayedUpcomingEvents}
          emptyMessage="No upcoming events are scheduled right now. Check back soon for updates."
        />
      </div>
    </main>
  );
}
