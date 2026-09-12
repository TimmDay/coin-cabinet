# Public read-path migration: old flat schema → new normalized schema

Status: in progress on `refactor/normalized-schema-migration`. Covers only
the non-logged-in read path (see `IMPLEMENTATION_TODOS.md` Roadmap phase 3 in
the `somnus-data-ingestion`/`~/Documents/docs` docs). `/admin`, `/somnus-login`,
and every write route are untouched and left running against the old schema
types — they're slated for deletion once this is confirmed working.

Canonical schema source: `somnus-data-ingestion/docs/SCHEMAS.md` /
`schema.sql` / `rls.sql` / `views.sql` (ahead of `~/Documents/docs` as of this
writing — e.g. `provenance_events.find_lat`/`find_lng`/`buyers_premium_pct`).

## Strategy: adapter layer, not a component rewrite

Every public API route keeps its existing path, response envelope, and
TypeScript type (`SomnusCollection`, `CoinEnhanced`, `Mint`, `Place`,
`Device`, `Deity`, `HistoricalFigure`, `Timeline`, `Artifact`). Only the
route's *implementation* changed: it now runs targeted Supabase queries
against the new normalized tables and reassembles the same JSON shape the
frontend already expects, in `src/database/queries/*.ts`. No component under
`src/components/` needed a schema-aware rewrite.

Query shape decision (the open question in `IMPLEMENTATION_TODOS.md:24`):
**targeted queries per section, stitched in the route handler — no Postgres
RPC.** PostgREST can't traverse FK embeds from a view (`public_items` has no
FK metadata), and `collection` itself has no anon grant at all, so nested
`select=*,coin_images(*)` isn't reachable from either end. Filtered queries
(`item_id=in.(...)` / `coin_id=in.(...)`) are the only anon-reachable path.

## Field mapping by route

### `/api/places` ← `places`
Rename `place_type`→`kind`. Dropped `host_to`/`artifact_ids` (unused by any
consumer — both are the old schema's inverse-relationship duplicates,
superseded by querying `timeline_events`/`item_places` from the other side).

### `/api/mints` ← `mints` join `places`, join `mint_operation_periods`
Mints no longer carry `name`/`lat`/`lng` directly — flattened from the joined
`places` row onto the `Mint` shape. `mint_marks`/`officina_marks`/
`coinage_materials` pass through unchanged. `mint_operation_periods` rows are
reshaped back into the old `[start, end, authority_label][]` tuple array that
`MintDeepDiveCard.tsx` expects.

### `/api/devices` ← `devices`
Rename `historical_sources`→`sources`, `image_url`→`img`. Numeric `id`
stringified (old type was a uuid string; `CoinDeepDive.tsx`/
`DescriptionWithDeviceHighlights.tsx` compare/key on `device.id` as a
string). Dropped `artifact_ids` — not used by any device consumer, no
visible change.

### `/api/deities` ← `deities` join `deity_places`, join `device_deities`+`devices`
`deity_places` → `place_ids`. `device_deities` (device names) replaces the
old `features_coinage` card footer — **confirmed lineage**, not a guess:
`features_coinage` → an intermediate `coinage_attributes TEXT[]` column →
migrated into `device_deities` rows (see `SCHEMAS.md`'s `device_deities`
section and `migrate_data.sql`'s comment trail).

**Known gap**: `deity.artifact_ids` (the illustrative photo on a deity's
DeepDive card) has no new-schema home. `DeepDiveCardsSection`'s deity cards
render without an image — degrades gracefully (component already handles a
missing artifact via `?.`), not fixed here.

### `/api/historical-figures` ← `persons`
Rename `title`→`authority`, `birth_year`→`birth`, `death_year`→`death`,
`alt_names`→`altNames`. Same `artifact_ids` gap as deities, same graceful
degradation.

### `/api/timelines` ← `timelines` join `timeline_events` (by `sequence`), join `places`
Reassembles the `timeline: Event[]` JSONB-shaped array from child rows:
`event_type`→`kind`, `flavour_text`→`description`,
`historical_sources[]`→`source`. Place resolution follows the schema's own
convention: `COALESCE(event.lat, place.lat)`.

### `/api/artifacts` ← `artifacts` join `places`
Old `institution_name`/`lat`/`lng` columns were dropped from the new schema
(superseded by `place_id → places`) — resolved via the join and re-flattened
onto the same output field names, so `artifact-helpers.ts`'s
`getArtifactLocationData` needed zero changes. Rename `image_url`→`img_src`,
`image_alt_text`→`img_alt`, `location_note`→`location_name`. Numeric `id`
stringified.

### `/api/somnus-collection` (list) ← `public_items` + `coins` + `coin_images` + `coin_catalogue_references` + `item_sets`+`sets` + `item_deities`
`public_items` is the only anon-readable source of `collection`+`coins`
fields. It doesn't expose `coins.id` (checked `views.sql`), so `coins` is
queried separately (`select id,item_id` — anon-granted) purely for the
`item_id → coin_id` join key, avoiding any view/SQL change.
`coin_images` filtered to `variant='standard'` → `image_link_o`/
`image_link_r` (verified live: `coin_images.url` already stores bare
Cloudinary public IDs, same as the old `image_link_o`, so this is a direct
passthrough, not a reformat). `coin_catalogue_references`'s `is_primary` row
→ `reference`/`reference_link` — needed here too, not just on the detail
endpoint: `BrowseCoinsModal`'s "browse" click-mode renders it directly off
the list data. `item_sets`→`sets.name` → the `sets: string[]` compatibility
array. `item_deities` → `deity_id: string[]`.

Renames: `nickname`←`brief_description`, `civ`/`civ_specific`←
`culture_or_period`/`culture_or_period_specific`, `fineness`→
`silver_content`, `mint_year_earliest`/`latest`←`date_earliest`/
`date_latest`, **`die_axis`←`` `${coins.rotation}h` `` when `rotation` is
set** (confirmed publicly consumed by `CoinGrid`, `YearCoinGrid`,
`CoinSnapshot`, `DeepDiveCardsSection`, which all expect the old `"6h"`-style
string, not a bare integer).

Dropped: `metal` (folded into `materials`; confirmed only the admin edit
form reads it, no public consumer).

`showHidden`/`includeAll` are now effectively inert for anon visitors — RLS
won't return hidden/unconfirmed rows regardless of the query param. Not
"fixed" with a code branch, just noted here.

### `/api/somnus-collection/[id]` (detail) ← everything above + `coin_catalogue_references` + `coin_notable_features` + `coin_devices` + `item_persons`+`persons` + `item_timelines` + `supporting_images`+`artifacts`
Same base row as the list endpoint, plus: `coin_catalogue_references`'s
`is_primary` row → `reference`/`reference_link`; `coin_notable_features`
passthrough; `coin_devices` → `obv_device_ids`/`rev_device_ids`
(stringified); `item_deities`+`deities` → `deities[]` on `CoinEnhanced`;
`item_persons`+`persons` → `historical_figures[]`; `item_timelines` →
`timelines_id`; `supporting_images`+`artifacts` → `flavour_img`. All
`coin_images` variants/sides reshaped into `image_link_altlight_o/_r`,
`image_link_sketch_o/_r`, `image_link_zoom_o/_r`, `image_rotation` (ordered
by `sequence`).

This route also stopped constructing its own inline Supabase client and now
uses the shared `createClient()` from `supabase-server.ts` (pre-existing
duplication, fixed while the file was being rewritten anyway).

## Dropped from the public site entirely: provenance

The provenance chip (`CoinCardGridItem`) and footer line
(`DeepDiveCardsSection`) are removed. `provenance_events` is deliberately
owner-only in the new RLS design — no anon access at all, ever — which is
the structural fix for the old public API leaking purchase price/vendor data
to visitors (see `IMPLEMENTATION_TODOS.md`'s RLS section). There's no
new-schema field anon can read that stands in for the old free-text
`provenance` blurb, and adding one was out of scope for a read-only retrofit.

**One narrow exception, added later:** `/api/somnus-collection/[id]` also
reads `public_find_events` — a column-allowlisted view (see
`somnus-data-ingestion/docs/migrations/2026-09-11_public_find_events_view.sql`)
exposing only `item_id, event_date, find_lat, find_lng, notes` for
`provenance_events` rows where `event_type = 'find'`. Nothing else on
`provenance_events` (price, vendor, source, auction, acquisition_channel) is
exposed. This deliberately reverses the `findspot_place_id` exclusion
documented in `views.sql`'s `public_items` header — the owner revisited that
call specifically for provenance find-events. Powers the "coin found here"
marker on the deep-dive map/timeline (`CoinDeepDive.tsx`,
`lib/utils/provenance-helpers.ts`). The query in `collection.ts` treats a
missing/erroring view as "no found event" rather than failing the whole
fetch, since the view may not exist yet in a given environment until the
migration above is applied by hand.

## `sets` naming fixed to match the new authority table

The new `sets` table stores Title Case names (`"Imperial Women"`,
`"Gordy Boys"`, `"Adoptive Emperors"`, ... — confirmed via `migrate_data.sql`
`INSERT INTO sets`). The 8 themed cabinet pages' `CoinGrid filterSet="..."`
props were updated to those exact values (they previously used ad-hoc
lowercase/hyphenated strings that didn't match any canonical casing either).
`CoinGrid.tsx`'s two special-case sort branches were updated to match.

## Known limitations, not fixed in this pass

- Deity/historical-figure DeepDive cards no longer show an illustrative
  photo (`artifact_ids` has no new-schema home for these two entity types).
- The live public collection currently shows 36 items (vs. 70 in the old
  flat table) — `is_hidden`/`attribution_status` cleanup for the rest is a
  data-state task for the admin app, not a code change here.
- All 8 themed cabinet pages (`imperial-women`, `gordy-boys`, etc.) currently
  render **empty** — verified live: every row in the new `sets` table still
  has `is_hidden = TRUE` (per `migrate_data.sql`), and `sets`/`item_sets`
  anon RLS policies both gate on that flag. Same category of data-state gap
  as the item-visibility one above, just biting a different table — flip
  `is_hidden` to `false` per set via the admin app once each theme page is
  ready to go live again.
- `/admin`, `/somnus-login`, and all write/mutation hooks (`useAddSomnusCoin`,
  etc.) still reference the old flat schema and will fail at runtime against
  the new DB. Left as-is pending their planned deletion.
