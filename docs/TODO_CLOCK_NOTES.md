# Clock notes

In progress: this file is deleted when the item under "Not done yet" is
finished. Until then it also describes the feature.

Short notes anchored to a point on a coin face, shown as small circular buttons
around the coin image at clock positions 1 to 12. A button opens a popover with
the note. They stay muted so the coin keeps the focus.

## What a note is

- Each face has its own 12 positions. A note belongs to one item, one side
  (`obverse` or `reverse`) and one position. There is at most one note per
  position per side.
- A note has an optional title, a body, an optional link (URL and label) and an
  optional `icon_type` (free text, not used yet).
- A note can link to at most one entry in one of six authority tables: devices,
  deities, places, persons, mints, artifacts. It then draws its title and body
  from that entry (a device's description, or `flavour_text` for the others; a
  mint is named after its place), and its picture if the entry has one (a
  device's or an artifact's `image_url`). Text written on the note wins over the
  entry's.
- A note needs a body or a linked entry that supplies one. A note whose linked
  entry is missing or hidden, and with no text of its own, is dropped.
- A coin with no notes shows nothing: no empty circles.

## Data

Table `item_clock_notes`, keyed to `collection.id`, with a unique key on
`(item_id, side, clock_position)` and `CHECK`s for the rules above (clock
position 1 to 12, at most one authority link, a body or a link, a link label only
with a link URL). Row level security matches `media`: the owner has full access
and anon can read the notes of public items. The schema files are kept with the
data-maintenance app (`somnus-data-ingestion`), which is the only place notes are
written: a "Clock Notes" section in the item form (side, position, type, then own
text or a linked-entry picker).

## Read path

`fetchClockNotes` (`src/database/queries/clock-notes.ts`) loads an item's rows,
fetches the linked entries (one query per kind in use) and resolves them with
`resolveClockNotes`, a pure function with unit tests. Notes come back sorted by
side then position, and the detail route returns them as `CoinEnhanced.clock_notes`
(see `READ_PATH.md`).

## On the page

`CoinClockTips` draws the buttons around each coin image, using `TipIcon` (the
site's hover, focus and tap popover: it opens on mouse hover, keyboard focus and
tap, and closes on leave, blur, Escape or an outside click).

- **Room for the buttons:** room above and below a coin is reserved only when a
  button hangs there (11, 12 or 1 o'clock for the top, 5, 6 or 7 for the bottom).
  The choice is made across both faces together (`clockNoteRoom`), so the two
  coins and their legends stay level on desktop. Room at the sides is always
  kept.
- **Popover:** it opens away from the coin (`popoverPlacement` by position), with
  the title in Cinzel, then the linked entry's picture if it has one, then the
  body, then the link if there is one. Style is in
  `THEME.md`.
- **Other small buttons on a coin:** the translation sits behind a small
  `TipIcon` at the end of each legend, the description behind a scroll button in
  the bottom-left corner of the image, and the other images (alt light, sketch) as
  small buttons in the bottom-right corner. While the new image loads, those
  buttons show a spinner and are disabled.

## Not done yet

- `icon_type` is stored and returned but the circles show no icon. The set of
  icons has to be decided first (a `CHECK` list or a lookup table).
