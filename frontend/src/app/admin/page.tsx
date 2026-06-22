import Link from "next/link";
import { adminSections } from "./admin-sections";
import AdminShell from "./components/AdminShell";
import { requireAdmin } from "@/lib/firebase/admin";

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  return (
    <AdminShell title="Dashboard" email={admin.email}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-muted-teal/20 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-dark-teal">{section.label}</h2>
            <p className="mt-3 text-sm leading-6 text-dark-teal/75">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
