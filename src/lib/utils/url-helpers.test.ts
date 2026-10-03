import { describe, expect, it } from "vitest"
import { safeLinkUrl } from "./url-helpers"

describe("safeLinkUrl", () => {
  it.each([
    ["https://example.com/a?b=1", "https://example.com/a?b=1"],
    ["http://example.com", "http://example.com"],
    ["/cabinet/76-aquilia-severa", "/cabinet/76-aquilia-severa"],
    ["  https://example.com  ", "https://example.com"],
  ])("keeps %s", (input, expected) => {
    expect(safeLinkUrl(input)).toBe(expected)
  })

  it.each([
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "//evil.example.com",
    "not a url",
    "",
  ])("drops %s", (input) => {
    expect(safeLinkUrl(input)).toBeNull()
  })

  it("drops null and undefined", () => {
    expect(safeLinkUrl(null)).toBeNull()
    expect(safeLinkUrl(undefined)).toBeNull()
  })
})
