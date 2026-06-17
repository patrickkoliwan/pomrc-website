import Link from "next/link";
import AdminShell from "./components/AdminShell";
import { requireAdmin } from "@/lib/firebase/admin";

const cards = [
  {
    href: "/admin/membership-applications",
    title: "Membership Applications",
    description: "Review submitted applications and track approval and payment status.",
  },
  {
    href: "/admin/events",
    title: "Events",
    description: "Publish regular activities, dated events, and event times.",
  },
  {
    href: "/admin/committee",
    title: "Committee Members",
    description: "Update committee profiles, photos, and email aliases.",
  },
  {
    href: "/admin/contact-routing",
    title: "Contact Routing",
    description: "Route form enquiries to the right Zoho mailbox or alias.",
  },
  {
    href: "/admin/media",
    title: "Media Library",
    description: "Upload images to Supabase Storage for use in content.",
  },
];

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  return (
    <AdminShell title="Dashboard" email={admin.email}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-muted-teal/20 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-dark-teal">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-dark-teal/75">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
