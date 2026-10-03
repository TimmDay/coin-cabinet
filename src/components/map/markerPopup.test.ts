import { describe, expect, it } from "vitest"
import { markerPopup, type CustomMapMarker } from "./mapMarkers"

const base: CustomMapMarker = {
  id: "m",
  lat: 1,
  lng: 2,
  title: "Rome mint",
  fillColor: "red",
  borderColor: "blue",
  className: "text-pin-wine",
}

describe("markerPopup", () => {
  it("opens the marker's text in its own colour", () => {
    expect(
      markerPopup({ ...base, subtitle: "Struck here", description: "Long" }),
    ).toEqual({
      title: "Rome mint",
      subtitle: "Struck here",
      description: "Long",
      className: "text-pin-wine",
    })
  })

  it("defaults the description and the colour", () => {
    expect(markerPopup({ ...base, className: undefined })).toMatchObject({
      description: "",
      className: "text-paper-ink",
    })
  })

  it("opens nothing for a marker that is switched off or has no text", () => {
    expect(markerPopup({ ...base, showPopup: false })).toBeNull()
    expect(
      markerPopup({
        ...base,
        title: "",
        subtitle: undefined,
        description: undefined,
      }),
    ).toBeNull()
  })
})
