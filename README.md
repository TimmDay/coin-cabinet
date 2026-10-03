# Coin Cabinet

A place to display my ancient coin collection, explore macro photography and learn about interesting things.

## Map Data

Thanks to [@johaahlf](https://github.com/johaahlf/dare/blob/master/provinces.geojson?short_path=68e5b67) for the bulk of the province geojson that I have used. He is/was associated with the [Digital Atlas of the Roman Empire](https://imperium.ahlfeldt.se/) (DARE) which was also very useful for point locations.

I have made my own refinements to the map data to include additional provinces (approximate) and border adjustments made by various emperors at different time periods. All of this should be treated as very approximate, and all errors are my own.

My predominant refinement technique was to find a textbook with a picture of the borders I am interested, and then eyeball it, tracing it onto a map and using a tool to generate geojson from that.

Please be careful using this data for anything serious - on this site it is just for fun!

## Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) for the Postgres database. The site is read-only and uses the anon key; all writes go through the separate data-maintenance app (`somnus-data-ingestion`).
- [TanStack Query](https://tanstack.com/query) for client-side caching.
- [MapLibre GL JS](https://maplibre.org) with `react-map-gl` for the map, on [OpenFreeMap](https://openfreemap.org) tiles.
- [Cloudinary](https://console.cloudinary.com/) for image storage, optimisation and CDN. (optional upgrade to Cloudflare R2 and custom pipeline later).
- Vitest for testing.

## Docs

- [`docs/READ_PATH.md`](docs/READ_PATH.md): how the site reads the database, and what it cannot read
- [`docs/MAP.md`](docs/MAP.md): the map
- [`docs/THEME.md`](docs/THEME.md): colour and type tokens, and where the site is sunset and where it is night
- [`docs/TODO_CLOCK_NOTES.md`](docs/TODO_CLOCK_NOTES.md): notes anchored to a point on a coin face (in progress, deleted when finished)
- [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md): code conventions
- [`docs/image_upload_workflow.md`](docs/image_upload_workflow.md): getting photos into Cloudinary

## Caching Strategy

Electing to go with the SSR site from vercel, and then the additional time for a seperate db fetch to the client, where it will be cached. This is a tradeoff of a higher initial load time, but faster mmuch faster site navigation after than (from the cache). The alternative would be to do the db fetching on the server, and send the results with the page load - this would be a (significantly) faster page load due to being able to somewhat co-locate the server and db, but after that navigation will be slower. In addition, the db is somewhat stable so the cache will need to be invalidated infrequently.

## CI/CD + Deployment

[vercel](https://vercel.com/timmdays-projects/coin-cabinet/deployments)

## What data does a coin need recorded to be displayed as "in" the collection?

- all images taken
  - obverse and reverse at minimum- main obv rev images
  - either alt light, or sketch images (or both)
- all physical properties confirmed
- all places recorded
- a timeline
- mint info

## Image file naming guide

Field delimiter is `__` (double underscore). Easy for regex splits.
Use kebab-case inside fields (readable and again easy to split).

`<coinId>__<rootSlug>__<view>__src-<source>.<ext>`
`20250415a__gordian-iii-antoninianus__o__src-tim.jpg`

Where:

- coinId: date of purchase in yyyymmdd format. If multiple similar coins obtained on the same day, name the filename unique by editing the rootslug.
- rootSlug: human readable identifier for the coin. Whatever I want to name it (often emperor-denomination). kebab-case.
- view: one of
  - `o` (obverse),
  - `r` (reverse),
  - `zoom-o` (high quality obverse for zoom function),
  - `zoom-r` (high quality reverse for zoom function),
  - `sketch-o` (line drawing of obverse),
  - `sketch-r` (line drawing of reverse),
  - `rotation-<degree>` (image showing the coin rotated to a certain degree, eg 45, 90, 180)
- `src-<source>`: where the image came from. If it is `src-timmday` it is from Tim and fine to use without credit. When it is src-something else (where something else should be the original vendor who took the photo, not an aggregator like biddr or vcoins) then a photo credit in the UI should be given when displaying the image. Use this vendor name and the date to generate the credit
  (i.e. src-imperial-numismatics, src-the-coin-cabinet etc)

The data-maintenance app (`somnus-data-ingestion`) has a tool that generates a file name from the entered data, which you can copy and paste to rename old files so they match up as you add them to the db.
