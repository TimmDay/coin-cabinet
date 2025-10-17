export const navigationItems = [
  { name: "Cabinet", href: "/cabinet", hasSubmenu: true },
  { name: "Articles", href: "/articles", hasSubmenu: true },
  { name: "About", href: "/about" },
  { name: "Admin", href: "/admin", hasSubmenu: true },
]

export type SubmenuTypes =
  | "Cabinet"
  | "Admin"
  | "Articles"
  | "yearInCoins"
  | "cabinetRoman"

export const adminSubmenu = [
  { name: "Add Coin", href: "/admin/add-coin" },
  { name: "Edit Somnus", href: "/admin/edit-somnus" },
  { name: "Edit Map", href: "/admin/edit-map" },
  { name: "Edit Mints", href: "/admin/edit-mints" },
]

export const cabinetSubmenu = [
  { name: "Roman", href: "/cabinet/roman", hasSubmenu: true },
  { name: "Greek", href: "/cabinet/greek" },
  { name: "All Coins", href: "/cabinet" },
]

export const cabinetRomanSubmenu = [
  { name: "Severan Dynasty", href: "/cabinet/severan-dynasty" },
  { name: "Gordy Boy", href: "/cabinet/gordy-boys" },
  { name: "Crisis", href: "/cabinet/crisis" },
  { name: "Imperial Women", href: "/cabinet/imperial-women" },
  { name: "Tetrachy", href: "/cabinet/tetrachy" },
  { name: "Constantinian", href: "/cabinet/constantinian" },
  { name: "Hoards", href: "/cabinet/hoards" },
]

export const articlesSubmenu = [
  { name: "Year in coins", href: "/articles/year-in-coins", hasSubmenu: true },
]

export const yearInCoinsSubmenu = [
  { name: "2025", href: "/articles/year-in-coins/2025" },
  { name: "2026", href: "/articles/year-in-coins/2026" },
  { name: "2027", href: "/articles/year-in-coins/2027" },
]
