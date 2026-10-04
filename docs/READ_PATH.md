# Public read path

How the site reads the collection. The site is read-only and anonymous: it
never writes, and it never holds a service key. All writes happen in the
data-maintenance app (`somnus-data-ingestion`).

The schema itself (`schema.sql`, `rls.sql`, `views.sql`, `SCHEMAS.md`) is kept
with that app. This document covers only what the site does with it.

## The path

```
React hook (src/api/*.ts, createPublicQuery)
  → GET /api/<name>  (src/app/api/<name>/route.ts, publicRoute)
    → query module (src/database/queries/<name>.ts)
      → Supabase, anon key, row level security
```

- **Hooks** (`src/api/public-query.ts`): `createPublicQuery` builds one React
  Query hook per list route, and `fetchPublic` unwraps the `{ success, data }`
  envelope. A failure throws a `PublicFetchError` carrying the HTTP status, so a
  caller can tell a 404 from an outage. The hook modules are client modules
  because they build their hooks at import.
- **Routes** (`src/app/api/_lib/public-route.ts`): `publicRoute(label, load,
  { cache })` is every route's whole body. It makes the Supabase client, runs the
  loader, and answers `{ success, data }`.
  - A loader that returns `data: null` answers 404.
  - A `PublicRouteError` thrown by a loader (a bad id) answers with its own
    status and message.
  - Any other failure is logged on the server and answered with a fixed
    `Failed to load <label>` message. The database error is never sent to the
    visitor. Outside production the cause is attached as `error` for debugging.
  - `cache: true` adds `Cache-Control: public, max-age=300,
    stale-while-revalidate=86400` and a CDN header for a day. The coin list,
    deities and timelines use it.
- **Queries** (`src/database/queries/*.ts`): each returns a `QueryResult<T>`,
  either `{ data, error: null }` or `{ data: null, error }`.
- **Coin ids:** `/api/somnus-collection/[id]` accepts only plain positive
  integers (up to ten digits). Anything else is a 400 without touching the
  database.

## Why targeted queries, not one nested select

Each route runs a few small filtered queries (`item_id=in.(...)`) and stitches
the rows together in the query module. There is no Postgres function. PostgREST
cannot follow foreign keys out of a view (`public_items` has no key metadata),
and `collection` itself has no anon grant, so a nested `select=*,coin_images(*)`
is not reachable from either end.

Every route keeps the response shape and TypeScript type the components already
use (`SomnusCollection`, `CoinEnhanced`, `Mint`, `Place`, `Device`, `Deity`,
`Timeline`, `Artifact`). The query module reshapes the normalised rows into
them, so components never see the table layout.

## Field mapping by route

### `/api/places` from `places`
`place_type` becomes `kind`.

### `/api/mints` from `mints`, `places`, `mint_operation_periods`
A mint has no name or coordinates of its own: `name`, `lat` and `lng` come from
its place. `mint_operation_periods` rows become the `[start, end,
authority_label][]` tuples that `MintDeepDiveCard` reads. The mint's own
`image_url`, `image_alt_text` and `image_credit` are the picture on its card, with
the credit as its caption. A mint whose place is missing is left out.

### `/api/devices` from `devices`
`image_url` becomes `img`. The numeric `id` is sent as a string, because
`CoinDeepDive` and `DescriptionWithDeviceHighlights` compare and key on it as one.

### `/api/deities` from `deities`, `deity_places`, `device_deities`, `devices`
`deity_places` becomes `place_ids`. The names of the devices linked through
`device_deities` fill the card footer. `deity_artifacts` becomes `artifact_ids`
(strings, in artifact id order): the artifacts that picture the deity. The open
card shows their images, with each artifact's alt text, caption (`flavour_text`)
and `image_credit`: one image on its own, or a carousel you click through when
there are several. If the `deity_artifacts` read fails
(before its migration is run, say) the deities load without artifacts rather than
failing.

### `/api/timelines` from `timelines`, `timeline_events`, `places`
The `timeline: Event[]` array is rebuilt from the event rows in `sequence`
order: `event_type` becomes `kind` and `flavour_text` becomes `description`. An
event's position is `COALESCE(event.lat, place.lat)`, and likewise for longitude.

### `/api/artifacts` from `artifacts`, `places`
The institution name and coordinates come from the joined place and are
flattened onto the output fields `artifact-helpers.ts` reads. `image_url`
becomes `img_src`, `image_alt_text` becomes `img_alt`, `image_credit` becomes
`img_credit` and `location_note` becomes `location_name`. The numeric `id` is sent as a string.

### `/api/somnus-collection` (list) from `public_items` and its children
`public_items` is the only anon-readable source of `collection` and `coins`
fields. It does not expose `coins.id`, so `coins` is queried separately for the
`item_id` to `coin_id` join key.

- `coin_images` rows with `variant = 'standard'` become `image_link_o` and
  `image_link_r`. The stored `url` is already a bare Cloudinary public id.
- The `is_primary` row of `coin_catalogue_references` becomes `reference` and
  `reference_link`. The browse modal reads it from the list.
- `item_sets` and `sets` become the `sets: string[]` array, and `item_deities`
  becomes `deity_id: string[]`.
- Renames: `nickname` from `brief_description`; `civ` and `civ_specific` from
  `culture_or_period` and `culture_or_period_specific`; `silver_content` from
  `fineness`; `mint_year_earliest` and `mint_year_latest` from `date_earliest`
  and `date_latest`.
- `die_axis` is `` `${coins.rotation}h` `` when `rotation` is set, because the
  grids and cards expect the `"6h"` form.

Hidden and unconfirmed items never reach the site: row level security excludes
them for anon, so there is nothing to filter in code.

### `/api/somnus-collection/[id]` (detail)
The same base row as the list, plus:

- `coin_catalogue_references`, `coin_notable_features` passed through.
- `coin_devices` become `obv_device_ids` and `rev_device_ids` (strings).
- `item_deities` with `deities` become `deities[]`.
- `item_persons` with `persons` become `historical_figures[]`: `title` becomes
  `authority`, `birth_year` and `death_year` become `birth` and `death`, and
  `alt_names` becomes `altNames`.
- `item_timelines` becomes `timelines_id`.
- `supporting_images` with `artifacts` become `flavour_img`.
- Every `coin_images` variant and side, in `sequence` order, becomes
  `image_link_altlight_o/_r`, `image_link_sketch_o/_r`, `image_link_zoom_o/_r`
  and `image_rotation`.
- `item_clock_notes` become `clock_notes`; see "Clock notes" below.
- `public_find_events` becomes `found_event` (below).

## Clock notes

Short notes anchored to a point on a coin face, shown as small circles around the
coin image at clock positions 1 to 12 (12 is straight up). A circle opens a
popover with the note.

- **Data:** table `item_clock_notes`, keyed to `collection.id`: one note per item,
  side (`obverse` or `reverse`) and position. A note has an optional title, body,
  link (URL and label) and at most one link to a device, deity, place, person,
  mint or artifact. It needs a body or a linked entry that supplies one. Row level
  security lets anon read the notes of public items. Notes are written in the
  data-maintenance app, in the item form's "Clock Notes" section.
- **Resolving:** `fetchClockNotes` (`queries/clock-notes.ts`) loads the rows,
  fetches the linked entries (one query per kind in use) and `resolveClockNotes`,
  a pure function with tests, builds the notes. A linked entry gives the title and
  body (a device's description, a deity's `subtitle`, or `flavour_text` for the
  others; a mint is named after its place) and its picture if it has one (`image_url` of a device or an
  artifact), with the artifact's `image_credit` shown under it. Text written on
  the note wins. A note with nothing to show is
  dropped. Notes come back sorted by side then position.
- **Icon:** the circle's icon comes from what the note links to (`linkKind`), drawn
  by `ClockNoteIcon`: a die stamp for a device, sun rays for a deity, a pin for a
  place, a bust for a person, a beaded coin for a mint, a column for an artifact,
  and a small dot for a note of its own. The `icon_type` column is no longer read.
- **On the page:** `CoinClockTips` draws the circles with `TipIcon` (opens on
  hover, focus and tap, closes on leave, blur, Escape or an outside click). Room
  above and below a coin is reserved only when a circle hangs there (11, 12 or 1
  for the top, 5, 6 or 7 for the bottom), decided across both faces together
  (`clockNoteRoom`) so the coins and legends stay level. The popover opens away
  from the coin: title in Cinzel, then the picture, the body and the link. Its
  style is in `THEME.md`.

## What the site cannot read: provenance

`provenance_events` is owner-only: price, vendor, source and auction never reach
an anonymous visitor, so the site shows no provenance chip or footer line.

One narrow exception: the detail route reads `public_find_events`, a view that
exposes only `item_id, event_date, find_lat, find_lng, notes` for events of type
`find`. It powers the "found here" pin on the deep dive map and timeline
(`CoinDeepDive.tsx`, `lib/utils/provenance-helpers.ts`). If the view is missing
or errors, the coin loads without a found event instead of failing.

## Set names

`sets` holds Title Case names (`"Imperial Women"`, `"Gordy Boys"`, ...). The
cabinet pages pass those exact strings to `CoinGrid filterSet="..."`, and the two
special-case sorts in `CoinGrid.tsx` match them.

## Citations

Places, mints, devices, deities, persons, artifacts and timeline events each
carry `citations: Citation[]` (`src/database/schema-citations.ts`): `id`,
`author`, `work_title`, `citation`, `url` and `note`. They come from the
`sources` table through `entity_sources`, one query per route
(`src/database/queries/citations.ts`). `note` is the note on the link
(`entity_sources.applies_to`), so one source can carry a different note on each
thing it is attached to.

`Event.source` still exists as a free-text field for the hand-written timelines
in `src/data`. Nothing on the site displays citations yet.

## Known limitations

- A person's card shows no photo, and a person brings no artifact pins to the map:
  `artifact_ids` has no home in the normalised schema for persons. A deity's
  artifacts (`deity_artifacts`) and a coin's own supporting images (`flavour_img`)
  do get a pin.
- What appears on the site depends on the data: items and sets with
  `is_hidden = TRUE` are invisible, and a set page is empty until its set is
  made visible in the data-maintenance app.
