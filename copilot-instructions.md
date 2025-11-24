# Copilot Instructions

Project context (read first)

Assume that developers are working on macs.

Framework/Hosting: Next.js (App Router) on Vercel (Node runtime for server code & webhooks).

Styling: Tailwind CSS. Allow targeted CSS Modules for complex layouts (e.g., gallery).

Components/Docs: Storybook.

Testing: Vitest (unit), consider Playwright (e2e) later.

DB & Auth: Supabase (Postgres + Auth + RLS). Use TypeScript types for database schema.

Payments: Stripe Checkout + Customer Portal (+ Stripe Tax). Webhooks on Node runtime.

Images: Cloudinary for storage + CDN + transforms. Use a Next.js custom loader or direct URLs.

## General coding style

TypeScript: strict mode; prefer explicit types on public functions.
When defining a type, use the type syntax and not the interface syntax.

**CRITICAL**: Always use nullish coalescing (`??`) over logical OR (`||`) for null/undefined handling:

- ✅ `value ?? fallback`
- ❌ `value || fallback`
- Prevents false-y values (0, "", false) from triggering fallbacks
- Essential for TypeScript compilation and runtime safety

Folder structure (App Router):

/app
/(public) ...
/(account) ...
/api/stripe/webhook/route.ts // Node runtime
/components
/lib // db, auth, stripe, cloudinary, utils
/styles // CSS modules / global.css with Tailwind base
/tests

ESLint/Prettier: obey defaults; no any unless justified with a comment.

Prefer server components; switch to client only for interactive UI.

Use Zod (or TS types) for input validation at route boundaries and server actions.

### Next.js runtime rules

Database and Stripe calls must run on Node runtime (not Edge).
Add export const runtime = 'nodejs' in routes that talk to DB/Stripe.

Use Server Actions (Node) for mutations; avoid exposing secrets in client.

### Data layer (Supabase)

Use Supabase client for database operations. Define TypeScript types in /src/types/database.ts.

Migrations: use Supabase dashboard or SQL migrations; keep them readable and idempotent.

Never write to Supabase auth.\* tables; only reference auth.users by UUID.

Use Supabase client queries with proper RLS policies for security.

Example TypeScript types and query:

// src/types/database.ts
export type Product = {
id: string
title: string
price: number
created_at: string
}

// lib/queries/products.ts
import { createClient } from '@supabase/supabase-js'
export async function listProducts(limit = 20): Promise<Product[]> {
const { data } = await supabase.from('products').select('\*').limit(limit)
return data ?? []
}

Auth & RLS

Use Supabase auth helpers for SSR session access in server components.

Enable Row Level Security on app tables. Write policies early; keep them minimal.

Access control happens in the DB via RLS, plus app-level checks.

Example policy intent (describe in code comments):

-- orders: users can read/write their own rows
-- USING / WITH CHECK clauses compare auth.uid() to orders.user_id

Stripe (Checkout + Webhooks)

Use hosted Checkout; do not build custom card forms.

Store Stripe price_id/product_id in DB or fetch from Stripe on the server.

Webhook route at /api/stripe/webhook (Node runtime). Verify signature. Make handlers idempotent.

Webhook skeleton:

// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';
export async function POST(req: Request) {
// 1) Read raw body 2) Verify signature 3) Switch on event.type
// 4) Upsert order/payment status in DB 5) Return 200 quickly
}

### Cloudinary (images & gallery)

Generate URLs with f_auto,q_auto, set width (w) and DPR; let Cloudinary handle formats.

For Next.js <Image>, prefer a custom loader over next/image default optimizer.

Cloudinary loader:

// lib/cloudinaryLoader.ts
export default function cloudinaryLoader({ src, width, quality }: {src:string;width:number;quality?:number}) {
const q = quality ?? 75;
return `https://res.cloudinary.com/<cloud_name>/image/upload/f_auto,q_${q},w_${width}/${src}`;
}

Usage:
// next.config.js
module.exports = {
images: { loader: 'custom' },
};

// component
import Image from 'next/image';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
<Image loader={cloudinaryLoader} src="v123/my-folder/img.jpg" alt="..." width={800} height={600} />

Define 3 variants (thumb, standard, zoom) as constants to keep URLs consistent.

Cache aggressively at the edge; rely on Cloudinary CDN. Avoid generating dozens of unique transforms per image.

### Tailwind + custom CSS

Default to Tailwind utilities.

For complex layouts (gallery), use CSS Modules in /styles or @layer components additions.

Keep custom class names semantic; co-locate module files with components when helpful.

### Testing

Vitest for units (components, lib functions) with JSDOM where needed.

Mock external services (Stripe, Supabase, Cloudinary) via lightweight adapters in lib/.

If adding e2e, prefer Playwright; run happy-path checkout with Stripe test mode.

### Error handling & observability

Surface user-friendly errors; log details on the server only.

Use Vercel logs for route diagnostics; add minimal request IDs on webhook processing.

Wrap external calls (Stripe/Supabase/Cloudinary) with retry-safe patterns.

### Environment variables

Define in Vercel dashboard; never commit secrets.

Centralize access in lib/env.ts with schema validation (e.g., Zod) and fail fast on missing vars.

### Security

Assume all server actions are public entry points—validate inputs.

Keep CSP strict where possible (fonts/images from known hosts).

Do not echo Stripe errors or secrets to clients.

### Git & CI

- Commit messages: feat:, fix:, chore:, test:, docs:.
- Block merges if type checks/tests fail.
- Run Supabase migrations in CI before deploy; ensure idempotency.

### Things Copilot should avoid

- Generating Drizzle/Prisma code or Edge-only DB access.
- Touching Supabase auth tables or bypassing RLS.
- Client-side Stripe card collection (use Checkout).
- Ad-hoc image transforms scattered across components (use the helper).
- If a suggested completion conflicts with any rule above, prefer these instructions.

## Syntax Preferences

- Use `type` instead of `interface` for defining types.
- Use explicit return types on all functions
- Use `const` and `let` instead of `var`
- Use `function` keyword for function declarations instead of arrow functions
