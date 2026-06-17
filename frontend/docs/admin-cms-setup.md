# Admin CMS Setup

This site uses Firebase Auth for admin login, Supabase Postgres and Storage for CMS content, Vercel for hosting, and Zoho SMTP for outgoing contact emails.

## Firebase

1. Create a Firebase project and enable Email/Password sign-in.
2. Add a web app and copy the public config into `NEXT_PUBLIC_FIREBASE_*`.
3. Create or choose the first admin user in Firebase Authentication.
4. For the first deployment, add that email to `INITIAL_ADMIN_EMAILS`, comma-separated if there are multiple admins.
5. For a more permanent setup, set a Firebase custom claim of `admin: true` on approved users with the Firebase Admin SDK. The app accepts either the custom claim or the allowlist.
6. Create a Firebase service account and set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in Vercel. Keep the private key server-only and store newlines as `\n` escapes.

## Supabase

1. Create a Supabase project.
2. Run `supabase/cms-schema.sql` in the Supabase SQL editor.
3. Confirm the `club-media` bucket exists and is public.
4. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` to Vercel.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. It is used only in admin route handlers after Firebase Admin verification.

RLS is enabled in the SQL file. Anonymous users can read published/active content only. Browser clients do not get insert, update, delete, or storage upload policies.

## Zoho Mail

1. Create the required Zoho mailbox or SMTP app password.
2. Add `ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASSWORD`, `ZOHO_DEFAULT_FROM`, and `ZOHO_DEFAULT_TO` to Vercel.
3. Configure aliases in Zoho as needed, then map enquiry types to recipient aliases in `/admin/contact-routing`.

## Vercel

Add all variables from `.env.example` to the Vercel project. Do not prefix service role keys, Firebase Admin credentials, or SMTP credentials with `NEXT_PUBLIC_`.

## First Admin User

1. Create the user in Firebase Authentication.
2. Add the email to `INITIAL_ADMIN_EMAILS`.
3. Deploy or restart the app.
4. Visit `/admin/login` and sign in.
5. After access works, optionally replace the allowlist with Firebase custom claims.

## Seed Initial Data

After running the SQL schema and setting Supabase env vars locally:

```bash
npm run seed:cms
```

The seed script copies current static facilities, events, committee members, About content, and starter contact routing into Supabase. Static files remain in the app as fallbacks, so the public site still works when Supabase is not configured or a table has no records.
