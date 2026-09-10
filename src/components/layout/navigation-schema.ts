export const navigationItems = [
  { name: "Cabinet", href: "/cabinet", hasSubmenu: true },
  { name: "Articles", href: "/articles", hasSubmenu: true },
  { name: "Map", href: "/map" },
  { name: "Feature Flags", href: "/feature-flags" },
]

export type SubmenuTypes = "Cabinet" | "Articles" | "cabinetRoman"

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

// The whole "Articles" nav item (this menu and everything under it) is
// gated behind the "articles" feature flag, so its contents don't need
// their own separate flag check.
export const articlesSubmenu = [
  { name: "Caracalla and Geta", href: "/articles/caracalla-and-geta" },
]
