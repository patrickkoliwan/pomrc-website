import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { adminSections } from "../admin-sections";
import AdminSignOutButton from "./AdminSignOutButton";

export default function AdminShell({
  children,
  title,
  email,
  hideNav = false,
}: {
  children: ReactNode;
  title: string;
  email?: string;
  hideNav?: boolean;
}) {
  const showBackLink = title !== "Dashboard";
  const showNav = !hideNav && title !== "Dashboard";

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="border-b border-muted-teal/30 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {email && (
                <p className="text-sm font-medium text-muted-teal">{email}</p>
              )}
              <h1 className="whitespace-nowrap text-xl font-bold text-dark-teal sm:text-2xl lg:text-3xl">
                {title}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {showBackLink && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-md bg-light-teal px-3 py-2 text-sm font-medium text-dark-teal hover:bg-muted-teal/30"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back to Admin
                </Link>
              )}
              <AdminSignOutButton />
            </div>
          </div>
          {showNav && (
            <nav className="flex flex-wrap gap-2">
              {adminSections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md bg-light-teal px-3 py-2 text-sm font-medium text-dark-teal hover:bg-muted-teal/30"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
