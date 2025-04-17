# Technical Context

## Frontend Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Assumed, verify installation)
- **Forms:** React Hook Form + Zod for validation
- **State Management:** React Hooks (`useState`, `useEffect`). LocalStorage for form persistence (`formStorage` utility).
- **API Communication:** Custom `api` utility (likely using `fetch`)

## Backend Stack (Integrated via Next.js API Routes)

- **Runtime:** Node.js (via Next.js)
- **Language:** TypeScript

## Development Environment

- **OS:** Windows (win32)
- **Package Manager:** npm (Assumed, verify `package-lock.json` or `yarn.lock`)
- **Version Control:** Git

## Key Libraries & Dependencies

- `react`: ^18
- `next`: ^14
- `tailwindcss`: ^3
- `react-hook-form`: latest
- `@hookform/resolvers`: latest (for Zod)
- `zod`: latest
- `shadcn/ui` Dialog component (Needs verification/installation)

## Setup & Running

1. Navigate to `frontend/` directory.
2. Run `npm install` (or `yarn install`).
3. Run `npm run dev` (or `yarn dev`).
4. Access at `http://localhost:3000`.

## Platform Specific Considerations (win32)

- Ensure path separators are handled correctly if manipulating paths manually.
- Standard terminal commands (`cd`, `npm`, etc.) should work as expected.
