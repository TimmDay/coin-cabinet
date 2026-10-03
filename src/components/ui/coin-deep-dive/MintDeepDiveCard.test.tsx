import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { MintDeepDiveCard } from "./MintDeepDiveCard"

vi.mock("~/components/CloudinaryImage", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

let mints: unknown[] = []
vi.mock("~/api/mints", () => ({
  useMints: () => ({ data: mints, isLoading: false, error: null }),
}))

const mint = (extra = {}) => ({
  id: 1,
  name: "Rome",
  flavour_text: "The first mint.",
  mint_marks: ["ROMA"],
  ...extra,
})

describe("MintDeepDiveCard", () => {
  beforeEach(() => {
    mints = []
  })

  it("shows the mint's picture with its credit when it has one", () => {
    mints = [
      mint({
        image_url: "https://img/rome.jpg",
        image_alt_text: "The temple of Juno Moneta",
        image_credit: "2026-TimDay-SonyRX10",
      }),
    ]
    render(<MintDeepDiveCard mintId={1} />)
    fireEvent.click(screen.getByRole("button", { name: /expand/i }))

    expect(screen.getByAltText("The temple of Juno Moneta")).toBeTruthy()
    expect(screen.getByText(/2026-TimDay-SonyRX10/)).toBeTruthy()
  })

  it("has no picture, and no toggle for one, when the mint has none", () => {
    mints = [mint()]
    render(<MintDeepDiveCard mintId={1} />)

    expect(screen.queryByRole("img")).toBeNull()
  })
})
