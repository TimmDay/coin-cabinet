# Coin Cabinet

## TODO

The goal of this app is to provide a visual interactive website to view (images of) coins and explore information about them. There will also be a store page where certain items can be offered for sale.

- [ ] Upload a few legit coin photos (suffixed with -b, -o, -r, -hq, and with appropriate quality).
- [ ] Seed data for three Severan coins.
- [ ] Set up a prod and a dev database
- [ ] Learn about ho to take good quality macro coin photos.
- [ ] Learn how to trim the photos such that they have transparent bg around the coin.
- [ ] Config: Supabase auth
- [ ] what is drizzle and how should I use it?
- [ ] design schema for coin details
- [ ] Explore UI component libraries. Pick one.
- [ ] config Storybook.
  - Set up a demo Button component in it.
  - Be able to run it locally
- [ ] config tailwind + site theme.
- [ ] style up the header and menu
- [ ] include dummy site logo image
- [ ] create a beautiful site logo/image
- [ ] style up the menus
- [ ] create up style up the breadcrumb component
- [ ] style up the default page titles
  - work out how responsive / breakpoints is going to work.
- [ ] Work on the 'Severan Dynasty' drawer layout component
- [ ] Analytics.
- [ ] Ratelimiting.

- [ ] replace radix imports with local code
- [ ] replace lucide icons with local svgs
- [ ] a11y audit (nav dropdowns and accordions esp). Bring in a component library. Storybook tests.
- [ ] i18n. Make a system for translating everything to German to start (French/Spanish/Portuguese).
- [ ] is twMerge(clsx...) really necessary?
- [ ] performance audit.
      [ ] add storybook v9 (when released). current version has compatibility issues with nextjs and react 19.
- [ ] fix cloudinary to not point to work email

- [ ] Admin page
  - upload locked behind auth
  - I can upload a photo
  - fill in a form of info for that coin
  - write and upload a blog post, identification guide and reference links
  - drag and drop customisable drawer builder

- [ ] Coin cabinet page DESKTOP
  - dropdown menu with set of pre-selected filters to choose from. Opens on mouse hover

  - year in coins
    - page/article by year. a grid of thumbnails
      - click for card (card contains link to coin page with that coin highlighted)
  - sets
  - Of Provenance

- [ ] Coin Cabinet page MOBILE
  - instead of dropdown menus, accordions.

- [ ] Blog page
  - articles
  - guides

- [ ] Map page
- mapbox. coins in collection displayed at mint. circle over mint in size proportional to number of coins in collection are from there.
- full set of filters

Components

- [ ] breadcrumb
- [ ] coin card

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
