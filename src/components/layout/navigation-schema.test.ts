import { describe, expect, it } from "vitest"
import { visibleNavigation, type NavItem } from "./navigation-schema"

const names = (items: NavItem[]) => items.map((item) => item.name)
const child = (items: NavItem[], name: string) =>
  items.find((item) => item.name === name)

describe("visibleNavigation", () => {
  it("hides Articles, and everything under it, without its flag", () => {
    expect(names(visibleNavigation({ articles: false }))).toEqual([
      "Cabinet",
      "Map",
    ])
  })

  it("shows Articles with its flag", () => {
    const navigation = visibleNavigation({ articles: true })
    expect(names(navigation)).toEqual(["Cabinet", "Articles", "Map"])
    expect(names(child(navigation, "Articles")?.children ?? [])).toEqual([
      "Caracalla and Geta",
    ])
  })

  it("nests the Roman sets under Cabinet", () => {
    const cabinet = child(visibleNavigation({ articles: false }), "Cabinet")
    const roman = child(cabinet?.children ?? [], "Roman")
    expect(roman?.href).toBe("/cabinet/roman-timeline")
    expect(names(roman?.children ?? [])).toContain("Gordy Boys")
  })

  it("leaves leaf links without children", () => {
    const map = child(visibleNavigation({ articles: false }), "Map")
    expect(map?.children).toBeUndefined()
  })
})
