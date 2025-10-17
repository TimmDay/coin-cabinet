# TODO

## Next Thing

- [ ] research expanded latin and translation text for legends.

### Mints Table

- [ ] make a mint db table. It will need mint_name, lat, lng, roman territory, country (modern), notes (historical info), year_open, year_close, second_year_open, second_year_close, secondary_name, list of known operators {name, year range}, founding emperor, reason close, notes. Make a form for adding to it and have this in the admin menu

### Roman Territories Table

- [ ] collect GeoJSON data for every roman province that ever existed, along with dates of existence, fact_check_sources, list of governors with dates (as available)
- [ ] find sources for the above

### MAP Component

- [ ] make a map component using leaflet that can show the roman provinces as layers (with date filtering to show the provinces as they were for the selected year)
- [ ] pins for mints in my collection, sized by number of coins from that mint
- [ ] special pin for the selected coin mint, map centers on it.
- [ ] special pin for find location, for the few coins that have provenance into the ground (ie hoards, metal detector finds).

### UI

- [ ] make an alternative for dropdown menus for mobile
- [ ] Sets master page has link cards that show all the sets (with a title image) and link to the set page. Have a cover image
- [ ] sets pages (focus on severan) have unique layouts and a set ordered list of coins in that set. (like a drawer with recesses for each coin)

CoinDetailPage

- [ ] design it on paper for mobile/desktop
- [ ] title / legends / expanded legends / translation
- [ ] images, with space for sketch side-by-sides
- [ ] space for a map with mint. zoom/pan
- flavor text is displayed
- all images can be blown up in a modal
- image bar? like an in-page nav? sketches | ultra zoom | 3D coin
- [ ] somewhere for supporting or interesting imagery (ie Severan Tondo, Philip I banknote)

- [ ] CoinGrid - work out what filters I want, and how to display them (dropdown)
- [ ] do the filters for mobile as well
- [ ] re-style the header to be skinnier
- [ ] db schema updates. ex_somnus (bool), is_stock (bool).
      OR: set_status (an array) ('severan', 'first_tetrachy', 'second_tetrachy', 'constantinian', 'byzantine', 'ancient_greek', ')

- [ ] pre-fetch the coin card detail when the grid item is hovered for X ms (so it opens instantly when clicked)

- [ ] where can/should we use the semantic html5 elements like <article>, <section>, <nav> etc?

- [ ] Explore UI component libraries. Pick one as a reference and put it in copilot-instructions. (shadcn or daisy)

- [ ] AI STUCK icon alignment. chevrons don't look centered in their circles. maybe pull it out to a common component too. manual attention required.

- [ ] include photo credits in UI (if present in the image id -src). on hover for grid items and explicitly in CoinCardDetail info area.

### database

- [ ] make sure every somnus entry has legend expanded filled in. make it compulsary on the form.
- [ ] setup dev and prod DBs. default it points to dev. I have to manually put in the prod details to use that one.
- [ ] Mint name dropdown in form.
- [ ] Another table. Mint names with the associated lat/lng of each mint.

### images

- [ ] collect all the raw coin images I have into a folder. Back it up in gdrive.
- [ ] also make sure images are trimmed right to the edge (so the edge of coin is edge of image). Will help with aligning web content
- [ ] download all transparent images and backup to gdrive
- [ ] optimise cloudinary for perf on the site (ie work out caching)
- [ ] apply prefetch/lazy loading strategies (tactfully, don't overdo it)
  - [ ] on screens with lots of images, think about lazy loading images when they are X% out of the viewport

### photography

- [ ] research/plan beginner macro photography setup (getting most out of phone that I can).
- [ ] set up something basic for my phone. including lighting.
- [ ] Learn what would be required to take 'ultra zoom' macro photos.

### real world

- [ ] find scale and weigh coins to confirm current data.
- [ ] order coin capsules to bulk up supply.
- [ ] research how I will make coin sketches from plates (ipad?)

### auth

- [ ] Config: review Supabase auth. Is it secure, how can I hide it from normal visitor UI.
- [ ] have sign in using google instead of (in addition to?) user/pass. MFA etc.
- [ ] what is drizzle and how should I use it?
- [ ] consider site functionality going forward. Will a regular visitor ever need to login (ie maintain their own collection?)

## site styles

- [ ] go deep on the color scheme. simplify and clean.
- [ ] work out how responsive / breakpoints is going to work.
- [ ] work out decent mobile design
- [ ] AI STUCK: on add-coin page, make it so the image naming tool position stickies with the top of the form, so it stickies to the top of viewport only if the scroll goes passed that point.

### features product

- [ ] site logo - create a beautiful one. Somnus or something related.
- [ ] site favicon
- [ ] expanded legends - research them and save to the db.
- [ ] expanded info. Flavour text, but also expanded legends and latin translation.

- [ ] a (free to use) map of the roman empire area. Zoomable, pannable.
  - [ ] needs it's own page/route
  - [ ] with a layer with province boundaries at Severan time (can make other layers for other times later)
  - [ ] lat/lngs from Mints table can cause pins to show on the map in the right place

### Set Page(s)

Set list, but main feature is a 'wooden' drawer with the coin images laid out as they would be in real life.

- [ ] work out the css effects. Let's do dark wood grainy look, blue felt and red felt.
- [ ] work on the 'hole' effect, to make it look like a recess for the coin to go in.
- [ ] do the custom layout for Severan. Mindful of breakpoints. Stack on mobile for now, but consider a 'drawer nav' for mobile where you can click on the coin dots to sutoscroll to it.
- [ ] Work on the 'Severan Dynasty' drawer layout component

### features inf

- [ ] consider react context. Maybe need it for view (obv,rev,both), drawer preference (wood,red felt, blue felt), maybe some filters make sense (denomination)?

- [ ] i18n. Make a system for translating everything to German to start (French/Spanish/Portuguese).
- [ ] Analytics.
- [ ] Ratelimiting.
- [ ] performance audit.
- [ ] this useful? [tRPC](https://trpc.io)

### coin sketches

- [ ] look into technique for making sketches like Classical Numismatics channel makes (tracing matching RIC plates on an ipad or whatever). Make these into vector images with transparent backgrounds.

### tidying up

- [ ] replace radix imports with local code
- [ ] replace lucide icons with local svgs
- [ ] a11y audit (nav dropdowns and accordions esp). Bring in a component library. Storybook tests.
- [ ] is twMerge(clsx...) really necessary?
- [ ] fix cloudinary to not point to work email
- [ ] remove references to t3 app (icons links to docs, stuff that could confuse AIs)
- [ ] unneeded console logs
- [ ] unneeded comments

- [ ] Admin page
  - upload locked behind auth
  - I can upload a photo
  - fill in a form of info for that coin
  - drag and drop customisable drawer builder

### blog page

articles, guides

- [ ] first write a post - how roman coins were made.
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

#### components for embedding in blog posts

- [ ] before/after image slider component (for showing coins pre and post cleaning) [example](https://artemis-collection.com/showcase/cleaning-coins/)

- [ ] interactive map component (for showing mint location and significant places)

- [ ] JC 'aside'

### About page

- [ ] welcome to site
- [ ] link to Services page.
- [ ] state stance on ads
- [ ] state stance on AI
- [ ] why i love collecting ancients

### Map page

- mapbox. coins in collection displayed at mint. circle over mint in size proportional to number of coins in collection are from there.
- [ ] full set of filters

- [ ] future: users can signup/signin in order to create their own coin collection (table) and upload exclusively to that one (and view it)?

## DONE

- [x] design a db schema for coin details
- [x] RLS policy on db. Only auth users can add (INSERT) to coin_collection table.
- [x] flavour_text field
- [x] image_zoom_o and image_zoom_r fields (for zoom photography links)
- [x] fields for antiquities_register numbers
- [x] image_rotation field. An array of image links suffixed by the rotation. research what the degree should be
- [x] consider image storage. split into o + r or as single image? (DECISION: o + r)
  - upload them a side by sides, and split them in the FE when needed? (bigger payload but FE trickery).mBUT mobile design. single side images will be easier to stack. Also easier to lay out content relative to both images (since we cant align to width within the image.)
- [x] config Storybook. Set up a demo component in it. Be able to run it locally
- [x] breadcrumb component. create up style it up
- [x] footer component
- [x] CoinCardGridItem component (currently CoinCard). attach click handler, work out how I am going to serve the coin detail screen/card/overlay
- [x] style up the menus
- [x] image file naming schema
- [x] image file names generator tool (on add coin page, see readme for file name schema).
- [x] CoinGrid renders items in earliest mint year order (oldest first, do db indexing for it)
- [x] toggle for CoinGrid -> obv | rev | both (default to obverse maybe?). The width of the grid items will need to change based on what is selected.
- [x] single side images themselves can also be bigger. grid item component might need 2 variants.
- [x] CoinCardGridItem: play around with relatively scaling the images (when in single side variant) based on the actual diameters of the coins.
- [x] cloudinary. how to not automatically add the uid at the end of the image id. I just want what the file was called when I uploaded it.
- [x] toggle for collection display grid page -> show obverse/reverse/both/obverse+sketch/reverse+sketch
- [x] CLOUDINARY CLI TUTORIAL - remove bg on upload
- [x] find a way to quickly split one image into two on upload
- [x] work out a decently fast image upload workflow
- [x] measure the diameters of the items that are missing diameters
- [x] pre-fetch when the next chevron is hovered.
- [x] Coin Card detail MVP. coin images o + r, summary info, flavour text
- [x] info area includes the civ_detail field (if present) directly after the civ field display.
- [x] update db schema: image_link_sketch_o, image_link_sketch_r
- [x] tweak styles for CoinCardDetail.
- [x] flip btn reposition on mobile.
- [x] mobile styles for the CoinCardDetail
- [x] re-style the page titles. thinner, classier text. smaller. underline of small width at center of heading
- [x] name all the images that I have
- [x] upload all the coins to db
- [x] rejig the navigation. Stuff on Main -> CoinGrid, Main -> About, delete the fruits stuff, make the admin page on the end. Hide the login UI stuff (user needs to know the route to login page)
- [x] style up the CoinGrid controls (radio group)
- [x] add db column array type for sets. Array strings. The CoinForm will have a multi select dropdown for these.
- [x] Sets pages 'Severan' filters the coins by the rows that have sets arrays that include 'severan'
- [x] db schema updates. legend_o_expanded, legend_r_expanded, latin_translation_o, latin_translation_r
- [x] make the admin route have a dropdown. we will now have multiple admin pages (all auth blocked)
  - admin/add-coin (existing stuff)
  - admin/mint-list (view/edit mints)
  - admin/edit-somnus (view/edit somnus entries)
    - this will name just a few col for now. Nickname, legend, legend_expanded, legend translation and flavour_text
- [x] hook up specific menus to filtered db requests.
