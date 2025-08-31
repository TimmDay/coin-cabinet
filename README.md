# TODO Coin Cabinet

The goal of this app is to provide a visual interactive website to view (images of) coins and explore information about them. There will also be a store page where certain items can be offered for sale.

- [x] swap out prisma for drizzle.
- [ ] get a hello world deploying to vercel.
- [ ] get three routes working, with demo pages with a title for now.
  - About
  - Cabinet
  - Store
- [ ] get Storybook configured.
  - Set up a demo Button component in it.
  - Be able to run it locally
- [ ] set up tailwind with theme.
- [ ] work out how responsive / breakpoints is going to work.
- [ ] Set up Cloudinary with acouple of demo images. Just plonk them on the About page for now.
- [ ] Set up Supabase and the postgres db. Seed data for three Severan coins.
- [ ] Work on the 'Severan Dynasty' drawer layout component

## Stack

Bootstrapped with [create-t3-app](https://create.t3.gg/).

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- Cloudinary for image storage, optimisation and CDN. (optional upgrade toCloudflare R2 and custom pipeline later).
- Supabase for Postgres db
- Supabase for auth
- [Drizzle](https://orm.drizzle.team)
- Storybook for com-onent management
- Vitest + Storybook for testing

Use this?

- [tRPC](https://trpc.io)

## CI/CD + Deployment

vercel for deployment

## Learn More

`
To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
