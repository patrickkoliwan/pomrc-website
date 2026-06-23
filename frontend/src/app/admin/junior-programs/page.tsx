import AdminResourceManager from "../components/AdminResourceManager";
import AdminShell from "../components/AdminShell";
import { CMS_IMAGE_PRESETS } from "../components/image-presets";
import JuniorProgramNoticeEditor from "./JuniorProgramNoticeEditor";
import { getJuniorProgramNotice, listCmsRecords } from "@/lib/cms/admin-data";
import type { JuniorProgramRecord } from "@/lib/cms/types";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminJuniorProgramsPage() {
  const admin = await requireAdmin();
  const [records, notice] = await Promise.all([
    listCmsRecords<JuniorProgramRecord>("junior_programs"),
    getJuniorProgramNotice(),
  ]);

  return (
    <AdminShell title="Junior Programs" email={admin.email} hideNav>
      <div className="space-y-6">
        <JuniorProgramNoticeEditor notice={notice} />
        <AdminResourceManager
          table="junior_programs"
          records={records}
          titleField="title"
          enableArchive
          resourceLabel={{
            singular: "Junior Program",
            plural: "Junior Programs",
          }}
          newRecord={{
            title: "",
            program_type: "tennis",
            description: "",
            day_text: "",
            time_text: "",
            location: "",
            price: "",
            image_url: "",
            published: true,
          }}
          fields={[
            { name: "title", label: "Title", type: "text", required: true },
            {
              name: "program_type",
              label: "Type",
              type: "select",
              required: true,
              options: [
                { label: "Tennis", value: "tennis" },
                { label: "Squash", value: "squash" },
                { label: "Other", value: "other" },
              ],
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              required: true,
            },
            {
              name: "day_text",
              label: "Date/day text",
              type: "text",
              required: true,
              helpText:
                "Examples: Saturday, Tuesday & Thursday. Programs are ordered automatically by day of the week.",
            },
            {
              name: "time_text",
              label: "Time text",
              type: "text",
              required: true,
              helpText: "Example: 4:00 PM - 5:00 PM.",
            },
            { name: "location", label: "Location", type: "text", required: true },
            { name: "price", label: "Price", type: "text", required: true },
            {
              name: "image_url",
              label: "Image",
              type: "image",
              helpText:
                "Phone photos welcome, including HEIC. Large files are compressed automatically; crop preview exports as a 3:2 WebP around 1200px wide.",
              imageProcessing: {
                aspect: CMS_IMAGE_PRESETS.landscapePromo.aspect,
                targetWidth: CMS_IMAGE_PRESETS.landscapePromo.targetWidth,
              },
            },
            {
              name: "published",
              label: "Visible on junior programs page",
              type: "checkbox",
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
