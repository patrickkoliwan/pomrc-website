# Active Context

## Current Focus

- Task: Refactor Venue Hire page Modal - Inline Terms View
- Objective: Implement inline view for full T&Cs within the form modal, requiring explicit acceptance.
- Current Step: Simplify `TermsDisplay.tsx`.

## Recent Changes

- Attempted layout adjustment for terms in modal (now obsolete).
- Updated `tasks.md` with new plan for inline terms view (manual verification needed).

## Next Steps

- Remove nested modal from `TermsDisplay.tsx`.
- Modify `TermsDisplay` button to trigger parent state change.
- Implement state and conditional rendering in `VenueHireFormModalContent.tsx`.
