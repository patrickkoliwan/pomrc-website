"use client";

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const auth = getFirebaseAuth();
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credentials.user.getIdToken();
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("This account is not approved for admin access.");
      }

      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (loginError) {
      if (loginError instanceof FirebaseError) {
        setError("Invalid email or password.");
      } else {
        setError(
          loginError instanceof Error
            ? loginError.message
            : "Unable to sign in right now."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-dark-teal">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-dark-teal">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
        />
      </div>
      {error && <p className="text-sm text-deep-red">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-dark-teal px-4 py-3 font-semibold text-light-cream hover:bg-muted-teal disabled:cursor-not-allowed disabled:bg-muted-teal"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
