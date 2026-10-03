# The map

An interactive map of the Roman world, used on the coin deep dive pages and the
timeline pages. It is MapLibre GL JS through `react-map-gl/maplibre`, styled as
old paper at sunset to sit with the rest of the site (`THEME.md`).

## Files (`src/components/map/`)

| File | Job |
|---|---|
| `Map.tsx` | The map: base style, province and empire layers, mint and custom markers, clusters, popup |
| `MapControls.tsx` | The empire layer and province panel on the `/map` page (behind the `dev` flag); `Map` itself has no controls and is driven by props |
| `TimelineWithMap.tsx` | A timeline's map with its event reader and the timeline strip underneath |
| `mapConfig.ts` | Bounds, province and empire layer styles, the deep dive opening view |
| `mapTheme.ts` | Recolours the vendor base style as old paper |
| `pinStyle.ts` | `pinStyle(kind)`: how every pin looks |
| `mapColors.ts` | Names the colour tokens; `cssColor` and `glColor` read them |
| `mapMarkers.ts` | HTML for pins and cluster bubbles |
| `mapMarkerClustering.ts` | Clustering and spiderfy maths |
| `MintMarkerSvg.tsx` | The highlighted mint marker |
| `hooks/` | `useMapConfiguration` (zoom limits), province selection, map data |

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

- **Provinces:** `public/data/provinces.geojson` (53 features), a `fill` layer
  and a dashed `line` layer in terracotta, with names from
  `provinces_label.geojson` drawn as HTML markers in Cinzel. Names show above
  zoom 4. Every feature carries placeholder `year_start` and `year_end`
  properties spanning the whole period.
- **Empire extents:** five GeoJSON files in `public/data/` (BC 60, AD 14, AD 69,
  AD 117, AD 200), each toggled on its own with its own ink colour
  (`createEmpireLayerConfig`).

Province and extent boundaries are approximate; see the README for where the
data comes from.

## Markers

Markers are HTML (`Marker` from `react-map-gl`), so each can carry its own
colours, icon and popup text. Teardrop pins come from
`createReverseTeardropMarkerHtml`, and all text goes through `escapeHtml`.

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
and re-clustered when a move or zoom ends. A cluster of markers at the same
spot spiderfies: it fans out on click, with legs drawn on a GeoJSON layer.

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

## Tests

Only `pinStyle` and the colour tokens have unit tests. `Map.tsx` and the clustering have none, so check
the map by eye on a deep dive page, a timeline page and a phone after changing
them.
