# NOTES.md — Build Log & Decisions

---

## Architecture Decisions

### Guest Orders saved to DB
**Decision:** Guest checkout creates a real order in MongoDB with `userId: null`  
**Why:** Admin panel needs to see all orders. Client-side only orders are lost on refresh.  
**How:** Added `POST /orders/guest` as a public endpoint (no JwtAuthGuard). `userId` field on Order schema made optional with `default: null`.

### OptionalJwtGuard
**Decision:** Reviews endpoint uses `OptionalJwtGuard` instead of making it fully public or fully guarded  
**Why:** Logged-in users should have their name pre-filled; guests can still submit. Same endpoint handles both.  
**Guard location:** `backend/src/auth/guards/optional-jwt.guard.ts`

### Deterministic Star Ratings on ProductCard
**Decision:** Star ratings on catalog cards are calculated from `product._id` character codes  
**Why:** Real ratings weren't in the DB schema yet. This gives stable, realistic-looking 3.5–4.9 stars per product without DB reads.  
**Formula:** `idSum % 15 / 10 + 3.5` for rating, `20 + idSum % 180` for review count  
**Note:** ProductDetailSection shows real ratings from `/reviews/:id/stats`

### Stripe CommonJS Import
**Decision:** `import Stripe = require('stripe')` instead of `import Stripe from 'stripe'`  
**Why:** NestJS compiles to CommonJS. The default ESM import causes `stripe_1.default is not a constructor` at runtime.  
**Also:** Constructor wrapped as `new (Stripe as any)(...)` to satisfy TypeScript.

### Multi-Category Filter
**Decision:** Categories passed as comma-separated string `?category=A,B`  
**Why:** URLSearchParams doesn't support repeated keys cleanly across all browsers/frameworks.  
**Backend:** Splits on comma → `$in` query with case-insensitive RegExp array  
**Frontend:** `categories.join(',')` → API; `params.append('category', c)` per item for URL sync

---

## Bugs Caught & Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Admin order status not updating | Silent error swallowing in `handleStatusChange` | Added toast feedback state; confirmed endpoint works via curl |
| Guest orders not in admin | Guest checkout only created local mock object | Added `POST /orders/guest` backend endpoint; frontend calls `createGuestOrder` |
| `Cannot read properties of null (reading 'slice')` | `o.userId` is null for guest orders | Added null check: `o.userId ? 'user ' + o.userId.slice(-6) : 'guest'` |
| Stripe ZIP field showing | Default CardElement shows postal code | Added `hidePostalCode: true` to CardElement options |
| Stripe API version error | Used outdated `'2025-05-28.basil'` | Updated to `'2026-06-24.dahlia'` |
| `stripe_1.default is not a constructor` | ESM/CJS interop | Changed import style + constructor call |
| `Express.Multer.File` type error | Missing type package | Installed `@types/multer` as devDependency |
| Multiple filters only using first | Backend expected single string; frontend passed `categories[0]` | Comma-separated + `$in` query |

---

## UI Decisions

### Login / Signup Layout
**Changed:** Removed left purple decorative panel on both auth pages  
**Now:** Single centered card with white background, border, and shadow  
**Why:** User requested simpler layout — left panel felt heavy and unused  
**Files:** `sections/auth/LoginSection.tsx`, `sections/auth/SignupSection.tsx`

### Pay Button Width
**Changed:** Removed `fullWidth` from Pay button in CheckoutSection  
**Why:** Button was stretching full row width — user wanted it sized to content

### Hero CTA Buttons
- "Shop Now": `bg-gradient-to-r from-violet-600 to-indigo-600`, `rounded-2xl`, glow shadow, animated arrow
- "Sale Picks": glass border style with violet border

### Global Background
- Light mode: `linear-gradient(135deg, #f5f3ff → #ede9fe → #e0f2fe → #ecfdf5 → #fdf4ff)` fixed attachment
- Dark mode: aurora gradient + starfield — applied via `.dark body` in `globals.css`
- All sections are transparent — background shows through everywhere

---

## Stripe Credentials (test keys — in .env only)

- Public key: `pk_test_51TnhBN...` (safe for frontend)
- Secret key: in `backend/.env` as `STRIPE_SECRET_KEY` — never in source

---

## Current State (as of last session)

### Completed Features
- Auth (login, signup, JWT, guest mode)
- Product catalog with multi-category URL-driven filtering
- Product detail page with real review stats
- Server cart (auth) + local cart (guest) with merge on login
- Checkout: Stripe card + Cash on Delivery
- Guest checkout saves real orders to DB
- Admin: dashboard (real API), orders (with status updates + toast), products
- Product reviews & ratings — full backend + UI (modal, list, breakdown bar)
- Image uploads via Multer
- Light mode gradient on all pages
- Auth pages: centered card layout (no left panel)

### Pending / Future Ideas
- Wishlist / saved items
- Order history page for customers
- Email notifications on order placed
- Product search with debounce
- Pagination on admin products list
- Password reset flow
