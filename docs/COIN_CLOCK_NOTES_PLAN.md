# Coin clock notes plan

Goal: short notes anchored to a point on a coin face, shown as small circular
info buttons around the coin image at clock positions 1 to 12. A button opens
a tooltip with the note. They stay muted (blueprint feel, night theme) so the
coin keeps the focus.

## Decisions so far

- Each face has its own 12 positions: obverse and reverse are separate.
- Notes live in a child table, not 12 columns on `item_presentation`. This
  replaces the earlier idea of `flavour_o_1` ... `flavour_r_12` (24 nullable
  columns). A table lets us add fields later without touching
  `item_presentation`.
- `flavour_obv` and `flavour_rev` stay as they are for now.
- A note has a body, plus an optional title, `icon_type` and link.
- A note can also link to a device (`device_id`, optional). Devices are shared
  across coins, so a linked note can draw its title, description and image
  from the `devices` row instead of repeating them on every coin. Fields
  written on the note itself override the device's.
- Coins with no notes show nothing: no empty circles.
- Ingestion (`somnus-data-ingestion`) gets a widget: pick obverse or reverse,
  pick a clock position, write the note, save. `coin-cabinet` stays read-only.
- Mobile: the image-switch buttons move under the legend, as on desktop, which
  frees the coin edge for the clock buttons.
- Tooltip: hover and focus on desktop, tap to open and tap outside to close on
  touch, keyboard reachable.

## Schema (proposed, lives in `~/Documents/docs`)

Keyed off `item_presentation`, like `supporting_images`.

```sql
CREATE TABLE item_presentation_notes (
  id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  presentation_id INTEGER NOT NULL REFERENCES item_presentation(id) ON DELETE CASCADE,
  side            TEXT NOT NULL CHECK (side IN ('obverse', 'reverse')),
  clock_position  SMALLINT NOT NULL CHECK (clock_position BETWEEN 1 AND 12),
  title           TEXT,
  body            TEXT,
  device_id       INTEGER REFERENCES devices(id) ON DELETE RESTRICT,
  icon_type       TEXT,
  link_url        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (presentation_id, side, clock_position),
  CHECK (body IS NOT NULL OR device_id IS NOT NULL)
);
CREATE INDEX idx_item_presentation_notes_device_id
  ON item_presentation_notes(device_id);
```

Plus the `updated_at` trigger and RLS in the same shape as
`supporting_images` (owner full access, anon read when the presentation is not
hidden). The migration is a `.sql` file handed to the owner to run, wrapped in
a transaction. `db:types` then regenerates `database.types.ts`.

A note needs a body or a device, so a pure device note is valid. When both
are set, the body shows first and the device supplies the rest (name as the
default title, description, image).

Open:
- Must a linked device be one the coin already depicts (a row in
  `coin_devices` for that coin)? Enforcing it needs a trigger. Without it,
  ingestion just offers the coin's devices first.
- `ON DELETE RESTRICT` blocks deleting a device that notes still use.
  `SET NULL` would break the body-or-device check for a pure device note.
- One note per position (the unique constraint above) or several? One is
  simpler to enter and to lay out.

## Steps

Each step is its own commit.

1. [ ] Plan (this file).
2. [ ] Demo: `CoinClockTips` around the coin image in `CoinRow`, hardcoded
   notes at 2, 4, 9 and 10 o'clock. Circles the size of the image-switch
   buttons, muted `moonlight` border, no fill, dashed for the blueprint look.
   Temporary: delete once real data exists.
3. [ ] Mobile: move the image-switch buttons under the legend at all widths.
4. [ ] Tooltip behaviour: hover, focus, tap, Escape, outside click, and an
   accessible name and description per button.
5. [ ] Schema migration and docs update (owner runs the SQL).
6. [ ] Read path: query the notes with the coin, add them to `CoinEnhanced`,
   pass them to `CoinRow`, delete the demo data.
7. [ ] Icons in the circles (`icon_type`), later.
8. [ ] Ingestion widget in `somnus-data-ingestion`.
