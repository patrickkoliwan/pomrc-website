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
            Get ready for an action-packed JUNE with a mix of fundraising, competitive play, and an exciting exclusive annual event of the club. From raffle nights to tournament weekends and special viewing parties, there&apos;s something for everyone to enjoy and support!
          </p>
        </div>

        <EventSection title="Weekly Events" events={weeklyEvents} />
        <EventSection title="Upcoming Events" events={upcomingEvents} />
      </div>
    </main>
  );
}
