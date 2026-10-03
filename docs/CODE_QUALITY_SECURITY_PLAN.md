# Code quality and security refactor

From the architecture review of 2026-10-04 (candidates 1 to 3). Branch
`refactor/code-quality-security`. Each step is its own commit.

## Steps

1. [x] **Public read seam.** One server module for every public GET route
   (`src/app/api/_lib/public-route.ts`) and one client module that builds the
   React Query hooks (`src/api/public-query.ts`).
   - Error policy lives in one place: failures are logged on the server and the
     visitor gets a fixed message. Today deities, timelines and the coin list
     return the raw database `error.message` in production.
   - The coin detail route checks the id (`parseInt` with no NaN check today).
   - `/api/historical-figures` has no caller: delete it.
   - `/api/artifacts` returned a bare array while every other route returns
     `{ success, data }`: it joins the envelope.
2. [x] **Delete the admin-era surface of the coin read path.** `useSpecificCoinData`
   returns only what `CoinDetailPage` reads (`coin`, `isLoading`, `error`) and
   stops fetching deities and timelines. Drop `useDeityOptions` if nothing else
   uses it, and the inert `show-hidden-coins` flag and `showHidden` param.
3. [ ] **One pin appearance module.** `pinFor(kind)` in the map folder owns fill,
   border and popup colour for every kind of pin, in the sunset palette. The
   call sites in `CoinDeepDive.tsx` and `TimelineWithMap.tsx` name a kind.

## Left for later

- Split `Map.tsx` (marker layer module, one timeline map adapter). Needs map
  tests first.
- Pull the coin's map data out of `CoinDeepDive.tsx`, after step 3.
- Not in the architecture review: security headers and CSP, a dependency audit,
  `dangerouslySetInnerHTML` in the map marker HTML (all inputs go through
  `escapeHtml` today).
