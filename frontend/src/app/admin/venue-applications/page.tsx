import AdminShell from "../components/AdminShell";
import VenueApplicationsTabs from "./VenueApplicationsTabs";
import { requireAdmin } from "@/lib/firebase/admin";
import { listFilmingApplications } from "@/lib/venue-applications/filming";
import { listVenueHireApplications } from "@/lib/venue-applications/venue-hire";

export default async function AdminVenueApplicationsPage() {
  const admin = await requireAdmin();
  const [venueHireApplications, filmingApplications] = await Promise.all([
    listVenueHireApplications(),
    listFilmingApplications(),
  ]);

  return (
    <AdminShell title="Venue & Filming Applications" email={admin.email} hideNav>
      <VenueApplicationsTabs
        venueHireApplications={venueHireApplications}
        filmingApplications={filmingApplications}
      />
    </AdminShell>
  );
}
