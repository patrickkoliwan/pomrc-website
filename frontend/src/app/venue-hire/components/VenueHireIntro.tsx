import { CalendarDays, Camera, ChevronRight } from "lucide-react";

interface VenueHireIntroProps {
  onOpenEventForm: () => void;
  onOpenFilmingForm: () => void;
}

export default function VenueHireIntro({
  onOpenEventForm,
  onOpenFilmingForm,
}: VenueHireIntroProps) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md text-center">
      <p className="text-dark-teal mb-4">
        Port Moresby Racquets Club offers its premises for hire — whether you are
        planning a private or corporate event, or need a location for filming,
        photography, and promotional or publicity content.
      </p>
      <p className="text-dark-teal mb-6">
        Choose the application that matches your request. Event bookings and
        media applications are reviewed separately and require prior approval
        before use.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onOpenEventForm}
          className="inline-flex items-center justify-center gap-2 text-deep-red hover:text-muted-teal underline font-semibold"
        >
          <CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />
          Event venue hire application
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onOpenFilmingForm}
          className="inline-flex items-center justify-center gap-2 text-deep-red hover:text-muted-teal underline font-semibold"
        >
          <Camera className="h-5 w-5 shrink-0" aria-hidden="true" />
          Filming, photography & publicity application
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
