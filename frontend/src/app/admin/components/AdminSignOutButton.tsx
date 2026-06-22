"use client";

export default function AdminSignOutButton() {
  return (
    <button
      type="button"
      className="rounded-md border border-deep-red bg-deep-red px-4 py-2 text-sm font-semibold text-light-cream hover:bg-deep-red/90"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" });
        window.location.href = "/admin/login";
      }}
    >
      Sign out
    </button>
  );
}
