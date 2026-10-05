# The map

An interactive map of the Roman world, used on the coin deep dive pages and the
timeline pages. It is MapLibre GL JS through `react-map-gl/maplibre`, styled as
old paper at sunset to sit with the rest of the site (`THEME.md`).

## Files (`src/components/map/`)

| File | Job |
|---|---|
| `Map.tsx` | The map: base style, province and empire layers, mint markers, popup |
| `CustomMarkerLayer.tsx` | Draws a set of markers inside the map: clusters, the fan of a cluster at one spot, the markers |
| `useMarkerClusters.ts` | The layer's logic: clustering for the current view, what a cluster click does, when the fan closes |
| `MapControls.tsx` | The province selection and display panel on the `/map` page (behind the `dev` flag); `Map` itself has no controls and is driven by props |
| `YearSlider.tsx` | The year slider, 200 BC to AD 1453, with Change year ticks and the fit-to-extent button |
| `TierControl.tsx` | Realm / Province / City selector; Tiers with no content at the Selected year are disabled |
| `ProvenanceNote.tsx` | The derived line naming active Sources and admitting what is reconstructed |
| `jurisdictions.ts` | Pure: resolves Jurisdictions, provenance, available Tiers and Change years for a year |
| `TimelineWithMap.tsx` | A timeline's map with its event reader and the timeline strip underneath |
| `mapConfig.ts` | Bounds, overlay and Realm layer styles, label styles, the deep dive opening view |
| `mapTheme.ts` | Recolours the vendor base style as old paper |
| `pinStyle.ts` | `pinStyle(kind)`: how every pin looks |
| `mapColors.ts` | Names the colour tokens; `cssColor` and `glColor` read them |
| `mapMarkers.ts` | HTML for pins and cluster bubbles, and `markerPopup` (what a marker click opens) |
| `mapMarkerClustering.ts` | Clustering and spiderfy maths |
| `MintMarkerSvg.tsx` | The highlighted mint marker |
| `hooks/` | `useMapConfiguration` (zoom limits), `useGeoJsonLayers` (one declarative loader, cached at module scope), `useJurisdictionCorpus` |

## Base map

OpenFreeMap's `dark` style (`MAP_STYLE_URL`): free, no key, no usage cap. Once
it loads, `applyOldPaperTheme` (`mapTheme.ts`) repaints it. The vendor's tiles
and layer ids stay as they are and only the paint changes:

- Land, woods and ice are parchment tones, water is dusky mauve. The colours are
  the `--color-map-*` tokens in `globals.css`.
- Roads, rail, buildings, airports and state borders are hidden, as are modern
  place labels (`hideModernPlaceLabels` in `Map.tsx`). They are wrong for the
  ancient world. Country borders stay, faint.

MapLibre's worker script cannot find its own URL under Next.js bundling, so
`scripts/copy-maplibre-assets.mjs` copies it to `public/` on `postinstall` and
`Map.tsx` points at it with `setWorkerUrl`. Without that, vector and GeoJSON
sources never finish loading.

## Zoom and bounds

- Zoom runs from 3 to 14, default 5 (`useMapConfiguration`).
- `MAP_BOUNDS` is the area the site covers: the Atlantic to Mesopotamia,
  Scotland to the Sahara. Coin locations outside it get no pin
  (`isWithinMapBounds` in `CoinDeepDive.tsx`).
- `MAP_PAN_BOUNDS_LNGLAT` is how far you can drag: `MAP_BOUNDS` plus half its
  width on the west and east, and half its height on the south. Only MapLibre's
  `maxBounds` uses it.
- Deep dive maps open at `DEEP_DIVE_MAP_VIEW`: zoom 3, centred on the heel of
  Italy, which shows most of the empire.
- On desktop (`lg` and up) the map is 520px tall (`MAP_HEIGHT_DESKTOP`), 400px
  elsewhere. On a deep dive page with both coin faces, the map block is as wide
  as the two coins and legends above it.

## Layers

The map draws the administrative geography of one year, the Selected year. The
vocabulary (Jurisdiction, Tier, Span, Change year, Attested, Inferred, Coverage,
Basis year) is defined in `CONTEXT.md`.

- **Jurisdictions:** `public/data/jurisdictions/realms.geojson` and
  `provinces.geojson`, with `sources.json` holding each Source's Coverage,
  licence and known defects. `jurisdictions.ts` resolves what to draw: given the
  corpus, a Selected year and a Tier it returns the Jurisdictions, a provenance
  summary and which Tiers hold anything that year. It also derives the Change
  years the slider ticks.
- **Tiers:** Realm, Province and City. A Tier with nothing in it at the Selected
  year is disabled rather than hidden. The Province Tier is genuinely empty
  across most of the Byzantine range, because no open boundary data exists for
  themes or dioceses.
- **Realm colours:** five `--color-map-realm-*` tokens serve ten Realms, matched
  on the Jurisdiction's slug so a year with fewer Realms never repaints the
  survivors. Realms sharing a token are never on screen together, which
  `jurisdictions.test.ts` asserts for every year. The palette is Okabe-Ito,
  validated against the map's land surface; its colour-blind separation sits in
  the band that is only legal with secondary encoding, so Realm names are drawn
  as a requirement rather than as decoration.
- **Attested and Inferred:** derived by testing the Selected year against each
  Source's Coverage, never stored per feature. Inferred geometry gets a broken
  outline and a lighter fill, in a separate line layer because MapLibre cannot
  vary a dash pattern by data.

Every province outline is one AD 117-ish snapshot reused across every Span, so a
Jurisdiction's existence can be Attested while its shape is not. `basisYear`
records which year the geometry actually depicts.

`scripts/build-jurisdictions.mjs` builds the committed layers from upstream open
data (`pnpm data:jurisdictions`). It is deliberately not part of `prebuild`: the
upstream archives run to tens of megabytes, so they are cached under `.cache/`
and only the simplified output is committed, with the upstream revision recorded
in `sources.json`. `scripts/province-spans.mjs` holds the curated Spans; those
marked `placeholder` are not scholarship and report as Inferred.

## Markers

Markers are HTML (`Marker` from `react-map-gl`), so each can carry its own
colours, icon and popup text. Teardrop pins come from
`createReverseTeardropMarkerHtml`, and all text goes through `escapeHtml`.

Each marker is a focusable `role="button"` (`MarkerButton` in `CustomMarkerLayer`)
labelled with its title, or "Group of N places, zoom in" for a cluster. Enter and
Space click it, and a key press opens the popup at the middle of the marker
(`clickPoint`) instead of at the mouse.

`pinStyle(kind)` is the only place that decides colours. Kinds: `event` (a
timeline event), `minted`, `found`, `deity-place` and `artifact`. A call site
names a kind and spreads the result into the marker. The colours are the
`--color-pin-*` tokens, shared by cluster bubbles, spiderfy lines and mint
markers, so a retint is one edit in `globals.css`.

### Colours

Every map colour is a token in `globals.css`, written as `#rrggbb` because
MapLibre parses colour strings itself and cannot read `var()`. Code that styles
HTML or SVG uses `cssColor(name)` (a `var()` reference). Code that sets a
MapLibre paint property uses `glColor(name)`, which reads the resolved value and
works in the browser only, so it is called when the map renders, not at module
level. `mapColors.test.ts` keeps the names and the CSS in step.

### Clustering

Markers are clustered with a `supercluster` index we own (`mapMarkerClustering.ts`)
and re-clustered when a move or zoom ends. `CustomMarkerLayer` draws the result
and `useMarkerClusters` decides what a click on a cluster does: markers at the
same spot fan out (spiderfy, with legs drawn on a GeoJSON layer), markers spread
apart zoom in on the cluster. The fan closes when the map is clicked or starts to
move, and when the set of markers changes.

The index is keyed on the markers' ids and positions, not on the array. Callers
build a new marker array on every render (their click handlers close over state),
and the fan and the index must survive that, while a click still has to reach the
latest handler.

MapLibre's own GeoJSON source clustering was considered and not used. It
clusters into GL circle and symbol layers, while these markers need per-marker
HTML. Using it would mean reading cluster state back with `getClusterLeaves()`
and mirroring it into React state, which is more code than the present approach.
There are only a few dozen markers per page. Revisit it only if marker counts
grow by an order of magnitude.

## On a timeline page

`TimelineWithMap` shows the map beside a `TimelineInfoBox` (the event reader)
on desktop, with the timeline strip below. On a phone it shows a static preview
that opens the map and reader full screen. Selecting an event, from the strip or
a pin, moves the map to it (`eventZoomLevel`, 6 on deep dives).

## On a deep dive page

A coin's map draws the Jurisdictions of the coin's own earliest minting year
(`selectedYearForCoin`). A coin with no recorded minting year gets no
Jurisdiction layer, matching `createCoinMintingEvent`, which likewise produces
nothing without a year.

`buildCoinMap(coin, reference)` (`ui/coin-deep-dive/coinMap.ts`) answers what the
coin's map shows: a timeline map with its pins, a map of pins (where the coin was
struck, the places and artifacts tied to it, where it was found), or nothing.
`CoinDeepDive` memoises it and renders the answer. Places and artifacts outside
`MAP_BOUNDS` get no pin.

## Tests

`pinStyle`, the colour tokens, `markerPopup`, the clustering and spiderfy maths,
`useMarkerClusters` (with a fake map), `buildCoinMap` and `jurisdictions.ts` have
unit tests. `jurisdictionData.test.ts` asserts the shape of the committed
Jurisdiction layers, including that every Source carries its licence and that
changes were declared. `Map.tsx`
itself and `CustomMarkerLayer` do not, so check the map by eye on a deep dive
page, a timeline page and a phone after changing them. Spiderfy needs markers at
the same coordinates, which no real coin has, so it takes a temporary page to see.
