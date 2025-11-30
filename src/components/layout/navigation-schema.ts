export const navigationItems = [
  { name: "Cabinet", href: "/cabinet", hasSubmenu: true },
  { name: "Articles", href: "/articles", hasSubmenu: true },
  { name: "Map", href: "/map" },
  { name: "About", href: "/about" },
  { name: "Admin", href: "/admin", hasSubmenu: true },
]

export type SubmenuTypes =
  | "Cabinet"
  | "Admin"
  | "Articles"
  | "yearInCoins"
  | "cabinetRoman"
  | "adminCollection"
  | "adminDeities"
  | "adminPlaces"
  | "adminMints"

export const adminSubmenu = [
  { name: "Collection", href: "/admin/collection", hasSubmenu: true },
  { name: "Deities", href: "/admin/deities", hasSubmenu: true },
  { name: "Places", href: "/admin/places", hasSubmenu: true },
  { name: "Mints", href: "/admin/mints", hasSubmenu: true },
  { name: "Edit Map", href: "/admin/edit-map" },
  { name: "Feature Flags", href: "/admin/feature-flags" },
]

export const adminCollectionSubmenu = [
  { name: "Add Coin", href: "/admin/add-coin" },
  { name: "Edit Somnus", href: "/admin/edit-somnus" },
]

export const adminDeitiesSubmenu = [
  { name: "Add Deity", href: "/admin/add-deity" },
  { name: "Edit Deities", href: "/admin/edit-deities" },
]

export const adminPlacesSubmenu = [
  { name: "Add Place", href: "/admin/add-place" },
  { name: "Edit Places", href: "/admin/edit-places" },
]

export const adminMintsSubmenu = [
  { name: "Add Mint", href: "/admin/add-mint" },
  { name: "Edit Mints", href: "/admin/edit-mints" },
]

export const cabinetSubmenu = [
  { name: "Roman", href: "/cabinet/roman", hasSubmenu: true },
  { name: "Greek", href: "/cabinet/greek" },
  { name: "Judea", href: "/cabinet/judea" },
  { name: "All Coins", href: "/cabinet/all-coins" },
]

export const cabinetRomanSubmenu = [
  { name: "Roman Emperors", href: "/cabinet/silver-emperors" },
  { name: "Imperial Women", href: "/cabinet/imperial-women" },
  { name: "The Adoptive Emperors", href: "/cabinet/adoptive-emperors" },
  { name: "Severan Dynasty", href: "/cabinet/severan-dynasty" },
  { name: "Gordy Boys", href: "/cabinet/gordy-boys" },
  { name: "Crisis", href: "/cabinet/crisis" },
  { name: "Tetrachy", href: "/cabinet/tetrachy" },
  { name: "Constantinian", href: "/cabinet/constantinian" },
  { name: "Hoards", href: "/cabinet/hoards" },
]

export const articlesSubmenu = [
  { name: "Year in coins", href: "/articles/year-in-coins", hasSubmenu: true },
]

// Feature-flagged articles that require dev mode
export const devArticlesSubmenu = [
  { name: "Caracalla and Geta", href: "/articles/caracalla-and-geta" },
]

export const yearInCoinsSubmenu = [
  { name: "2025", href: "/articles/year-in-coins/2025" },
  { name: "2026", href: "/articles/year-in-coins/2026" },
  { name: "2027", href: "/articles/year-in-coins/2027" },
]
