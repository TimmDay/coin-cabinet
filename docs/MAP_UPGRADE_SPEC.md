# Map upgrade: Leaflet → MapLibre GL

Branch: `feat/map-upgrade`. Status: decisions locked in (see "Decisions"
near the bottom); ready to implement.

## Problem

### 1. Pan jank on the province overlay (the reported bug)

`Map.tsx` renders Roman provinces as a `react-leaflet` `<GeoJSON>` layer
(`public/data/provinces.geojson`, 881 KB / 53 features / ~15,400 coordinate
pairs — a genuinely large, detailed vector dataset). Leaflet's default
renderer draws vector layers as SVG `<path>` elements positioned via a CSS
transform relative to a "pixel origin" that Leaflet periodically resets
during panning (`viewreset`). When that reset fires, Leaflet fully
recomputes and repaints every SVG path's `d` attribute from scratch. For a
53-feature/15k-point layer this repaint is slow enough to be visible as a
flash — the overlay blanks, then redraws — which is exactly what you're
seeing as "disappear and reload." This is a documented architectural
limitation of Leaflet's SVG renderer for large/complex vector layers, not a
bug in this codebase's code specifically (`preferCanvas` on `MapContainer`
would swap to the canvas renderer and might reduce the flash somewhat, but
canvas rendering trades away per-feature DOM elements/CSS hover states and
is still fundamentally a CPU redraw-on-reset model — it doesn't eliminate
the underlying issue, just changes its shape).

The points (mint markers, coin/found-location markers, clusters) are
`<Marker>` DivIcons re-clustered via `supercluster` on `moveend`/`zoomend`
only (confirmed in `hooks/useMapEvents`'s `ZoomHandler` — not on every
`move` frame during the drag itself), so they're not the primary jank
source, though re-clustering does re-key and remount marker DOM nodes once
per completed pan gesture.

### 2. Bonus find: the basemap is currently broken

`mapConfig.ts`'s `TILE_LAYER_CONFIG` points at
`https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png`. CARTO
retired anonymous/keyless access to this endpoint at some point after this
was wired up — the tiles now render with a diagonal "API KEY REQUIRED"
watermark tiled across the whole map (visible in production right now).
Whatever we land on for the new renderer should also close this out, since
it's a live, visible bug independent of the jank.

### 3. Long-term goal (this ticket, forward-looking)

You want province boundaries that change through time, driven by a year
slider. The current architecture previews the scaling problem already: the
"empire extent" layers (`bc60`/`ad14`/`ad69`/`ad117`/`ad200`, 218 KB–715 KB
each) are five hand-picked, hardcoded eras, each its own GeoJSON file and
its own toggle checkbox. Generalizing that pattern to a continuous slider
by adding more discrete files doesn't scale — you'd need dozens of
snapshot files and dozens of conditionally-rendered `<GeoJSON>` layers, each
suffering the exact SVG-repaint jank described above every time the slider
moved. This is the strongest concrete argument for MapLibre specifically
(beyond fixing the pan jank): its GPU-side `filter`/`feature-state`
expressions let a single already-loaded source be re-filtered by year
instantly, with no network request and no DOM/SVG repaint, which is the
right primitive for a scrubbable slider.

## Proposed direction

Replace the Leaflet rendering engine with **MapLibre GL JS** (WebGL vector
renderer, open-source, no API key required, fork of pre-license-change
Mapbox GL JS). Keep the data model as close to today's as practical for
phase 1 (still plain GeoJSON, not a vector tile pipeline — see "Why not
vector tiles" below), and shape the province data so the future time slider
is additive rather than another rewrite.

### Basemap

Need a vector tile *style* (not just a raster tile URL) to get a MapLibre
style working. Options, roughly cost/effort-ordered:

- **OpenFreeMap** — fully free, no API key, no usage cap, community-run,
  serves ready-made styles (`liberty`, `positron`, `dark`). Closest
  drop-in replacement for "just want a clean muted basemap with no
  billing relationship."
- **Protomaps** — free, self-hostable single-file (PMTiles) basemap;
  more setup (you'd host/serve the `.pmtiles` file yourself, e.g. from
  `public/`) but zero third-party runtime dependency at all.
- **MapTiler** — polished, generous free tier, but is a hosted service
  requiring an account/API key — the same operational shape as the CARTO
  setup that just broke on you.

**Decision: OpenFreeMap.** No API key, no account, no usage cap — closes
out the "basemap provider broke without warning" failure mode entirely
rather than trading CARTO for a different key-gated service.

### Overlay migration

- `provinces.geojson` becomes a MapLibre GeoJSON source with `fill` +
  `line` layers, styled via the style spec's `paint` properties (data-driven
  styling is supported the same way Leaflet's per-feature style function
  works today).
- Province click-to-popup and label rendering carry over conceptually
  (MapLibre has `queryRenderedFeatures` for click handling, and either
  symbol layers or the same DOM-marker approach for labels).
- Mint/coin/found-location markers: MapLibre supports HTML-element
  `Marker`s (same DivIcon-style approach as today), so
  `mapMarkers.ts`/`MintMarkerSvg.tsx`/`MintPin.tsx` mostly carry over.
- Clustering: MapLibre GeoJSON sources have **built-in** clustering
  (`cluster: true`, `clusterRadius`, `clusterMaxZoom`), which — per the
  decision below — we're evaluating as a replacement for the hand-rolled
  `supercluster` + `mapMarkerClustering.ts` in this same branch. The
  custom "spiderfy" (fanning out overlapping points at max cluster zoom)
  is bespoke behavior MapLibre doesn't give you for free, so that piece
  likely stays custom regardless of which clustering engine sits under it
  — the evaluation is about whether `mapMarkerClustering.ts`'s own
  cluster-computation logic (not the spiderfy layer on top) can be
  deleted in favor of the built-in version.

### React integration

**Decision: `react-map-gl/maplibre`** (the `react-map-gl` package's
MapLibre entry point, v8+) — declarative `<Map>`/`<Source>`/`<Layer>`/
`<Marker>` components, closest in shape to what `react-leaflet` gives
today, minimizing the diff for reviewers. Confirmed compatible with
React 19 at v8.

### Time slider (the forward-looking part — some left-field ideas)

- **Data model — building this now (see Decisions):** instead of one
  polygon per province name, model multiple dated snapshots per province —
  `{ province: "Britannia", year_start: 43, year_end: 197, geometry: ...
  }`, `{ province: "Britannia Superior", year_start: 197, year_end: 296,
  geometry: ... }`, etc. — all living in **one** GeoJSON source (or a
  couple, if the file gets unwieldy), not one file per era. For this
  branch, `provinces.geojson` gets `year_start`/`year_end` added to every
  feature's properties with a placeholder full-range value (e.g.
  `year_start: -27, year_end: 400`, spanning the whole period the site
  covers) so every existing feature stays visible under any future filter
  until real dated boundaries replace individual features one at a time —
  no second schema migration needed when that data arrives. Natural
  keyframe years to digitize around when that work starts: Augustus's
  original provincial settlement (27 BCE), the empire's territorial peak
  under Trajan (117 CE), and Diocletian's reforms (293 CE), which roughly
  quadrupled the number of provinces — that reform alone is probably the
  single most visually dramatic "move the slider" moment available.
- **Slider mechanics**: drive a single `map.setFilter('provinces-fill',
  ['all', ['<=', ['get', 'year_start'], sliderYear], ['>', ['get',
  'year_end'], sliderYear]])` call per slider change. No refetch, no
  layer swap, no DOM/SVG repaint — just a GPU-side re-filter of geometry
  that's already resident on the GPU. This is the payoff for doing the
  MapLibre migration now rather than papering over the Leaflet jank.
- **Explicitly reject continuous polygon morphing** between keyframes
  (animating vertices smoothly from one snapshot's shape to the next as
  the slider moves) — it would look cool, but real provincial boundaries
  changed by administrative decree, not by drifting continuously, so
  interpolating between them would visually assert precision the data
  doesn't have. Snapping to the nearest keyframe year (or a "boundaries as
  of Q1 293 CE" style discrete jump) is both simpler to build and more
  historically honest.
- **Data source**: digitizing 5+ eras of provincial boundaries by hand is
  the real cost here, not the code. The **Ancient World Mapping Center**
  (AWMC, UNC Chapel Hill) publishes exactly this — open, citable,
  multi-era Roman provincial boundary shapefiles — and is the standard
  academic source for this kind of historical GIS data. Worth checking
  their downloads before hand-drawing anything. (This repo already
  references Pleiades — `pleiades-places-latest.json` — for place points;
  AWMC is the natural companion source for the polygons, from the same
  academic ecosystem.)
- **UI**: reuse this app's existing year-formatting/BCE-CE conventions
  (`formatYear`/`formatTimelineYear` in `lib/utils/date-formatting.ts`) so
  the slider's year display matches the Timeline component's look
  elsewhere on the site, rather than inventing a new date format.
- **Scale check**: at ~53 features per era and maybe 4-6 eras, this is a
  few hundred features total — comfortably fine as a single plain GeoJSON
  source with client-side filtering. No need for an actual vector tile
  build pipeline (tippecanoe, a tile server, etc.) at this data size; that
  infrastructure only starts paying for itself at a much larger feature
  count than provincial boundaries will ever have.

### Suggested phasing

1. **Phase 1 (this branch):** swap the rendering engine to MapLibre for
   the basemap + province overlay + existing point markers, at rough
   feature parity with today. Fixes the pan jank and the broken CARTO
   tiles. Empire-extent layers and province selection/label toggles carry
   over as-is, just re-implemented against the new engine. Also in scope
   for this branch: evaluate swapping the hand-rolled supercluster
   clustering for MapLibre's built-in clustering (see Decisions), and add
   placeholder `year_start`/`year_end` properties to `provinces.geojson`.
2. **Phase 2 (separate feature, later):** the year-slider itself, once
   real dated-boundary GeoJSON exists — this is a real, separate
   content/data project (sourcing or digitizing multi-era boundaries) as
   much as a code project, and shouldn't block this branch shipping the
   jank fix.

### Risks / things to watch

- `react-map-gl` + React 19 + Next 15 App Router SSR: same
  `dynamic(..., { ssr: false })` pattern used for Leaflet today should
  carry over, but needs verifying against whichever binding approach we
  pick.
- Bundle size: `maplibre-gl` is larger than `leaflet` (WebGL renderer +
  style engine vs a lighter DOM-based library) — worth a quick bundle-size
  gut-check post-migration, though this is a coin-collection hobby site,
  not a page where a few hundred KB is likely to matter.
- `MAP_BOUNDS` (max bounds / min-max zoom), `MAP_STYLES`, and the
  `MapEmbeddedControls`/`MapControls` UI chrome (province checkboxes, era
  toggles, zoom buttons) are mostly engine-agnostic and should port with
  moderate rework, not a rewrite.
- No current automated test coverage of `Map.tsx` internals found (visual
  behavior only) — worth a manual test pass across the coin deep-dive
  page, the historical-figure timeline+map page, and mobile, same as the
  provenance find-event work's verification approach.

## Decisions

1. **Scope**: phase 1 + clustering re-evaluation, both in this branch.
2. **Basemap**: OpenFreeMap.
3. **React binding**: `react-map-gl/maplibre`.
4. **Time-slider prep**: add `year_start`/`year_end` to `provinces.geojson`
   now, placeholder-valued, in this branch.
