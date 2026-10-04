# Devi Jewellers — Web Frontend Repository (`devi_frontend`)

Standalone Next.js 16 (Turbopack) web application for Devi Jewellers owner & staff management portal and public customer checkout pages.

---

## Architecture Overview

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Styling**: Tailored lightweight responsive CSS (`app/globals.css`)
- **Icons**: Lucide React
- **API Proxy**: `next.config.ts` automatically proxies `/api/*` to the backend REST service (`API_INTERNAL_URL`).

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
