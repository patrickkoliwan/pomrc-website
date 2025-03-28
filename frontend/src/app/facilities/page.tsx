import FacilityCard from "../components/FacilityCard";
import MobileContentsMenu from "../components/MobileContentsMenu";
import { facilities, Facility } from "@/data/facilities";

export default function Facilities() {
  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-dark-teal mb-8">
          Our Facilities
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility: Facility) => (
            <div key={facility.id} id={facility.id}>
              <FacilityCard
                title={facility.title}
                description={facility.description}
                imageUrl={facility.imageUrl}
                priority={
                  facility.id === "southern-courts" ||
                  facility.id === "northern-courts"
                } // Prioritize first visible images
              />
            </div>
          ))}
        </div>
      </div>

      <MobileContentsMenu
        items={facilities.map((f: Facility) => ({ title: f.title, id: f.id }))}
      />
    </main>
  );
}
