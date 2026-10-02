# Coin clock notes plan

Goal: short notes anchored to a point on a coin face, shown as small circular
info buttons around the coin image at clock positions 1 to 12. A button opens
a popover with the note. They stay muted (blueprint feel, night theme) so the
coin keeps the focus.

## Decisions

- Each face has its own 12 positions: obverse and reverse are separate.
- Notes live in a child table, `item_clock_notes`, keyed to `collection.id`
  (the source of truth for an item), not 12 columns on `item_presentation`.
- `flavour_obv` and `flavour_rev` stay as they are for now.
- A note has an optional title, a body, an optional link (URL and label) and an
  optional `icon_type` (free text for now, to be revisited).
- A note can link to at most one entry in one of six authority tables
  (devices, deities, places, persons, mints, artifacts). It then draws its
  title, description and image from that entry. Text on the note overrides it.
  A note needs a body or an authority link.
- One note per position per face.
- Coins with no notes show nothing: no empty circles. The layout still reserves
  room for all 12 positions.
- Ingestion (`somnus-data-ingestion`) gets a widget: pick obverse or reverse,
  pick a clock position, write the note or pick the linked entry, save.
  `coin-cabinet` stays read-only.
- Interaction (all tip buttons share `TipIcon`): opens on mouse hover, keyboard
  focus and tap, closes on leave, blur, Escape or an outside click.

## Schema

Source of truth is `~/Documents/docs`: `schema.sql`, `rls.sql`, `SCHEMAS.md`
and the migration `migrate_add_item_clock_notes.sql` (one transaction, run by
the owner, never by an agent).

```sql
CREATE TABLE item_clock_notes (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_id        INTEGER NOT NULL REFERENCES collection(id),
  side           TEXT NOT NULL CHECK (side IN ('obverse', 'reverse')),
  clock_position SMALLINT NOT NULL CHECK (clock_position BETWEEN 1 AND 12),
  title          TEXT,
  body           TEXT,
  link_url       TEXT,
  link_label     TEXT,
  icon_type      TEXT,
  device_id      INTEGER REFERENCES devices(id),
  deity_id       INTEGER REFERENCES deities(id),
  place_id       INTEGER REFERENCES places(id),
  person_id      INTEGER REFERENCES persons(id),
  mint_id        INTEGER REFERENCES mints(id),
  artifact_id    INTEGER REFERENCES artifacts(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (item_id, side, clock_position),
  CHECK (num_nonnulls(device_id, deity_id, place_id, person_id, mint_id, artifact_id) <= 1),
  CHECK (body IS NOT NULL
         OR num_nonnulls(device_id, deity_id, place_id, person_id, mint_id, artifact_id) = 1),
  CHECK (link_label IS NULL OR link_url IS NOT NULL)
);
```

Plus an index on each authority id, the `updated_at` trigger, and RLS like
`media` (owner full access through `owns_item`, anon read through
`item_is_public`).

To revisit: `icon_type` as a `CHECK` list or a lookup table once the icons
settle. Also the public read path (direct anon read or a view). Both are in
`IMPLEMENTATION_TODOS.md`.

## Steps

Each step is its own commit.

1. [x] Plan (this file).
2. [x] Demo: `CoinClockTips` around the coin image, hardcoded notes
   (`DEMO_CLOCK_NOTES`: 12, 2, 4, 6, 9 and 10 o'clock). Temporary.
3. [x] Image-switch buttons moved under the legend at every width.
4. [x] Popover behaviour, shared `TipIcon` (small, medium, large): hover, focus,
   tap, Escape, outside click, accessible name.
5. [x] Migration run, `pnpm db:types` regenerated.
6. [x] Read path: `fetchClockNotes` (`src/database/queries/clock-notes.ts`) loads
   an item's notes, resolves linked entries (device description, or
   `flavour_text` for deities, places, persons, mints, artifacts; a mint is
   named after its place), and `CoinEnhanced.clock_notes` carries them. Text on
   the note wins over the linked entry's. Unit tested. A note with a link shows
   it in the popover.
7. [ ] Delete the demo (`demoClockNotes` in `CoinClockTips.tsx` and its
   development fallback in `CoinDeepDive.tsx`) once real notes exist.
8. [ ] Icons in the circles (`iconType`). Needs the set of icons decided first
   (see `icon_type` in `IMPLEMENTATION_TODOS.md`).
9. [ ] Show a linked entry's image in the popover (device `image_url`, artifact
   `image_url`). Not fetched yet.
10. [ ] Ingestion widget in `somnus-data-ingestion` (a "Clock Notes" form
    section under Images). In progress on its own branch, see that repo.
11. [ ] Only reserve the clock-button room (side padding, space above and below
    the coin) for coins that have notes, if the roomy layout turns out to be
    wanted only where there is something to show. For now it is always reserved.

## Next steps, in order

1. Build the ingestion widget and enter a few real notes.
2. Check the page with real notes: popovers, links, a linked entry with no
   body, a long body.
3. Delete the demo (step 7).
4. Decide `icon_type` (CHECK list or lookup table), then icons (step 8).
5. Linked-entry images (step 9).
6. Then the earlier open items outside this feature: the deep-dive retint of
   the remaining raw palette classes (slate, purple, amber, emerald) and the
   four `dark:` variants, from `docs/SITE_THEME_PLAN.md`.

Also done around the same work: the translation behind a small `TipIcon` at the
end of each legend, and the description behind a large `TipIcon` in the swap row.
