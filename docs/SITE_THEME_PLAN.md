# Site-wide theme plan

Goal: one token layer for colour and type, and a fresh theme for the whole
site based on the homepage redesign (Roman sunset: dusk surfaces, cream text,
bronze accents, Cinzel headings, Alegreya body). Done incrementally, with the
site working and reviewable after every step.

## Where we started

Three overlapping systems:

1. **Working tokens** in `@theme` (`globals.css`): `--font-sans`,
   `--font-display`, and the colours added for the homepage (`heading`,
   `dusk`, `dusk-edge`, `bronze`, `bronze-light`). About 90 uses.
2. **A shadcn-style palette that was never wired up.** `:root` holds bare HSL
   triplets (`--background`, `--card`, `--primary`, ...). They feed `body`
   and some custom classes. They were not mapped into Tailwind, so utilities
   like `bg-card`, `text-foreground`, `border-border` compile to nothing
   (about 40 uses, 16 distinct classes). They only look right by accident.
3. **Raw palette classes in components**: about 476 `slate`/`gray`/`stone`/
   `zinc` and 180 other hues. This is where the cool grey vs cream mismatch
   comes from.

Plus map colours as hex strings in TypeScript (MapLibre needs real colours),
and dead CSS (Leaflet, `.light-mode`, unused button and auth classes).

## Principles

- `@theme static` in `globals.css` is the only place colours and fonts are
  defined. `static` keeps every token in the output even when only a
  TypeScript string or an inline style references it (map colours, the Quip
  icon font).
- Tokens are named by **role**, not hue: `surface`, `ink`, `line`. A retint
  then touches one line.
- Never map the old shadcn names to Tailwind. That would switch on about 40
  dead styles at once with nobody reviewing them. Where a spot really needs a
  surface, give it a role token on purpose.
- Components use tokens, not raw palette classes, once their area is
  migrated. Migrate by role, file by file. Never with a blanket regex: the
  light panels (Aside, map controls) need different treatment.
- Keep `text-*` colour tokens and font-size tokens apart. `text-heading` is a
  colour. Size tokens, when added, are `--text-*` and get their own step,
  because changing `--text-xs` or `--text-sm` resizes every use.

## Role tokens

Values start identical to what they replace, so the foundation step changes
nothing visible. Per-area passes retint them on purpose.

| Token | Role | Starting value |
|---|---|---|
| `surface` | page background | `hsl(220 15% 8%)` |
| `surface-raised` | cards, nav bar (non-home) | `hsl(215 20% 12%)` |
| `surface-muted` | inset areas, scrollbar track | `hsl(215 15% 15%)` |
| `line` | borders and dividers | `hsl(215 15% 22%)` |
| `ink` | body text | `hsl(32 20% 80%)` |
| `ink-muted` | secondary text | `hsl(210 10% 65%)` |
| `accent` | legacy gold accent (`.heading-accent`, `.coin-title`); to merge into `bronze` | `hsl(36 45% 50%)` |
| `map-label` | map labels and popup titles | `hsl(273 46% 33%)` |
| `heading` | headings; an alias of `ink` | `var(--color-ink)` |
| `dusk`, `dusk-edge`, `bronze`, `bronze-light` | Roman sunset surfaces and accents | as in `globals.css` |

Still to design in the map pass: a **paper** surface and ink for the light
panels (Aside box, map controls), instead of hardcoded greys.

## Steps

Each step is its own commit. Steps 1 to 3 change nothing visible.

1. [x] Plan (this file).
2. [ ] Delete dead CSS and dead classes: Leaflet rules, `.light-mode`,
   `.somnus-button*`, the `auth-accent` family (including `RoundButton`'s
   `auth` variant and `PageTitle`'s `authPage` prop), unused helpers, and the
   shadcn utility classes that compile to nothing.
3. [ ] Foundation: role tokens in `@theme static` with the same values,
   repoint every consumer, delete the `:root` triplets.
4. [ ] Per-area visual passes, one at a time, each reviewed by eye: non-home
   nav bar, cards and modals, filters and form controls, articles, map,
   deep dive.
5. [ ] Map colours from one `colors.ts`.
6. [ ] Resolve the 4 `dark:` variants. Tailwind's default `dark` variant
   follows the OS setting, so they do fire. Keep the dark value as the base.
7. [ ] Type-scale tokens (own step, own visual review).
8. [ ] Lint rule against new raw palette colours, only after the migration
   (before it, it would just report about 650 warnings).

## Verification

- Compile the stylesheet and check that the utilities and tokens the code
  uses exist in the output (a small PostCSS script using
  `@tailwindcss/postcss`).
- For the no-visible-change steps, compare compiled values and take
  before-and-after screenshots with the Playwright CLI:
  `npx playwright screenshot --viewport-size "1280, 900" <url> <file>`
  at 1280px and 390px wide.
