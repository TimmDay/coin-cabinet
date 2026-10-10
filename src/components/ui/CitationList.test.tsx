import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Citation } from "~/database/schema-citations"
import { CitationList } from "./CitationList"

const dio: Citation = {
  id: 1,
  author: "Cassius Dio",
  title: "Roman History",
  locator: "78.4.2",
  url: "https://perseus.example/dio",
  note: "birthplace",
}

describe("CitationList", () => {
  it("shows the Work as one linked name, then the locator, with the note on hover", () => {
    render(<CitationList citations={[dio]} />)

    const link = screen.getByRole("link", {
      name: "Cassius Dio, Roman History",
    })
    expect(link).toHaveAttribute("href", "https://perseus.example/dio")
    expect(screen.getByText("78.4.2")).toBeInTheDocument()
    expect(screen.getByRole("listitem")).toHaveAttribute("title", "birthplace")
  })

  it("shows a Work with no link as plain text, and no locator when citing the whole Work", () => {
    render(<CitationList citations={[{ ...dio, url: null, locator: null }]} />)

    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.getByRole("listitem")).toHaveTextContent(
      /^Cassius Dio, Roman History$/,
    )
  })

  it("renders nothing without citations", () => {
    const { container } = render(<CitationList citations={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
