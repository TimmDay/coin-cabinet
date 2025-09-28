# TODO

- [ ] image file names generator tool (on add coin page, see readme for file name schema).
- [ ] site favicon

## database

- [x] design schema for coin details
- [x] RLS policy on db. Only auth users can add (INSERT) to coin_collection table.
- [ ] setup dev and prod DBs. default it points to dev. I have to manually put in the prod details to use that one.
- [ ] Mint name dropdown in form.
- [ ] Another table. Mint names with the associated lat/lng of each mint
- [x] flavour_text field
- [x] image_zoom_o and image_zoom_r fields (for zoom photography links)
- [x] fields for antiquities_register numbers
- [x] image_rotation field. An array of image links suffixed by the rotation. research what the degree should be

## images

- [ ] collect all the coin images I have into a folder. Back it up in gdrive.
- [ ] Upload any decent coin photos (suffixed with -o, -r, -zoom_o, -zoom_r and with appropriate quality).
- [ ] Learn how to bulk remove the background (transparent) of coin images on bulk upload to cloudinary...
- [ ] then download them all and backup to gdrive
- [ ] optimise cloudinary for perf on the site (ie work out caching)
- [ ] on screens with lots of images, think about lazy loading images when they are X% out of the viewport
- [ ] how to label image files?

## photography

- [ ] Learn about how to take good quality macro coin photos.
- [ ] set up something basic for my phone. including lighting.

## auth

- [ ] Config: review Supabase auth. Is it secure, how can I hide it from normal visitor UI.
- [ ] what is drizzle and how should I use it?
- [ ] consider site functionality going forward. Will a regular visitor ever need to login (ie maintain their own collection?)

## components

- [ ] Explore UI component libraries. Pick one as a reference and put it in copilot-instructions. (shadcn or daisy)

- [ ] add storybook v9 (when released). current version has compatibility issues with nextjs and react 19.
- [ ] config Storybook.
  - Set up a demo Button component in it.
  - Be able to run it locally

- [ ] Coin Card detail
  - the coin images o + r
  - the coin sketches
  - minimal summary info (user focus to the image)
  - expanded info, inc flavour text, dims, expanded legends, comparison sketches
  - expanded map showing the Mint and nearest cities

- [ ] breadcrumb component. create up style it up

- [ ] footer component

- [ ] GridCard component (currently CoinCard). attach click handler, work out how I am going to serve the coin detail screen/card/overlay

- [ ] toggle for collection display grid page -> show obverse/reverse/both/obverse+sketch/reverse+sketch

## site styles

- [ ] config tailwind + site theme.
- [ ] style up the default page titles
- [ ] style up the header and menus
- [ ] include dummy site logo image
- [ ] style up the menus
- [ ] work out how responsive / breakpoints is going to work.
- [ ] work out decent mobile design

## features product

- [ ] site logo - create a beautiful one. Somnus or something related. Maybe Gordy boy?

- [ ] a (free to use) map of the roman empire area. Zoomable, pannable.
  - [ ] with a layer with province boundaries at Severan time (can make other layers for other times later)
  - [ ] lat/lngs from Mints table can cause pins to show on the map in the right place

- [ ] Sets Display pages. Set list, but main feature is a 'wooden' drawer with the coin images laid out as they would be in real life
  - [ ] Work on the 'Severan Dynasty' drawer layout component

## features inf

- hook up specific menus to filtered db requests. Does each thing get it's own page? If not how to manage the breadcrumb?

- [ ] i18n. Make a system for translating everything to German to start (French/Spanish/Portuguese).
- [ ] Analytics.
- [ ] Ratelimiting.
- [ ] performance audit.

Use this?

- [tRPC](https://trpc.io)

## coin sketches

- [ ] look into technique for making sketches like Classical Numismatics channel makes (tracing matching RIC plates on an ipad or whatever). Make these into vector images with transparent backgrounds.

## tidying up

- [ ] replace radix imports with local code
- [ ] replace lucide icons with local svgs
- [ ] a11y audit (nav dropdowns and accordions esp). Bring in a component library. Storybook tests.
- [ ] is twMerge(clsx...) really necessary?
- [ ] fix cloudinary to not point to work email
- [ ] remove references to t3 app (icons links to docs, stuff that could confuse AIs)

- [ ] Admin page
  - upload locked behind auth
  - I can upload a photo
  - fill in a form of info for that coin
  - drag and drop customisable drawer builder

## blog page

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

## About page

- [ ] welcome to site
- [ ] link to Services page.
- [ ] state stance on ads
- [ ] state stance on AI
- [ ] why i love collecting ancients

- [ ] Map page
- mapbox. coins in collection displayed at mint. circle over mint in size proportional to number of coins in collection are from there.
- [ ] full set of filters

- [ ] future: users can signup/signin in order to create their own coin collection (table) and upload exclusively to that one (and view it)?
