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
5. [ ] Run the migration (owner), then `pnpm db:types`.
6. [ ] Read path: query the notes with the coin, add them to `CoinEnhanced`,
   pass them to `CoinRow`, delete the demo data. Resolve a linked entry's text,
   image and name from its table.
7. [ ] Icons in the circles (`icon_type`).
8. [ ] Ingestion widget in `somnus-data-ingestion`.

Also done around the same work: the translation behind a small `TipIcon` at the
end of each legend, and the description behind a large `TipIcon` in the swap row.
