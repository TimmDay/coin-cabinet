export const navigationItems = [
  { name: "Cabinet", href: "/cabinet", hasSubmenu: true },
  { name: "Articles", href: "/articles", hasSubmenu: true },
  { name: "Map", href: "/map" },
  { name: "Admin", href: "/admin", hasSubmenu: true },
]

export type SubmenuTypes =
  | "Cabinet"
  | "Admin"
  | "Articles"
  | "yearInCoins"
  | "cabinetRoman"

export const adminSubmenu = [
  { name: "Manage Collection", href: "/admin/edit-somnus" },
  { name: "Manage Deities", href: "/admin/edit-deities" },
  { name: "Manage Places", href: "/admin/edit-places" },
  { name: "Manage Mints", href: "/admin/edit-mints" },
  { name: "Manage People", href: "/admin/edit-historical-figures" },
  { name: "Manage Timelines", href: "/admin/edit-timelines" },
  { name: "Manage Artifacts", href: "/admin/edit-artifacts" },
  { name: "Feature Flags", href: "/admin/feature-flags" },
]

export const cabinetSubmenu = [
  { name: "Roman", href: "/cabinet/roman-timeline", hasSubmenu: true },
  { name: "Judea", href: "/cabinet/judea" },
  { name: "Persian", href: "/cabinet/persian" },
  { name: "Gordy Boys", href: "/cabinet/gordy-boys" },
  { name: "All Coins", href: "/cabinet/all-coins" },
]

export const cabinetRomanSubmenu = [
  { name: "Emperors", href: "/cabinet/silver-emperors" },
  { name: "Women", href: "/cabinet/imperial-women" },
  { name: "Severan", href: "/cabinet/severan-dynasty" },
  { name: "Crisis", href: "/cabinet/crisis" },
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
  // { name: "2027", href: "/articles/year-in-coins/2027" },
]
