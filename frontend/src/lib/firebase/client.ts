"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { normalizeEnvValue } from "@/lib/env";

export function getFirebaseAuth() {
  const config = {
    apiKey: normalizeEnvValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: normalizeEnvValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: normalizeEnvValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    appId: normalizeEnvValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  };

  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error("Firebase public environment variables are not configured");
  }

  const app = getApps().length ? getApps()[0] : initializeApp(config);
  return getAuth(app);
}
