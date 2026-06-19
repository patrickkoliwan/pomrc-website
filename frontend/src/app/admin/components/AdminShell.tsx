import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import AdminSignOutButton from "./AdminSignOutButton";

const navItems = [
  { href: "/admin/membership-applications", label: "Membership Applications" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/junior-programs", label: "Junior Programs" },
  { href: "/admin/committee", label: "Committee Members" },
  { href: "/admin/contact-routing", label: "Contact Routing" },
  { href: "/admin/media", label: "Media Library" },
];

export default function AdminShell({
  children,
  title,
  email,
}: {
  children: ReactNode;
  title: string;
  email?: string;
}) {
  const showBackLink = title !== "Dashboard";

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="border-b border-muted-teal/30 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/admin" className="text-sm font-medium text-muted-teal">
                POMRC Admin
              </Link>
              <h1 className="text-3xl font-bold text-dark-teal">{title}</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-teal">
              {showBackLink && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-md bg-light-teal px-3 py-2 font-medium text-dark-teal hover:bg-muted-teal/30"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back to Admin
                </Link>
              )}
              {email && <span>{email}</span>}
              <AdminSignOutButton />
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md bg-light-teal px-3 py-2 text-sm font-medium text-dark-teal hover:bg-muted-teal/30"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
