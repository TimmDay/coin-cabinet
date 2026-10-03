import { describe, expect, it } from "vitest"
import { clickPoint } from "./CustomMarkerLayer"

function click(
  detail: number,
  clientX: number,
  clientY: number,
  target: Element,
) {
  const event = new MouseEvent("click", { detail, clientX, clientY })
  Object.defineProperty(event, "target", { value: target })
  return event
}

describe("clickPoint", () => {
  it("is where the mouse clicked", () => {
    const el = document.createElement("div")
    expect(clickPoint(click(1, 40, 60, el))).toEqual({
      clientX: 40,
      clientY: 60,
    })
  })

  it("is the middle of the marker for a key press, which clicks at 0,0", () => {
    const el = document.createElement("div")
    el.getBoundingClientRect = () => new DOMRect(100, 200, 20, 40)
    expect(clickPoint(click(0, 0, 0, el))).toEqual({
      clientX: 110,
      clientY: 220,
    })
  })
})
