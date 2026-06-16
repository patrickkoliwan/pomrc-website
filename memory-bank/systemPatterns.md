# System Patterns

## Architecture Overview

- **Application:** Next.js App Router project in `frontend/`
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Integrated Next.js API routes
- **Communication:** Client components submit forms with `fetch` to local API routes
- **Persistence:** No database; forms are emailed to configured recipients

## Frontend Patterns

- Server Components are the default for static pages.
- Client Components use `"use client"` for interactive forms, modals, carousels, and local state.
- Form-heavy features are organized by route with local `components/` and `utils/` folders.
- Shared cross-feature helpers live under `frontend/src/app/utils`.
- Styling uses Tailwind utility classes and project colors from Tailwind config.

## Backend Patterns

- API routes live under `frontend/src/app/api`.
- Each form route validates request data with Zod before sending email.
- Form email utilities build HTML emails with escaped submitted values.
- Email configuration comes from `EMAIL_USER`, `EMAIL_PASSWORD`, and `EMAIL_TO`.
- Rate limiting is in-memory and scoped by route plus client IP.

## Directory Structure

```text
pomrc-website/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/        # App Router pages, API routes, feature utilities
│   │   ├── components/ # Shared UI and content components
│   │   ├── data/       # Static site content
│   │   └── lib/        # Generic helpers
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── docs/
│   └── archive/
└── memory-bank/
```

## Coding Conventions

- Use TypeScript strict mode.
- Prefer shared schemas/helpers when client and API behavior must match.
- Keep public content in local data/components unless a CMS is introduced later.
- Run `npm test` from the repo root before committing.
