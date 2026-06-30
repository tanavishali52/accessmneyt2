# WORKFLOW.md — Phase-by-Phase Build Guide

Copy-paste each phase prompt into Claude when you're ready. Tick the verify checklist before moving to the next phase.

---

## Phase 1 — New Backend Feature

**Prompt template:**
```
Add a [feature name] module to the NestJS backend at backend/src/[feature]/.

Requirements:
- Schema: [fields]
- DTO: [fields with class-validator decorators]
- Service: [methods needed]
- Controller: [routes, guards needed]
- Register in app.module.ts

Auth rules:
- Public: no guard
- User: @UseGuards(JwtAuthGuard)
- Guest + user both: @UseGuards(OptionalJwtGuard)
- Admin only: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles('admin')
```

**Verify checklist:**
- [ ] Module registered in `app.module.ts`
- [ ] DTO fields all have `class-validator` decorators
- [ ] Schema optional fields have `{ required: false, default: null }`
- [ ] Routes test with curl or Postman
- [ ] No secrets hardcoded — only `process.env.*`

---

## Phase 2 — New Frontend Service (RTK Query)

**Prompt template:**
```
Add a new RTK Query slice at frontend/services/[name]Service.ts.

Endpoints needed:
- GET /[route] → returns [type]
- POST /[route] → body [fields] → returns [type]

Use providesTags and invalidatesTags so the cache refreshes correctly.
Export the hooks as use[Name]Query / use[Name]Mutation.
```

**Verify checklist:**
- [ ] Slice uses `baseApi.injectEndpoints`
- [ ] Tags match between `providesTags` (query) and `invalidatesTags` (mutation)
- [ ] Hooks exported at bottom of file
- [ ] Types defined as interfaces above the slice

---

## Phase 3 — New Frontend Section/Page

**Prompt template:**
```
Create frontend/sections/storefront/[Name]Section.tsx.

Data needed: [list RTK Query hooks]
UI requirements:
- [describe layout]
- Loading state: skeleton
- Error state: alert + back link
- Empty state: message

Follow existing conventions:
- "use client" at top
- Named export function [Name]Section
- Use custom-components: Button, Badge, Card, Heading, Paragraph, Caption, Alert, Divider
- Tailwind only — no inline styles
- No hardcoded colors — use zinc/violet/indigo scale
```

**Verify checklist:**
- [ ] Loading, error, and empty states all handled
- [ ] No `any` types unless unavoidable
- [ ] Mobile responsive (check at 375px)
- [ ] Dark mode looks correct

---

## Phase 4 — Stripe Payment Flow

**Adding a new payment method:**

1. Backend: add method to `payments.service.ts` if new intent type needed
2. Backend: add route to `payments.controller.ts` (keep public — no JwtAuthGuard)
3. Frontend: add mutation to `paymentsService.ts`
4. Frontend: update `PaymentMethodSelector` in `CheckoutSection.tsx`
5. Frontend: handle new method in `handlePay()`

**Verify checklist:**
- [ ] `POST /payments/create-intent` stays public (guests must pay too)
- [ ] `hidePostalCode: true` on CardElement options
- [ ] Guest orders call `createGuestOrder` (saves to DB with `userId: null`)
- [ ] Order `paymentStatus` = `'paid'` if `paymentIntentId` present

---

## Phase 5 — Admin Feature

**Prompt template:**
```
Add [feature] to the admin panel at frontend/sections/admin/[Name]Section.tsx.

Real API data only — no mock data.
Use existing RTK Query hooks from services/.
Show loading skeleton and empty state.
Admin JWT is in Redux store — RTK Query sends it automatically.
```

**Verify checklist:**
- [ ] No mock data — all from real API
- [ ] Admin routes guarded with `@Roles('admin')` on backend
- [ ] Error toast shown on failed mutations (not silent catch)
- [ ] Null-safe for guest orders (`o.userId ?? 'guest'`)

---

## Phase 6 — Push & Deploy

```bash
# From D:/finel-accessmant
git add [specific files]
git status --short          # confirm what's staged
git commit -m "feat: ..."
git push
```

**Never `git add .`** — `backend/uploads/` and `.env` must stay out.

**Verify checklist:**
- [ ] No `.env` files in diff
- [ ] No `node_modules` in diff
- [ ] No hardcoded secrets in source files
- [ ] Both backend and frontend build without errors before push

---

## Common Fixes

| Problem | Fix |
|---------|-----|
| `stripe_1.default is not a constructor` | Use `import Stripe = require('stripe')` + `new (Stripe as any)(...)` |
| Stripe API version error | Update to `2026-06-24.dahlia` |
| DTO field silently stripped | Add missing `class-validator` decorator |
| Guest orders not in admin | Use `POST /orders/guest` public endpoint, not local mock |
| `Cannot read ... of null` on userId | Guard with `o.userId ? ... : 'guest'` |
| Multi-category filter broken | Pass comma-separated, backend uses `$in` with RegExp array |
| CORS error | Check `backend/main.ts` cors origin includes `http://localhost:3000` |
