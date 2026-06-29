# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**ShopHub** — a full-stack e-commerce monorepo with two independent apps:

- `backend/` — NestJS 10 REST API (Mongoose/MongoDB, JWT auth via Passport, Stripe payments, Multer uploads). All routes are under the `/api` prefix; the server runs on port **3001**.
- `frontend/` — Next.js 16 / React 19 storefront + admin panel (Redux Toolkit + RTK Query, redux-persist, Tailwind CSS 4, Stripe.js). Runs on port **3000**.

There is no root package.json — run commands inside each app's folder.

## Commands

### Backend (`cd backend`)
- `npm run start:dev` — watch-mode dev server (http://localhost:3001/api)
- `npm run build` / `npm start` — production build & run
- `npm test` or `npm run test:e2e` — Jest e2e route tests (in-memory MongoDB; real DB untouched, Stripe mocked)

### Frontend (`cd frontend`)
- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` / `npm start` — production build & run
- `npm run lint` — ESLint

## Conventions & important facts

- **Next.js here is NOT the version in your training data.** Before writing frontend code, read the relevant guide under `frontend/node_modules/next/dist/docs/` and heed deprecation notices. (See `frontend/AGENTS.md`.)
- **Validation:** the backend uses a global `ValidationPipe({ whitelist: true })`. Any DTO property **must** carry a `class-validator` decorator or it is silently stripped from the request body.
- **Auth:** JWT in the `Authorization: Bearer <token>` header. Admin-only routes use `JwtAuthGuard` + `RolesGuard` with `@Roles('admin')`.
- **Seeded accounts** (created on first backend boot): `admin@shop.com` / `admin123` and `customer@shop.com` / `customer123`, plus 20 products.
- **Frontend data fetching** goes through RTK Query slices in `frontend/services/`. Pages live in `app/`, with the bulk of UI logic in `frontend/sections/` and reusable pieces in `frontend/custom-components/`.
- **Catalog filtering** is URL-driven: `/shop?category=…&q=…&sortBy=…&page=…`. `CatalogSection` treats the URL as the source of truth.
- **Theming/background:** the global gradient (light = pastel sweep, dark = aurora + starfield) is defined in `frontend/app/globals.css`. Sections are transparent so it shows through.

## Architecture map (backend)

Each feature is a NestJS module under `backend/src/<feature>/` with a `controller`, `service`, `dto/`, and (where it persists data) a Mongoose `schemas/`. Features: `auth`, `users`, `products`, `cart`, `orders`, `payments`, `reviews`, `upload`, `seed`.

## When making changes

- Match the surrounding code style; keep edits scoped.
- If you touch a route, update or add the matching test in `backend/test/*.e2e-spec.ts`.
- Don't commit secrets — `backend/.env` holds keys and is gitignored.
