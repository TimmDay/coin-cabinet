## TODO

The goal of this app is to provide a visual interactive website to view (images of) coins and explore information about them. There will also be a store page where certain items can be offered for sale.

### database

- [x] design schema for coin details
- [x] RLS policy on db. Only auth users can add (INSERT) to coin_collection table.
- [ ] setup dev and prod DBs. default it points to dev. I have to manually put in the prod details to use that one.
- [ ] Mint name dropdown
- [ ] Another table. Mint names with the associated lat/lng of each mint
- [ ] flavour_text field
- [ ] image_zoom_o and image_zoom_r fields (for zoom photography links)
- [ ] fields for antiquities_register, with expectation that the text should be like uid (country code). ie qwert234 (UK)
- get rid of the image "both" field. instead the app layout can use the o and r to make it with two requests
- [ ] image_rotation field. An array of image links suffixed by the rotation. research what the degree should be

### images

- [ ] collect all the coin images I have into a folder. Back it up in gdrive.
- [ ] Upload any decent coin photos (suffixed with -o, -r, -zoom_o, -zoom_r and with appropriate quality).
- [ ] Learn how to bulk remove the background (transparent) of coin images on bulk upload to cloudinary...
- [ ] then download them all and backup to gdrive

### photography

- [ ] Learn about how to take good quality macro coin photos.
- [ ] set up something basic for my phone. including lighting.

### auth

- [ ] Config: Supabase auth
- [ ] what is drizzle and how should I use it?

### components

- [ ] Explore UI component libraries. Pick one.
- [ ] config Storybook.
  - Set up a demo Button component in it.
  - Be able to run it locally
- [ ] add storybook v9 (when released). current version has compatibility issues with nextjs and react 19.
- [ ] Coin Card detail
  - the coin image o + r
  - minimal summary info (user focus to the image)
  - expanded info, inc flavour text, dims, expanded legends, comparison sketches
  - expanded map showing the Mint and nearest cities
- [ ] create up style up the breadcrumb component

### site styles

- [ ] config tailwind + site theme.
- [ ] style up the default page titles
- [ ] style up the header and menus
- [ ] include dummy site logo image
- [ ] style up the menus
- [ ] work out how responsive / breakpoints is going to work.
- [ ] work out decent mobile design

### features product

- [ ] create a beautiful site logo/image
- [ ] a map of the roman empire area
  - [ ] with a layer with province boundaries at Severan time (can make other layers for other times later)
  - [ ] lat/lngs from Mints table can cause pins to show on the map in the right place
- [ ] Sets Display pages. Set list, but main feature is a 'wooden' drawer with the coin images laid out as they would be in real life
  - [ ] Work on the 'Severan Dynasty' drawer layout component

### features inf

- hook up specific menus to filtered db requests
- [ ] i18n. Make a system for translating everything to German to start (French/Spanish/Portuguese).
- [ ] Analytics.
- [ ] Ratelimiting.
- [ ] performance audit.

### coin sketches

- [ ] look into technique for making sketches like Classical Numismatics channel makes (tracing matching RIC plates on an ipad or whatever). Make these into vector images with transparent backgrounds.

### tidying up

- [ ] replace radix imports with local code
- [ ] replace lucide icons with local svgs
- [ ] a11y audit (nav dropdowns and accordions esp). Bring in a component library. Storybook tests.
- [ ] is twMerge(clsx...) really necessary?
- [ ] fix cloudinary to not point to work email

- [ ] Admin page
  - upload locked behind auth
  - I can upload a photo
  - fill in a form of info for that coin
  - drag and drop customisable drawer builder

### blog page

articles, guides

- [ ] first write a post
- [ ] make the page showing all posts
- [ ] do up a posts db etc
- [ ] make a page for individual posts
- [ ] posts can have interactive react components in them (i.e a map, a rotatable coin image)
  - year in coins
    - page/article by year. a grid of thumbnails
      - click for card (card contains link to coin page with that coin highlighted)
  - sets
  - Of Provenance

- [ ] Coin Cabinet page MOBILE
  - instead of dropdown menus, accordions.

### About page

- [ ] state stance on ads
- [ ] state stance on AI
- [ ] link to Services page.

- [ ] Map page
- mapbox. coins in collection displayed at mint. circle over mint in size proportional to number of coins in collection are from there.
- [ ] full set of filters

- [ ] future: users can signup/signin in order to create their own coin collection (table) and upload exclusively to that one (and view it)

## Stack

Bootstrapped with [create-t3-app](https://create.t3.gg/).

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- Cloudinary for image storage, optimisation and CDN. (optional upgrade toCloudflare R2 and custom pipeline later).
  - https://console.cloudinary.com/
- [Supabase](https://supabase.com) for Postgres db
  - https://supabase.com/dashboard
  - `pnpm install @supabase/supabase-js
- Supabase for auth
- [Drizzle](https://orm.drizzle.team)
- Storybook for component management
- Vitest + Storybook for testing
- Shadcn / radix UI for fast component prototyping.

Use this?

- [tRPC](https://trpc.io)

## CI/CD + Deployment

[vercel](https://vercel.com/timmdays-projects/coin-cabinet/deployments) for deployment

## Learn More

`
To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
