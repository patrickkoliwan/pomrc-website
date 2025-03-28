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
}

export default function EventSection({ title, events }: EventSectionProps) {
  return (
    <section className="mb-16">
      <div className="border-b-4 border-dark-teal mb-8">
        <h2 className="text-3xl font-bold text-dark-teal pb-2">{title}</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
