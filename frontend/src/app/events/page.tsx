import EventSection from "@/components/EventSection";
import { weeklyEvents, upcomingEvents } from "@/data/events";

export default function Events() {
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

        <EventSection title="Weekly Events" events={weeklyEvents} />
        <EventSection
          title="Upcoming Events"
          events={upcomingEvents}
          emptyMessage="No upcoming events are scheduled right now. Check back soon for updates."
        />
      </div>
    </main>
  );
}
