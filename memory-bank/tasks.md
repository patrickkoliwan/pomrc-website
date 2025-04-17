# Tasks

## Active Tasks

- [ ] Refactor Venue Hire page to use Modal v1.0
  - [x] Verify/Install Modal Component (e.g., shadcn/ui Dialog)
  - [x] Refactor `TermsAndConditions` into `TermsDisplay` and `TermsAcceptance`
  - [x] Modify `page.tsx`: Add modal state, rearrange static content, add CTA, render Modal
  - [x] Create `VenueHireFormModalContent.tsx` component with form sections, static info, and controls
  - [x] Pass form state/handlers from `page.tsx` to `VenueHireFormModalContent.tsx`
  - [x] Update `onSubmit` in `page.tsx` to close modal on success
  - [ ] Adjust layout in `VenueHireFormModalContent.tsx` to move Terms section down (Obsolete)
  - [ ] Simplify `TermsDisplay.tsx` (remove nested modal, modify button action)
  - [ ] Add state (`isViewingFullTerms`, `hasAcceptedFullTerms`) to `VenueHireFormModalContent.tsx`
  - [ ] Implement conditional rendering in `VenueHireFormModalContent.tsx` (show form OR full terms)
  - [ ] Add 'Accept Full Terms' and 'Back' buttons to full terms view
  - [ ] Update main submit button logic to require `hasAcceptedFullTerms` and RHF checkbox validation
  - [ ] Test new terms viewing/acceptance flow and overall form functionality

## Future Tasks

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
