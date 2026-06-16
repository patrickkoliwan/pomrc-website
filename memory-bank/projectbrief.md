# Project Brief

## Overview

Port Moresby Racquets Club website built as a Next.js application with integrated API routes for form submissions.

## Core Requirements

1. Modern, responsive public website for club information and enquiries
2. Type-safe development with TypeScript
3. Maintainable React components and feature-scoped utilities
4. Secure contact, membership, and venue-hire form handling
5. Performance-conscious pages using local assets and Next.js build tooling

## Technical Stack

### Frontend

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form and Zod
- Local shadcn-style UI primitives

### Backend

- Next.js API routes under `frontend/src/app/api`
- Zod request validation
- Nodemailer-based email delivery using environment variables
- Shared helpers for email escaping, contact validation, and in-memory rate limiting

## Development Priorities

1. Keep public club content current
2. Preserve working form submission flows
3. Keep dependencies secure and builds passing
4. Maintain clean shared validation and utility patterns
5. Document current architecture as it changes
