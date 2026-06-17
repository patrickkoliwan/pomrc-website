"use client";

export default function AdminSignOutButton() {
  return (
    <button
      type="button"
      className="rounded-md border border-muted-teal px-3 py-2 font-medium text-dark-teal hover:bg-light-teal"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" });
        window.location.href = "/admin/login";
      }}
    >
      Sign out
    </button>
  );
}
