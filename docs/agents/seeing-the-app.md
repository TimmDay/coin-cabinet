# Seeing the app

How to look at a page in a browser, for before and after evidence on UI changes.

## Run it

`pnpm dev` serves http://localhost:3000. Data comes from Supabase through the
anon key in `.env`, so the pages only fill in with that file present.

Screenshot with `node ~/.agents/scripts/screenshot.mjs <url>` from this
directory (see the global instructions for its flags).

## Routes

- `/cabinet/all-coins`: the grid. Each card links to its coin page.
- `/cabinet/<id>-<name>`: the coin deep dive. Any slug starting with digits and
  a hyphen is read as a coin id (`isValidCoinSlug`), so `/cabinet/12-x` opens
  coin 12 if it is published. Take a real id from the grid's links.
- `/map`: the year slider map.

## States a single screenshot misses

Popovers (coin info note, flavour note, clock notes, description notes, device
cards) open on hover or click, and the screenshot script only loads the page.
Drive those with the Playwright MCP tools (`browser_hover`, `browser_click`,
`browser_take_screenshot`), then Read the image.
