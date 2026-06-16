import EventCard from "./EventCard";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isWeekly: boolean;
  price?: string;
}

interface EventSectionProps {
  title: string;
  events: Event[];
  emptyMessage?: string;
}

export default function EventSection({
  title,
  events,
  emptyMessage = "No events are scheduled right now. Check back soon for updates.",
}: EventSectionProps) {
  return (
    <section className="mb-16">
      <div className="border-b-4 border-dark-teal mb-8">
        <h2 className="text-3xl font-bold text-dark-teal pb-2">{title}</h2>
      </div>
      {events.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-muted-teal/30 bg-white p-6 text-dark-teal shadow-sm">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
