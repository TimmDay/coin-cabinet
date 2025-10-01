# Coin Cabinet

A place to display my ancient coin collection, explore macro photography and learn about interesting things.

## Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) for Postgres db AND auth
- [Drizzle](https://orm.drizzle.team)
- [Cloudinary](https://console.cloudinary.com/) for image storage, optimisation and CDN. (optional upgrade toCloudflare R2 and custom pipeline later).
  - https://supabase.com/dashboard
  - `pnpm install @supabase/supabase-js
- Supabase for auth
- Storybook for component management
- Vitest + Storybook for testing
- Shadcn / radix UI for fast component prototyping.

## CI/CD + Deployment

[vercel](https://vercel.com/timmdays-projects/coin-cabinet/deployments)

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

I have made a tool at the base of the add coin page (auth users only), that will generate a file name from the entered data that you can copy/paste to rename old files so they match up as you add them to the db.

## Uploading Images wirh Cloudinary CLI tool

cld config
cld admin usage

upload single file
cld uploader upload ./photo.jpg -o folder test -o tags "via_cli"

### If you need to split an image horizontally into two images

- see script `split-double-images` and do it locally.
