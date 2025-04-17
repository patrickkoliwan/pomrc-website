# System Patterns

## Architecture Overview

- **Frontend:** Next.js (TypeScript, Tailwind CSS, App Router)
- **Backend:** Next.js API Routes (Initial)
- **Communication:** Direct fetch within Next.js
- **Database:** TBD

## Frontend Patterns

- **Component Model:** Mix of Server Components (default) and Client Components (`"use client"`) for interactivity.
- **State Management:** Primarily React Hooks (`useState`, `useEffect`, `useContext`). Consider Zustand or Jotai for complex global state if needed later.
- **Styling:** Utility-first with Tailwind CSS. Custom colors defined in `tailwind.config.js`.
- **Routing:** Next.js App Router for file-based routing.
- **Data Fetching:** Server Components for server-side fetching, `fetch` API or SWR/React Query in Client Components.

## Backend Patterns (API Routes)

- **Structure:** Organized by feature within `src/app/api/`.
- **Request Handling:** Standard Next.js `Request` and `Response` objects.
- **Error Handling:** Centralized error handling middleware (TBD).
- **Validation:** TBD (e.g., Zod).

## Directory Structure

```
pomrc-website/
├── frontend/         # Next.js application
│   ├── public/
│   ├── src/
│   │   ├── app/        # App Router pages and API routes
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # Utility functions, constants
│   │   └── styles/     # Global styles
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── backend/          # Currently integrated via Next.js API Routes
├── docs/
│   └── archive/
└── memory-bank/
```

## Coding Conventions

- Follow Next.js and React best practices.
- Use TypeScript strict mode.
- Adhere to ESLint rules.
- Prefer functional components with hooks.
- Keep components small and focused.
- Use descriptive naming for variables, functions, and components.
