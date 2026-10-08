# Devi Jewellers — Web Frontend Repository (`devi_frontend`)

Standalone Next.js 16 (Turbopack) web application for Devi Jewellers owner & staff management portal and public customer checkout pages.

---

## Project structure

```text
app/                         Next.js routes and root layout
  page.tsx                   Owner/staff workspace (/)
  portal/page.tsx            Customer portal (/portal)
  pay/[linkId]/page.tsx      Payment checkout (/pay/:linkId)
components/ui/               Shared Badge, Empty, Field, Input, Modal and Table
features/
  workspace/
    Workspace.tsx           Composes authentication, navigation, views and modal
    hooks/                  Workspace state/loading and pending-write recovery
    actions/                Form submission and server-confirmed updates
    views/                  Dashboard, customers, accounts, payments, reports, etc.
    forms/                  Individual modal fields and settings form
    auth/                   Login, password change and loading screens
    components/             Sidebar, heading and modal container
    navigation.ts           Owner/staff navigation definitions
  customer-portal/
    CustomerPortal.tsx      Composes the customer experience
    hooks/                  Customer session, data and payment handlers
    components/             Login, loading and account summary
    tabs/                   Overview, instalments and receipts
    schemes/                Scheme-specific explanations
    payments/               Online and manual payment dialogs
    types.ts                Customer, account, instalment and receipt contracts
  checkout/
    Checkout.tsx            Checkout composition
    hooks/                  Payment-link loading and Razorpay verification
    components/             Loading, error and successful-payment screens
    types.ts                Payment-link response contract
lib/
  api.ts                    Workspace API client with credentials/idempotency
  format.ts                 Integer-paise conversion and India-local date helpers
  types.ts                  Shared legacy record type
styles/                     Base, workspace, auth/messaging and responsive CSS
public/                     Brand images
```

Routes are deliberately small. Add screen markup to its feature's views or
components, form fields to `workspace/forms`, and request/state logic to hooks
or actions. Shared UI should remain independent of feature hooks. Components
use typed props; view prop types derive from their feature model without runtime
imports of those hooks.

`app/globals.css` imports the styles in their original cascade order. Keep
responsive overrides last. Existing inline styles remain with their components.

All existing URLs and API contracts are retained. `next.config.ts` proxies
`/api/*` to `API_INTERNAL_URL`. Workspace writes keep the same idempotency key
and `devi_pending` session-storage recovery until the server confirms them.
Customer authentication and checkout keep their existing request flows.

The existing flexible `Row` response type is retained; this refactor does not
claim to add runtime API validation or change backend/payment behavior.

### Formatting

```bash
npm run format
npm run format:check
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set `API_INTERNAL_URL` to your running backend instance (e.g. `http://127.0.0.1:4102`).

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building for Production

```bash
# Typecheck
npm run typecheck

# Production build
npm run build

# Start production server
npm run start
```

---

## Git Setup

To push this standalone repository to your remote Git hosting service (e.g. GitHub):

```bash
git remote add origin https://github.com/<your-org>/devi_frontend.git
git branch -M main
git push -u origin main
```
