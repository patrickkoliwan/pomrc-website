import { weeklyEvents, upcomingEvents, type Event } from "@/data/events";
import { getPublishedEvents } from "@/lib/cms/public-data";
import { hasSupabasePublicConfig } from "@/lib/supabase/server";
import {
  classifyPublishedEvents,
  mapClubEvent,
} from "@/lib/events/classify-events";

export async function getHomepageEventPreview(max = 3): Promise<Event[]> {
  const useCmsEvents = hasSupabasePublicConfig();

  if (!useCmsEvents) {
    return [...upcomingEvents, ...weeklyEvents].slice(0, max);
  }

  const cmsEvents = await getPublishedEvents();
  const { weekly, upcoming } = classifyPublishedEvents(cmsEvents);
  const mappedUpcoming = upcoming.map(mapClubEvent);
  const mappedWeekly = weekly.map(mapClubEvent);

  return [...mappedUpcoming, ...mappedWeekly].slice(0, max);
}
