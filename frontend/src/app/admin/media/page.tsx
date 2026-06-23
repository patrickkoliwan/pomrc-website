import MediaUploader from "../components/MediaUploader";
import AdminShell from "../components/AdminShell";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminMediaPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell title="Media Library" email={admin.email} hideNav>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <MediaUploader />
      </div>
    </AdminShell>
  );
}
