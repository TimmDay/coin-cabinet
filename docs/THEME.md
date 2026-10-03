# Site theme

One token layer for colour and type, and a night-and-sunset look across the
site: dusk surfaces, cream text, bronze accents, Cinzel headings, Alegreya body.

## Tokens

`@theme static` in `src/styles/globals.css` is the only place colours and fonts
are defined. `static` keeps every token in the output even when only a
TypeScript string or an inline style uses it (map colours, the Quip icon font),
so TypeScript can read them as `var(--color-*)`.

Tokens are named by **role**, not hue, so a retint is one line.

### Fonts

| Token | Use |
|---|---|
| `font-sans` | Body text: Alegreya, a calligraphic text serif |
| `font-display` | Headings, legends, buttons: Cinzel, Roman inscriptional capitals |
| `font-subtitle` | Page subtitles: Cormorant |

### Colours

| Token | Role |
|---|---|
| `surface` | Page background |
| `surface-raised` | Cards, the nav bar on non-home pages |
| `surface-muted` | Inset areas, scrollbar track |
| `line` | Borders and dividers |
| `ink` | Body text, pale warm cream |
| `ink-muted` | Secondary text |
| `ink-soft` | Warm secondary text for content pages (articles) |
| `subtitle` | Page subtitles and the accent word of page titles |
| `accent` | Older gold accent, to be merged into `bronze` |
| `dusk`, `dusk-edge` | Sunset surfaces and their edge |
| `bronze`, `bronze-light` | Sunset accents |
| `sky-top`, `sky-high`, `sky-mid`, `sky-low`, `sky-glow` | The header sky, deep indigo to copper glow at the horizon |
| `night` | Darkest surface: footer, modals, the timeline event reader |
| `moonlight` | Grey-blue text on night surfaces |
| `moonlight-bright` | Primary text on night surfaces |
| `field`, `field-muted` | Form fields and their muted text |
| `map-label` | Purple for popup titles and map labels outside the pins |

The map has its own palettes, kept next to the code that paints them: `OLD_PAPER`
in `mapTheme.ts` for the base map, `PIN_PALETTE` in `pinStyle.ts` for pins. See
`MAP.md`.

## Where the page is sunset and where it is night

The page gets darker and cooler as you scroll down.

- **Sunset (warm):** the nav bar and homepage header sky, articles, set cards'
  names and cream body text.
- **Night (cool):** filters and the segmented toggles, the footer, modals (the
  browse modal is a proper dialog: it traps focus and restores it on close),
  the timeline event reader, and the popovers over a coin (clock notes, legend
  translations). Text is `moonlight` or `moonlight-bright`, so the coin photo is
  the only warm thing on screen.

### Popovers over a coin

`TipIcon` is the one hover, focus and tap popover: `field` background, `line`
border, `moonlight-bright` text. Clock notes set `text-base`, `text-moonlight`
and `px-7`, and the legend translation matches. The description popover is its
own, tighter.

### Loading

`CoinLoader` (a coin rolling along a line, with a trail) is the loading state for
a coin page. Its keyframes are `--animate-coin-*` in `globals.css`, and it stands
still under reduced motion. Image placeholders are circles, because coins are.

## Rules

- **Never map the old shadcn names** (`bg-card`, `text-foreground`,
  `border-border`) to Tailwind. They are not defined and compile to nothing. Where
  a spot needs a surface, use or add a role token.
- **Custom classes must not beat utilities.** Plain (unlayered) CSS wins over
  Tailwind's layered utilities: a `.body-text { font-size: 1rem }` silently
  overrode `text-xl`. Put component classes in `@layer components`, or better,
  write them as utilities on the element. Never set `font-size`, `color` or
  spacing in unlayered CSS. The layout classes that remain (`.content-wrapper`,
  `.somnus-nav*`) set none of these against a utility.
- **Keep `text-*` colour tokens and font-size tokens apart.** If size tokens are
  added they are `--text-*` and need their own review, because changing
  `--text-sm` resizes every use.
- **Use tokens, not raw palette classes**, in migrated areas. Migrate by role and
  by file, never with a blanket regex: the light panels (the Aside, map controls)
  need different treatment.
- **Shared components own their classes:** one `DesktopNav` serves both headers,
  and `Button` and `IconButton` (with a quiet `ghost` variant) own button
  styling. Class strings stay next to the component, not in a global file.

## Known gaps

- Raw palette classes remain outside the migrated areas: about 150 `slate`,
  `gray`, `stone` or `zinc` classes and about 50 `purple`, `amber`, `emerald`,
  `blue` or `red` ones, mostly in the deep dive, timeline and form controls.
- Four `dark:` variants remain. Tailwind's default `dark` variant follows the OS
  setting, so they do fire.
- The light panels (the Aside, map controls) have no paper surface token and use
  hardcoded greys.
- There is no lint rule against raw palette colours.

## Checking a change

- For a token or CSS change, compile the stylesheet and check the utilities and
  tokens the code uses exist in the output (a small PostCSS script using
  `@tailwindcss/postcss`).
- For changes that should not change the look, compare before and after
  screenshots at 1280px and 390px wide:
  `npx playwright screenshot --viewport-size "1280, 900" <url> <file>`.
