# Technical Context

## Frontend Stack

- **Framework:** Next.js 15.5.19 with App Router
- **Language:** TypeScript 5.8.3
- **Runtime UI:** React 19
- **Styling:** Tailwind CSS 3
- **UI Components:** Local shadcn-style primitives with Radix Dialog
- **Forms:** React Hook Form with Zod validation
- **State Management:** React hooks and localStorage-backed form persistence utilities
- **API Communication:** `fetch` through page-level or feature-level API utilities

## Backend Stack

- **Runtime:** Node.js through Next.js API routes
- **Language:** TypeScript
- **Validation:** Zod schemas in API route handlers
- **Email:** Nodemailer 9 using Gmail credentials from environment variables
- **Security Helpers:** Shared HTML escaping, contact validation, and in-memory per-route rate limiting

## Development Environment

- **Package Manager:** npm with committed `package-lock.json` files
- **Version Control:** Git
- **Primary App Directory:** `frontend/`
- **Root Smoke Test:** `npm test` runs the frontend production build

## Setup & Running

1. From the repo root, run `npm install`.
2. From `frontend/`, run `npm install`.
3. Copy `frontend/.env.example` to a local env file and provide email credentials when testing form submissions.
4. Run `npm run dev` from `frontend/`.
5. Access the app at `http://localhost:3000`.

## Environment Variables

- `EMAIL_USER`: Gmail account used to send form emails
- `EMAIL_PASSWORD`: Gmail app password
- `EMAIL_TO`: destination inbox for form submissions
