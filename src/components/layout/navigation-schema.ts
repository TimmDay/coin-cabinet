export const navigationItems = [
  { name: "Sets", href: "/sets", hasSubmenu: true },
  { name: "Articles", href: "/articles" },
  { name: "About", href: "/" },
  { name: "Admin", href: "/admin" },
]

export const coinCabinetItems = [
  { name: "Roman", href: "/coin-cabinet/roman", hasSubmenu: true },
  { name: "Greek", href: "/coin-cabinet/greek" },
  { name: "Year in coins", href: "/coin-cabinet/year-in-coins" },
  { name: "Sets", href: "/coin-cabinet/sets", hasSubmenu: true },
  { name: "Ex Collection", href: "/coin-cabinet/ex-collection" },
]

export type SubmenuTypes = "roman" | "sets" | "mainSets";

export const mainSetsSubmenu = [
  { name: "Severan Dynasty", href: "/sets/severan-dynasty" },
  { name: "Constantinian", href: "/sets/constantinian" },
]

export const setsSubmenu = [
  { name: "Severan Period", href: "/coin-cabinet/sets/severan-period" },
  { name: "Imperial Women", href: "/coin-cabinet/sets/imperial-women" },
  { name: "First Tetrachy", href: "/coin-cabinet/sets/first-tetrachy" },
  {
    name: "Constantinian Family",
    href: "/coin-cabinet/sets/constantinian-family",
  },
  { name: "From Hoards", href: "/coin-cabinet/sets/from-hoards" },
]

export const romanSubmenu = [
  { name: "Republic", href: "/coin-cabinet/roman/republic" },
  { name: "Imperatorial", href: "/coin-cabinet/roman/imperatorial" },
  { name: "Imperial", href: "/coin-cabinet/roman/imperial" },
]
