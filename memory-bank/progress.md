# Progress

## Current Status

- Current phase: Maintenance and security hardening.
- Recent work consolidated Next config, hardened form email generation, improved form API rate limiting, cleaned unused starter assets, and added a root build smoke test.
- Current task: frontend dependency security update and documentation refresh completed.

## What Works

- Next.js App Router site builds successfully.
- Contact, membership, and venue-hire forms submit through Next.js API routes.
- Form emails use environment-based Gmail credentials and escaped HTML content.
- API routes use shared per-route, per-IP in-memory rate limiting.
- Root `npm test` runs the frontend production build.

## What's Left

- Update stale event content once current replacement event details are available.
- Venue-hire full-terms modal flow has partial implementation and should remain backlog until explicitly prioritized.

## Blockers

- Current event replacements are a content/product decision.

## Completed Tasks

- See `tasks.md` for completed and backlog items.

## Reflections / Learnings

- Reusable shared helpers are useful for form hardening across contact, membership, and venue-hire flows.
- Keep package and memory-bank docs synchronized after dependency maintenance to avoid stale stack assumptions.
- Targeted npm overrides can address nested advisories without forcing unsafe framework downgrades when the build still verifies.
