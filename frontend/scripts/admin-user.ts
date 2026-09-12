import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");
    process.env[key] ||= value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in .env.local");
  process.exit(1);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

const auth = getAuth(app);

const [command, email] = process.argv.slice(2);

async function list() {
  const { users } = await auth.listUsers(100);
  console.log(`Project: ${projectId} — ${users.length} user(s)\n`);

  for (const user of users) {
    const isAdmin = user.customClaims?.admin === true;
    console.log(
      [
        user.email ?? "(no email)",
        `uid=${user.uid}`,
        `admin claim: ${isAdmin ? "YES" : "no"}`,
        `last sign-in: ${user.metadata.lastSignInTime || "never"}`,
      ].join("  |  "),
    );
  }
}

async function grant(target: string) {
  const user = await auth.getUserByEmail(target);
  await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
  console.log(`Granted admin claim to ${target} (uid=${user.uid}).`);
  console.log("Sign out and sign back in at /admin/login for it to take effect.");
}

async function revoke(target: string) {
  const user = await auth.getUserByEmail(target);
  const claims = { ...user.customClaims };
  delete claims.admin;
  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`Removed admin claim from ${target} (uid=${user.uid}).`);
}

async function password(target: string) {
  const newPassword = process.env.NEW_ADMIN_PASSWORD;

  if (!newPassword || newPassword.length < 8) {
    console.error("Set NEW_ADMIN_PASSWORD (at least 8 characters) when running this command.");
    process.exit(1);
  }

  const user = await auth.getUserByEmail(target);
  await auth.updateUser(user.uid, { password: newPassword });
  console.log(`Password updated for ${target} (uid=${user.uid}).`);
}

async function main() {
  if (command === "list") {
    return list();
  }

  if (!email) {
    console.error("Usage:\n  tsx scripts/admin-user.ts list\n  tsx scripts/admin-user.ts grant <email>\n  tsx scripts/admin-user.ts revoke <email>\n  NEW_ADMIN_PASSWORD=... tsx scripts/admin-user.ts password <email>");
    process.exit(1);
  }

  if (command === "grant") return grant(email);
  if (command === "revoke") return revoke(email);
  if (command === "password") return password(email);

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
