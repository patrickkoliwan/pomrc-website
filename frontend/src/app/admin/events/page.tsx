import AdminResourceManager from "../components/AdminResourceManager";
import AdminShell from "../components/AdminShell";
import { listCmsRecords } from "@/lib/cms/admin-data";
import type { ClubEventRecord } from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminEventsPage() {
  const admin = await requireAdmin();
  const records = await listCmsRecords<ClubEventRecord>("club_events");

  return (
    <AdminShell title="Events" email={admin.email}>
      <AdminResourceManager
        table="club_events"
        records={records}
        titleField="title"
        enableArchive
        newRecord={{
          title: "",
          description: "",
          day: "",
          event_date: "",
          start_time: "",
          end_time: "",
          image_url: "",
          display_order: 0,
          published: true,
        }}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "day", label: "Day", type: "text", helpText: "Use for weekly events, e.g. Thursday." },
          { name: "event_date", label: "Event date", type: "date" },
          { name: "start_time", label: "Start time", type: "text" },
          { name: "end_time", label: "End time", type: "text" },
          { name: "image_url", label: "Image", type: "image" },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "published", label: "Visible on events page", type: "checkbox" },
        ]}
      />
    </AdminShell>
  );
}
