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
- Coins with no notes show nothing: no empty circles, and no reserved room above
  or below the coin (see step 11).
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
   at 12, 2, 4, 6, 9 and 10 o'clock. Since deleted (step 7).
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
7. [x] Demo deleted (`demoClockNotes` and its development fallback). Checked on
   the first real notes (Aurelian reverse): popovers, a long body, no clipping.
8. [ ] Icons in the circles (`iconType`). Needs the set of icons decided first
   (see `icon_type` in `IMPLEMENTATION_TODOS.md`).
9. [ ] Show a linked entry's image in the popover (device `image_url`, artifact
   `image_url`). Not fetched yet.
10. [x] Ingestion widget built in `somnus-data-ingestion` on branch
    `feat/clock-notes-form` (branched from `refactor/codebase-cleanup`, which it
    depends on for the shared child-row hooks). A "Clock Notes" section under
    Images: side, position, type, then own text or a linked-entry picker.
    Tested with component tests only. Not yet tried in the real app behind the
    login, and not merged.
11. [x] Room above and below the coin is reserved only when a clock button
    hangs there (11, 12 or 1 o'clock for the top, 5, 6 or 7 for the bottom).
    The choice is made across both faces together, so the two coins and their
    legends stay level on desktop. Room at the sides is still always kept.

## Next steps, in order

1. Enter more real notes, including ones that link a device, deity, place,
   person, mint or artifact, and one with a link, to check those on the page.
2. Decide `icon_type` (CHECK list or lookup table), then icons (step 8).
3. Linked-entry images (step 9).
4. Then the earlier open items outside this feature: the deep-dive retint of
   the remaining raw palette classes (slate, purple, amber, emerald) and the
   four `dark:` variants, from `docs/SITE_THEME_PLAN.md`.

Also done around the same work: the translation behind a small `TipIcon` at the
end of each legend, and the description behind a large `TipIcon` in the swap row.
