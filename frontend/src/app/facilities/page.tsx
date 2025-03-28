import FacilityCard from "../components/FacilityCard";
import MobileContentsMenu from "../components/MobileContentsMenu";
import { facilities, Facility } from "@/data/facilities";

// Enable static generation
export const metadata = {
  generateStaticParams: true,
};

// Mark page as static
export const dynamic = "force-static";

// Add revalidation period (e.g., rebuild page every 24 hours)
export const revalidate = 86400; // 24 hours

export default function Facilities() {
  // Pre-calculate prioritized facilities for better performance
  const isPrioritized = (id: string) =>
    id === "southern-courts" || id === "northern-courts";

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-teal mb-8">
          Our Facilities
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility: Facility) => (
            <div key={facility.id} id={facility.id}>
              <FacilityCard
                title={facility.title}
                description={facility.description}
                imageUrl={facility.imageUrl}
                priority={isPrioritized(facility.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <MobileContentsMenu
        items={facilities.map((f: Facility) => ({
          title: f.title,
          id: f.id,
        }))}
      />
    </main>
  );
}
