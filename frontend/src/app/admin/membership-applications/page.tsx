import AdminShell from "../components/AdminShell";
import MembershipApplicationsManager from "./MembershipApplicationsManager";
import { requireAdmin } from "@/lib/firebase/admin";
import { listMembershipApplications } from "@/lib/membership/applications";

export default async function AdminMembershipApplicationsPage() {
  const admin = await requireAdmin();
  const applications = await listMembershipApplications();

  return (
    <AdminShell title="Membership Applications" email={admin.email}>
      <MembershipApplicationsManager applications={applications} />
    </AdminShell>
  );
}
