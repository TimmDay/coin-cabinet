import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Mint } from "~/database/schema-mints"
import { MintDeepDiveCard } from "./MintDeepDiveCard"

vi.mock("~/components/CloudinaryImage", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const mint = (extra = {}) =>
  ({
    id: 1,
    name: "Rome",
    flavour_text: "The first mint.",
    mint_marks: ["ROMA"],
    ...extra,
  }) as Mint

describe("MintDeepDiveCard", () => {
  it("shows the mint's picture with its credit when it has one", () => {
    render(
      <MintDeepDiveCard
        mint={mint({
          image_url: "https://img/rome.jpg",
          image_alt_text: "The temple of Juno Moneta",
          image_credit: "2026-TimDay-SonyRX10",
        })}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: /expand/i }))

    expect(screen.getByAltText("The temple of Juno Moneta")).toBeTruthy()
    expect(screen.getByText(/2026-TimDay-SonyRX10/)).toBeTruthy()
  })

  it("dates each working period, saying from when it has no end", () => {
    render(
      <MintDeepDiveCard
        mint={mint({
          operation_periods: [
            [-260, 0, "Republic"],
            [195, 197, "Clodius Albinus"],
          ],
        })}
      />,
    )
    expect(screen.getByText(/from 260 BCE \(Republic\)/)).toBeTruthy()
    expect(screen.getByText(/195—197 CE \(Clodius Albinus\)/)).toBeTruthy()
  })

  it("shows nothing for a mint with no text", () => {
    const { container } = render(
      <MintDeepDiveCard mint={mint({ flavour_text: null })} />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("has no picture, and no toggle for one, when the mint has none", () => {
    render(<MintDeepDiveCard mint={mint()} />)

    expect(screen.queryByRole("img")).toBeNull()
  })
})
