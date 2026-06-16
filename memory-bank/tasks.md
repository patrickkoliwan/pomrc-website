# Tasks

## Active Tasks

- [x] Frontend dependency security update and docs refresh
  - [x] Upgrade Next.js within the 15.x line
  - [x] Upgrade Nodemailer
  - [x] Align frontend TypeScript with root TypeScript
  - [x] Run final audit and build verification
  - [x] Confirm no remaining audit findings

## Backlog

- [x] Venue-hire full terms flow
  - [x] Verify/Install Modal Component (e.g., shadcn/ui Dialog)
  - [x] Refactor `TermsAndConditions` into `TermsDisplay` and `TermsAcceptance`
  - [x] Modify `page.tsx`: Add modal state, rearrange static content, add CTA, render Modal
  - [x] Create `VenueHireFormModalContent.tsx` component with form sections, static info, and controls
  - [x] Pass form state/handlers from `page.tsx` to `VenueHireFormModalContent.tsx`
  - [x] Update `onSubmit` in `page.tsx` to close modal on success
  - [x] Keep public `TermsDisplay` as a read-only full-terms preview
  - [x] Add explicit `hasAcceptedFullTerms` state for form submission
  - [x] Verify build after terms viewing/acceptance flow changes
- [x] Hide stale 2025 upcoming event content until current event details are available

## Completed Tasks

- [x] Enhance About Page Design v1.0 - Completed on 2024-07-26
- [x] Define Hero Section component - Completed on 2024-07-26
- [x] Select and prepare Hero background image - Completed on 2024-07-26
- [x] Implement Hero Section layout and styling - Completed on 2024-07-26
- [x] Refactor Legacy/Tradition sections layout - Completed on 2024-07-26
- [x] Add visual separators or background variations - Completed on 2024-07-26
- [x] Install framer-motion - Completed on 2024-07-26
- [x] Implement subtle animations on scroll (e.g., fade-in) - Completed on 2024-07-26
- [x] Enhance Gallery hover/interaction (if time permits) - SKIPPED on 2024-07-26
- [x] Implement Call to Action (CTA) section/button - Completed on 2024-07-26
- [x] Test responsiveness across devices - Completed on 2024-07-26
- [x] Verify accessibility (contrast, focus states) - Completed on 2024-07-26
- [x] Merge Saturday Junior Tennis Programs - Completed on 2024-07-26
- [x] Merge Tuesday & Thursday Junior Tennis Programs - Completed on 2024-07-26
- [x] Read `frontend/src/app/about/page.tsx` and update structure/copy - Completed on 2024-07-26
- [x] Consolidate duplicate Next config into `next.config.ts`
- [x] Move email sender configuration to environment variables
- [x] Escape submitted values in HTML email templates
- [x] Replace shared/global API rate counters with per-route rate limiting
- [x] Add root build smoke test
