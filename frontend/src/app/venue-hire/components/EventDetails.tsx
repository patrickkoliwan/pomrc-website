import { UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";
import { FormData } from "../page";

// Validation schema
export const eventDetailsSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  expectedGuests: z
    .number()
    .min(1, "Number of guests is required")
    .max(200, "Maximum number of guests is 200"),
});

export type EventDetailsData = z.infer<typeof eventDetailsSchema>;

interface EventDetailsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isLoading?: boolean;
}

export default function EventDetails({
  register,
  errors,
  isLoading = false,
}: EventDetailsProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Event Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Event Type
          </label>
          <input
            type="text"
            {...register("eventDetails.eventType")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
            placeholder="e.g., Birthday Party, Corporate Event"
          />
          {errors.eventDetails?.eventType && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.eventDetails.eventType.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Expected Number of Guests
          </label>
          <input
            type="number"
            {...register("eventDetails.expectedGuests", {
              valueAsNumber: true,
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
            min="1"
            max="200"
          />
          {errors.eventDetails?.expectedGuests && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.eventDetails.expectedGuests.message}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-teal">
            Maximum capacity: 200 guests
          </p>
        </div>
      </div>
    </section>
  );
}
