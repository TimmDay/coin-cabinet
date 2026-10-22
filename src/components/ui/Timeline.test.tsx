import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Timeline as TimelineType } from "~/data/timelines/types"
import { Timeline } from "./Timeline"

const timeline: TimelineType = [
  { kind: "birth", name: "Born", year: 200, sequence: 1 },
  { kind: "family", name: "Married", year: 220, sequence: 1 },
  { kind: "coin-minted", name: "Coin Minted", year: 220, sequence: 6 },
  { kind: "death", name: "Died", year: 253, sequence: 1 },
]

const markers = () => screen.getAllByRole("button", { name: / - / })

describe("Timeline", () => {
  it("puts its markers in the page's tab order", () => {
    render(<Timeline timeline={timeline} enableMobileDrawer={false} />)

    expect(markers()).toHaveLength(4)
    for (const marker of markers()) {
      expect(marker.getAttribute("tabindex")).toBe("0")
    }
  })

  it("names each marker once, for its button only", () => {
    const { container } = render(
      <Timeline timeline={timeline} enableMobileDrawer={false} />,
    )

    expect(container.querySelectorAll(".sr-only")).toHaveLength(0)
    expect(screen.getByRole("button", { name: "Born - 200" })).toBeTruthy()
  })

  it("moves to the next and previous event with the arrow keys", () => {
    render(
      <>
        <Timeline timeline={timeline} enableMobileDrawer={false} />
        <Timeline timeline={timeline} enableMobileDrawer={false} />
      </>,
    )
    const born = screen.getAllByRole("button", { name: "Born - 200" })[0]!
    const marriedInFirst = screen.getAllByRole("button", {
      name: "Married - 220",
    })[0]!

    born.focus()
    fireEvent.keyDown(born, { key: "ArrowRight" })
    // The first timeline's own next marker, not one in the other timeline
    expect(document.activeElement).toBe(marriedInFirst)

    fireEvent.keyDown(marriedInFirst, { key: "ArrowLeft" })
    expect(document.activeElement).toBe(born)
  })
})
