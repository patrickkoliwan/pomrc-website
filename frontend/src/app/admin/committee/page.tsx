import AdminCommitteeManager from "./AdminCommitteeManager";
import AdminShell from "../components/AdminShell";
import { dedupeCommitteeMembers } from "@/lib/cms/committee";
import { listCmsRecords } from "@/lib/cms/admin-data";
import type {
  CommitteeMemberRecord,
  CommitteePositionRecord,
} from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminCommitteePage() {
  const admin = await requireAdmin();
  const records = await listCmsRecords<CommitteeMemberRecord>("committee_members");
  const positions =
    await listCmsRecords<CommitteePositionRecord>("committee_positions");
  const uniqueRecords = dedupeCommitteeMembers(records);

  return (
    <AdminShell title="Committee Members" email={admin.email}>
      <AdminCommitteeManager
        initialPositions={positions}
        initialMembers={uniqueRecords}
      />
    </AdminShell>
  );
}
