import AdminEventsManager from "./AdminEventsManager";
import AdminShell from "../components/AdminShell";
import { listCmsRecords } from "@/lib/cms/admin-data";
import type { ClubEventRecord } from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminEventsPage() {
  const admin = await requireAdmin();
  const records = await listCmsRecords<ClubEventRecord>("club_events");

  return (
    <AdminShell title="Events" email={admin.email} hideNav>
      <AdminEventsManager records={records} />
    </AdminShell>
  );
}
