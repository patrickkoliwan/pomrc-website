import EventSection from "@/components/EventSection";
import { weeklyEvents, upcomingEvents } from "@/data/events";
import {
  classifyPublishedEvents,
  mapClubEvent,
} from "@/lib/events/classify-events";
import { getPublishedEvents } from "@/lib/cms/public-data";
import { hasSupabasePublicConfig } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function Events() {
  const cmsEvents = await getPublishedEvents();
  const useCmsEvents = hasSupabasePublicConfig();
  const { weekly, upcoming, recent } = classifyPublishedEvents(cmsEvents);
  const displayedWeeklyEvents = useCmsEvents
    ? weekly.map(mapClubEvent)
    : weeklyEvents;
  const displayedUpcomingEvents = useCmsEvents
    ? upcoming.map(mapClubEvent)
    : upcomingEvents;
  const displayedRecentEvents = useCmsEvents ? recent.map(mapClubEvent) : [];
  const hasRecentEvents = displayedRecentEvents.length > 0;

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-teal mb-4">
            Club Events
          </h1>
          <p className="text-xl text-muted-teal max-w-3xl mx-auto">
            Regular club nights, tournaments, and community events.
          </p>
        </div>

        <EventSection
          title="Weekly Events"
          events={displayedWeeklyEvents}
          layout="list"
        />
        <EventSection
          title="Upcoming Events"
          events={displayedUpcomingEvents}
          layout="poster"
          isLast={!hasRecentEvents}
        />
        {hasRecentEvents && (
          <EventSection
            title="Recent Events"
            events={displayedRecentEvents}
            layout="list"
            size="subtle"
            isLast
          />
        )}
      </div>
    </main>
  );
}
