import AdminResourceManager from "../components/AdminResourceManager";
import AdminShell from "../components/AdminShell";
import { listCmsRecords } from "@/lib/cms/admin-data";
import type { ContactRoutingRecord } from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminContactRoutingPage() {
  const admin = await requireAdmin();
  const records = await listCmsRecords<ContactRoutingRecord>("contact_routing");

  return (
    <AdminShell title="Contact Routing" email={admin.email} hideNav>
      <AdminResourceManager
        table="contact_routing"
        records={records}
        titleField="label"
        newRecord={{
          enquiry_type: "",
          label: "",
          recipient_email: "",
          cc_emails: [],
          active: true,
        }}
        fields={[
          { name: "enquiry_type", label: "Enquiry type", type: "text", required: true, helpText: "Lowercase key such as membership or venue-hire." },
          { name: "label", label: "Label", type: "text", required: true },
          { name: "recipient_email", label: "Recipient email", type: "text", required: true },
          { name: "cc_emails", label: "CC emails", type: "tags", helpText: "One email per line." },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
      />
    </AdminShell>
  );
}
