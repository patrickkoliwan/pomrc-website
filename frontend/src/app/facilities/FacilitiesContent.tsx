import type { Facility } from "@/data/facilities";
import FacilityCardMinimal from "./FacilityCardMinimal";

interface FacilitiesContentProps {
  facilities: Facility[];
}

export default function FacilitiesContent({
  facilities,
}: FacilitiesContentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {facilities.map((facility) => (
          <FacilityCardMinimal
            key={facility.id}
            id={facility.id}
            title={facility.title}
            description={facility.description}
            imageUrl={facility.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
