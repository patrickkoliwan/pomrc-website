import { UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

// Validation schema
export const venueSelectionSchema = z.object({
  selectedVenue: z.enum(["events-lawn", "squash-courtyard"], {
    required_error: "Please select a venue",
  }),
});

export type VenueSelectionData = z.infer<typeof venueSelectionSchema>;

interface VenueSelectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isLoading?: boolean;
}

const venues = [
  {
    id: "events-lawn",
    title: "Events Lawn",
    description: "Perfect for large gatherings up to 200 guests",
    imageUrl: "/events-lawn.jpg",
    features: [
      "Spacious outdoor setting",
      "Perfect for large events",
      "BBQ facilities available",
      "Capacity: up to 200 guests",
    ],
  },
  {
    id: "squash-courtyard",
    title: "Squash Courtyard",
    description: "Intimate setting for gatherings up to 50 guests",
    imageUrl: "/squash-courtyard.jpg",
    features: [
      "Cozy courtyard setting",
      "Perfect for intimate events",
      "Adjacent to squash courts",
      "Capacity: up to 50 guests",
    ],
  },
];

export default function VenueSelection({
  register,
  errors,
  isLoading = false,
}: VenueSelectionProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-6">
        Select Your Venue
      </h2>

      <div className="space-y-4">
        {venues.map((venue) => (
          <label key={venue.id} className="relative block cursor-pointer group">
            <input
              type="radio"
              {...register("venueSelection.selectedVenue")}
              value={venue.id}
              className="sr-only peer"
            />
            <div className="p-4 rounded-lg border-2 border-gray-200 peer-checked:border-dark-teal transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="relative w-full md:w-1/3 h-48 rounded-lg overflow-hidden">
                  <Image
                    src={venue.imageUrl}
                    alt={venue.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-teal mb-2">
                    {venue.title}
                  </h3>
                  <p className="text-muted-teal mb-4">{venue.description}</p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {venue.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-dark-teal"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-dark-teal"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Selected indicator */}
            <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-dark-teal text-white flex items-center justify-center transform scale-0 peer-checked:scale-100 transition-transform">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </label>
        ))}
      </div>

      {errors.venueSelection?.selectedVenue && (
        <p className="mt-2 text-deep-red text-sm">
          {errors.venueSelection.selectedVenue.message as string}
        </p>
      )}
    </section>
  );
}
