import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-light-cream">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-teal">
              Port Moresby Racquets Club
            </p>
            <h1 className="mt-2 text-3xl font-bold text-dark-teal">
              Admin Login
            </h1>
          </div>
          <Suspense fallback={<p className="text-sm text-muted-teal">Loading...</p>}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
