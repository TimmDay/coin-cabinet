# Third-Party Dependencies

This document inventories the third-party packages this project depends on:
what each one is for, why it was chosen, and what we'd reach for instead if
it ever needed to be dropped (unmaintained, security issue, license change,
etc.). It is not a vulnerability-disclosure policy — there's no separate
public-facing part of this app that takes outside reports, so there's
nothing to route.

Versions below reflect `package.json` at the time of writing. Run
`pnpm outdated` for the current picture.

## Framework & runtime

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `next` | ^15.5.25 | App framework — routing, SSR/SSG, API routes. | Remix, plain Vite + React Router. Both would mean rebuilding the API-route and image-optimization layers by hand. |
| `react` / `react-dom` | ^19.3.0 | UI library. | No serious alternative given the Next.js dependency — the two are tied together. |
| `typescript` | ^5.9.3 | Static typing across the app. | None seriously considered; JS-only would remove the type safety this schema-heavy app leans on. |

## Backend / data

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `@supabase/supabase-js` | ^2.116.0 | Postgres client (query builder, RLS-aware auth context) against the Supabase-hosted DB. | Drizzle or Prisma talking directly to the Postgres connection string, bypassing Supabase's client layer — bigger migration, would also mean re-implementing RLS-aware auth context manually. |
| `@supabase/ssr` | ^0.8.0 | Cookie-based Supabase client for Next.js server components/route handlers. | Would need a hand-rolled cookie-forwarding client if dropped. |
| `@supabase/auth-ui-react` | ^0.4.7 | Prebuilt login form UI. | **Currently unused** — no imports found anywhere in `src/`. Left over from before the admin/auth surface was removed; candidate for deletion rather than replacement. |
| `@supabase/auth-ui-shared` | ^0.1.8 | Theming helper for `auth-ui-react`. | Same as above — unused, drop alongside it. |
| `@tanstack/react-query` | ^5.102.8 | Client-side data fetching, caching, and request de-duplication. | SWR is the closest equivalent; would mean rewriting every `useQuery` hook in `src/api/`. |
| `@tanstack/react-query-devtools` | ^5.102.8 | Dev-only devtools panel for React Query. | None needed — trivial to remove if it were ever a burden. |
| `@t3-oss/env-nextjs` | ^0.12.0 | Validates env vars against a Zod schema at build/boot time (`src/env.js`), catching missing config before runtime. | Hand-rolled `zod.parse(process.env)` — this package is a thin, low-risk wrapper around that. |
| `zod` | ^3.25.76 | Schema validation — env vars and (previously) form validation. | Valibot or a hand-written validator; low switching cost since usage is contained. |
| `dotenv` | ^17.4.2 | Loads `.env` files for standalone Node scripts (`scripts/backup.mjs`) that run outside Next.js's own env loading. | Node's built-in `--env-file` flag now covers this natively; could drop the dependency if the minimum Node version guarantees support. |

## UI components & styling

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `@radix-ui/react-navigation-menu` | ^1.2.22 | Accessible, unstyled nav-menu primitive (keyboard nav, focus management) behind the site's dropdown navigation. | Headless UI, Ariakit, or a hand-rolled `<nav>` with manual ARIA — Radix was chosen for its accessibility guarantees out of the box. |
| `@radix-ui/react-slot` | ^1.3.3 | Enables the `asChild` polymorphic-component pattern used by a few UI components. | Manual `React.forwardRef` composition — more boilerplate per component. |
| `class-variance-authority` | ^0.7.1 | Defines Tailwind class variants (size/intent/etc.) for components in a structured, typed way. | Hand-written conditional class strings; cva just keeps that consistent as components grow. |
| `clsx` | ^2.1.1 | Conditionally joins className strings. | `classnames` (near-identical, clsx is the smaller/faster fork). |
| `tailwind-merge` | ^3.6.0 | Resolves conflicting Tailwind utility classes when composing className props (e.g. a caller's `p-4` overriding a component's default `p-2`). | Without it, conflicting classes silently duplicate in the DOM and whichever Tailwind emits last in the stylesheet wins — used everywhere `cn()` is used. |
| `tailwindcss` / `@tailwindcss/postcss` | ^4.3.3 | Utility-first CSS framework and its PostCSS integration. | Vanilla CSS Modules or another utility framework (UnoCSS) — would touch nearly every component file. |
| `postcss` | ^8.5.28 | CSS transform pipeline Tailwind runs on. | Required transitively by Tailwind; not independently replaceable. |
| `lucide-react` | ^0.544.0 | Icon set used across the nav, forms, and cards. | Heroicons or react-icons — icon components are used by name, so swapping is mechanical but touches many files. |

## Forms

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `react-hook-form` | ^7.87.0 | Form state, validation wiring, and submit handling. | Formik — heavier and slower for large forms; RHF was chosen for its uncontrolled-input performance. |
| `@hookform/resolvers` | ^5.9.1 | Adapter that lets `react-hook-form` validate against Zod schemas. | Only needed as long as both RHF and Zod are in use; dropping either drops this too. |

## Maps

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `leaflet` | ^1.9.4 | Core interactive-map rendering library for the `/map` find-locations page. | Mapbox GL JS or Google Maps — both are paid/API-key-gated at scale; Leaflet + OpenStreetMap tiles keeps this free. |
| `react-leaflet` | ^5.0.0 | React bindings/components wrapping Leaflet. | Would need to drop to raw Leaflet + manual DOM refs if this stopped being maintained. |
| `@types/leaflet` | ^1.9.22 | TypeScript definitions for Leaflet (Leaflet itself ships untyped). | N/A — tied to whichever version of Leaflet is installed. |
| `supercluster` | ^8.0.1 | Clusters nearby map markers at low zoom levels for performance/readability. | Hand-rolled grid-based clustering — supercluster is a well-tested, fast implementation of an otherwise fiddly algorithm. |

## Media

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `next-cloudinary` | ^6.19.0 | Next.js image component wired to Cloudinary for coin photo hosting/transforms. | Cloudinary's own generic SDK, or migrating image hosting to `next/image` with a different provider (Vercel, S3 + Sharp) — a real migration since coin photos are the whole cabinet. |

## Testing & dev tooling

| Package | Version | Purpose | Alternatives |
|---|---|---|---|
| `vitest` | ^4.1.11 | Unit/component test runner. | Jest — vitest was chosen for native Vite/ESM speed. |
| `vite` | ^7.3.6 | Bundler vitest runs on. | Required transitively by vitest. |
| `@vitejs/plugin-react` | ^5.2.0 | Enables JSX/Fast Refresh inside vitest's Vite instance. | Tied to vite + vitest. |
| `happy-dom` | ^18.0.1 | Lightweight DOM environment for component tests. | `jsdom` — happy-dom is faster but less spec-complete; would swap if a test needed browser behavior it doesn't emulate. |
| `@testing-library/react` | ^16.3.3 | Renders components in tests and queries them the way a user would. | Enzyme (unmaintained) — React Testing Library is the de facto standard. |
| `@testing-library/jest-dom` | ^6.9.1 | Adds DOM-specific matchers (`toBeInTheDocument`, etc.) to test assertions. | Hand-written assertions against `element.textContent` etc. |
| `@playwright/test` | ^1.63.0 | End-to-end browser testing. | Cypress — Playwright was chosen for multi-browser support and speed. |
| `storybook` / `@storybook/nextjs` | ^9.1.20 | Component development/catalog environment, isolated from the full app. | Ladle or plain ad-hoc dev pages — Storybook gives addon ecosystem (a11y checks, Chromatic) in exchange for heavier tooling. |
| `@storybook/addon-a11y` | ^9.1.20 | Flags accessibility issues on components inside Storybook. | axe-core run standalone in CI instead. |
| `@storybook/addon-onboarding` | ^9.1.20 | First-run Storybook tutorial UI. | Safe to remove — not used once the team is past onboarding. |
| `@chromatic-com/storybook` | ^4.1.3 | Visual regression testing service integration for Storybook. | Percy, or dropping visual regression testing entirely. |
| `eslint-plugin-storybook` | ^9.1.20 | Lint rules specific to `.stories.tsx` files. | Tied to Storybook; drop together. |
| `eslint` | ^9.39.5 | Linter core. | Biome — a newer, faster all-in-one linter/formatter; would replace both eslint and (partially) prettier. |
| `eslint-config-next` | ^16.3.4 | Next.js's recommended ESLint rule set. | Hand-assembled rule config — this exists specifically to avoid that. |
| `@eslint/eslintrc` | ^3.3.7 | Compatibility shim letting flat-config ESLint load any remaining legacy `.eslintrc`-style config/plugins. | Only needed until every plugin in use ships native flat-config support. |
| `typescript-eslint` | ^8.70.0 | TypeScript-aware lint rules. | Required as long as eslint + TypeScript are both in use. |
| `prettier` | ^3.9.6 | Code formatter. | Biome (see eslint entry) — would consolidate two tools into one. |
| `prettier-plugin-tailwindcss` | ^0.6.14 | Sorts Tailwind utility classes into a canonical order on format. | Manual class ordering — error-prone at this project's component count. |
| `tsx` | ^4.23.13 | Runs TypeScript files directly without a separate compile step. | **No script in this repo currently invokes it directly** — likely a transitive need of tooling above, or a leftover from scaffolding. Worth confirming before assuming it's load-bearing. |
| `@types/node` | ^20.19.43 | Node.js type definitions. | Pinned to the Node major version this project targets. |
| `@types/react` / `@types/react-dom` | ^19.3.0 | Type definitions for React. | Tied to whichever React major is installed. |
