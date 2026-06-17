import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "pomrc_admin_session";

function getPrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are not configured");
  }

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
  return (process.env.INITIAL_ADMIN_EMAILS || "")
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
  const token = await getFirebaseAdminAuth().verifyIdToken(idToken);

  if (!isApprovedAdmin(token)) {
    throw new Error("User is not an approved admin");
  }

  return token;
}

export async function createAdminSessionCookie(idToken: string) {
  await verifyAdminIdToken(idToken);
  return getFirebaseAdminAuth().createSessionCookie(idToken, {
    expiresIn: 1000 * 60 * 60 * 12,
  });
}

export async function getCurrentAdmin() {
  const sessionCookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const token = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true
    );
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
