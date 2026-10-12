import type { FeatureFlagName } from "~/lib/feature-flags"

/** A link in the site navigation. One with children opens a submenu. */
export type NavItem = {
  name: string
  href: string
  children?: NavItem[]
  /** Shown only while this feature flag is on, with everything under it. */
  flag?: FeatureFlagName
}

const navigation: NavItem[] = [
  {
    name: "Cabinet",
    href: "/cabinet",
    children: [
      { name: "All Coins", href: "/cabinet/all-coins" },
      {
        name: "Roman",
        href: "/cabinet/roman-timeline",
        children: [
          { name: "Emperors", href: "/cabinet/silver-emperors" },
          { name: "Women", href: "/cabinet/imperial-women" },
          { name: "Gordy Boys", href: "/cabinet/gordy-boys" },
          { name: "Severan", href: "/cabinet/severan-dynasty" },
          { name: "Crisis", href: "/cabinet/crisis" },
          { name: "Detector Finds", href: "/cabinet/detector-finds" },
        ],
      },
      { name: "Judea", href: "/cabinet/judea" },
      { name: "Persian", href: "/cabinet/persian" },
      { name: "Greek", href: "/cabinet/greek" },
      { name: "Byzantine", href: "/cabinet/byzantine" },
    ],
  },
  {
    name: "Articles",
    href: "/articles",
    flag: "articles",
    children: [
      { name: "Caracalla and Geta", href: "/articles/caracalla-and-geta" },
    ],
  },
  { name: "Map", href: "/map" },
]

/** The navigation tree as a visitor sees it with these flags. */
export function visibleNavigation(
  flags: Partial<Record<FeatureFlagName, boolean>>,
): NavItem[] {
  const visible = (items: NavItem[]): NavItem[] =>
    items
      .filter((item) => !item.flag || flags[item.flag])
      .map((item) =>
        item.children ? { ...item, children: visible(item.children) } : item,
      )
  return visible(navigation)
}
