import AdminResourceManager from "../components/AdminResourceManager";
import AdminShell from "../components/AdminShell";
import { listCmsRecords } from "@/lib/cms/admin-data";
import type { CommitteeMemberRecord } from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminCommitteePage() {
  const admin = await requireAdmin();
  const records = await listCmsRecords<CommitteeMemberRecord>("committee_members");

  return (
    <AdminShell title="Committee Members" email={admin.email}>
      <AdminResourceManager
        table="committee_members"
        records={records}
        titleField="name"
        newRecord={{
          name: "",
          title: "",
          photo_url: "",
          bio: "",
          email_alias: "",
          display_order: 0,
          published: true,
        }}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "photo_url", label: "Photo", type: "image" },
          { name: "bio", label: "Bio", type: "textarea" },
          { name: "email_alias", label: "Email alias", type: "text" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "published", label: "Published", type: "checkbox" },
        ]}
      />
    </AdminShell>
  );
}
