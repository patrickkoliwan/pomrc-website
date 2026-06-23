import AdminShell from "../components/AdminShell";
import MembershipAdminTabs from "./MembershipAdminTabs";
import { requireAdmin } from "@/lib/firebase/admin";
import { listMembershipApplications } from "@/lib/membership/applications";
import { getMembershipPricing } from "@/lib/membership/pricing";

export default async function AdminMembershipApplicationsPage() {
  const admin = await requireAdmin();
  const [applications, pricing] = await Promise.all([
    listMembershipApplications(),
    getMembershipPricing(),
  ]);

  return (
    <AdminShell title="Membership Applications" email={admin.email} hideNav>
      <MembershipAdminTabs applications={applications} pricing={pricing} />
    </AdminShell>
  );
}
