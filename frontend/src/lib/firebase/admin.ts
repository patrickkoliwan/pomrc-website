import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEnvPrivateKey, getEnvValue } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "pomrc_admin_session";

export async function getFirebaseAdminAuth() {
  const projectId = getEnvValue("FIREBASE_PROJECT_ID");
  const clientEmail = getEnvValue("FIREBASE_CLIENT_EMAIL");
  const privateKey = getEnvPrivateKey("FIREBASE_PRIVATE_KEY");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are not configured");
  }

  const [{ cert, getApps, initializeApp }, { getAuth }] = await Promise.all([
    import("firebase-admin/app"),
    import("firebase-admin/auth"),
  ]);

  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });

  return getAuth(app);
}

export function getAdminAllowlist() {
  return (getEnvValue("INITIAL_ADMIN_EMAILS") || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isApprovedAdmin(token: DecodedIdToken) {
  if (token.admin === true) {
    return true;
  }

  const email = token.email?.toLowerCase();
  return Boolean(email && getAdminAllowlist().includes(email));
}

export async function verifyAdminIdToken(idToken: string) {
  const auth = await getFirebaseAdminAuth();
  const token = await auth.verifyIdToken(idToken);

  if (!isApprovedAdmin(token)) {
    throw new Error("User is not an approved admin");
  }

  return token;
}

export async function createAdminSessionCookie(idToken: string) {
  await verifyAdminIdToken(idToken);
  const auth = await getFirebaseAdminAuth();
  return auth.createSessionCookie(idToken, {
    expiresIn: 1000 * 60 * 60 * 12,
  });
}

export async function getCurrentAdmin() {
  const sessionCookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const auth = await getFirebaseAdminAuth();
    const token = await auth.verifySessionCookie(sessionCookie, true);
    return isApprovedAdmin(token) ? token : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
