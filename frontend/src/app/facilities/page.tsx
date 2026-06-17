import Link from "next/link";
import { facilities, type Facility } from "@/data/facilities";
import { getPublishedFacilities } from "@/lib/cms/public-data";
import FacilitiesContent from "./FacilitiesContent";
import FacilitiesHero from "./FacilitiesHero";

export const revalidate = 86400;

function mapFallbackFacilities(): Facility[] {
  return facilities.map((facility, index) => ({
    ...facility,
    displayOrder: index,
  }));
}

export default async function Facilities() {
  const cmsFacilities = await getPublishedFacilities();
  const displayedFacilities: Facility[] = cmsFacilities.length
    ? cmsFacilities.map((facility) => {
        const slug = facility.slug || facility.id;
        return {
          id: slug,
          title: facility.name,
          description: facility.description || "",
          imageUrl: facility.image_url || "/clubhouse.jpg",
          displayOrder: facility.display_order,
        };
      })
    : mapFallbackFacilities();

  return (
    <main className="min-h-screen bg-light-cream">
      <FacilitiesHero />
      <FacilitiesContent facilities={displayedFacilities} />

      <footer className="border-t border-dark-teal/10 py-8 text-center">
        <p className="text-sm text-dark-teal/80 md:text-base">
          Interested in hosting an event or becoming a member?{" "}
          <Link
            href="/venue-hire"
            className="font-medium text-deep-red hover:text-muted-teal"
          >
            Hire a venue
          </Link>
          {" · "}
          <Link
            href="/membership"
            className="font-medium text-deep-red hover:text-muted-teal"
          >
            View membership
          </Link>
        </p>
      </footer>
    </main>
  );
}
