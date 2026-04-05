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
  { name: "All Coins", href: "/cabinet/all-coins" },
  { name: "Roman", href: "/cabinet/roman-timeline", hasSubmenu: true },
  { name: "Judea", href: "/cabinet/judea" },
  { name: "Persian", href: "/cabinet/persian" },
  { name: "Greek", href: "/cabinet/greek" },
  { name: "Byzantine", href: "/cabinet/byzantine" },
]

export const cabinetRomanSubmenu = [
  { name: "Emperors", href: "/cabinet/silver-emperors" },
  { name: "Women", href: "/cabinet/imperial-women" },
  { name: "Gordy Boys", href: "/cabinet/gordy-boys" },
  { name: "Severan", href: "/cabinet/severan-dynasty" },
  { name: "Crisis", href: "/cabinet/crisis" },
  { name: "Detector Finds", href: "/cabinet/detector-finds" },
]

export const articlesSubmenu = [
  { name: "Year in coins", href: "/articles/year-in-coins", hasSubmenu: true },
]

export const yearInCoinsSubmenu = [
  { name: "2025", href: "/articles/year-in-coins/2025" },
  { name: "2026", href: "/articles/year-in-coins/2026" },
  // { name: "2027", href: "/articles/year-in-coins/2027" },
]

// Feature-flagged articles that require dev mode
export const devArticlesSubmenu = [
  { name: "Caracalla and Geta", href: "/articles/caracalla-and-geta" },
]
