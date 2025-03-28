import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

interface AvailableVenuesProps {
  isLoading?: boolean;
}

const venues = [
  {
    id: "events-lawn",
    title: "Events Lawn",
    description: "Outdoor venue for up to 200 guests",
    imageUrl: "/events-lawn.jpg",
  },
  {
    id: "squash-courtyard",
    title: "Squash Courtyard",
    description: "Intimate courtyard for up to 50 guests",
    imageUrl: "/squash-courtyard.jpg",
  },
];

export default function AvailableVenues({
  isLoading = false,
}: AvailableVenuesProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Available Venues
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {venues.map((venue) => (
          <div key={venue.id} className="relative group">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                src={venue.imageUrl}
                alt={venue.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-dark-teal">
                {venue.title}
              </h3>
              <p className="text-sm text-muted-teal">{venue.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-light-teal rounded-lg">
        <p className="text-sm text-dark-teal">
          <span className="font-semibold">Note:</span> Each venue has its own
          unique charm and capacity. The Events Lawn can accommodate up to 200
          guests, while the Squash Courtyard is perfect for more intimate
          gatherings of up to 50 people.
        </p>
      </div>
    </section>
  );
}
