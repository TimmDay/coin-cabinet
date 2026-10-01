import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FilterYear } from "./FilterYear"

const props = {
  id: "year-start",
  placeholder: "Year start",
  label: "Year start",
}

describe("FilterYear", () => {
  it("is a labelled number box with no clear button while empty", () => {
    render(<FilterYear {...props} value="" onChange={() => undefined} />)
    expect(
      screen.getByRole("spinbutton", { name: "Year start" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Clear Year start" }),
    ).not.toBeInTheDocument()
  })

  it("shows a clear button once a year is entered", () => {
    render(<FilterYear {...props} value="220" onChange={() => undefined} />)
    expect(
      screen.getByRole("button", { name: "Clear Year start" }),
    ).toBeInTheDocument()
  })

  it("clears the year and returns focus to the box when clicked", () => {
    const onChange = vi.fn()
    render(<FilterYear {...props} value="220" onChange={onChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Clear Year start" }))

    expect(onChange).toHaveBeenCalledWith("")
    expect(screen.getByRole("spinbutton", { name: "Year start" })).toHaveFocus()
  })
})
