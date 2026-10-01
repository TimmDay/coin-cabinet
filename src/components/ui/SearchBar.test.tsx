import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SearchBar } from "./SearchBar"

describe("SearchBar", () => {
  it("is a labelled search box with no clear button while empty", () => {
    render(<SearchBar value="" onChange={() => undefined} />)
    expect(
      screen.getByRole("textbox", { name: "Search coins" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument()
  })

  it("shows a clear button once there is text", () => {
    render(<SearchBar value="denarius" onChange={() => undefined} />)
    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument()
  })

  it("clears the text and returns focus to the box when clicked", () => {
    const onChange = vi.fn()
    render(<SearchBar value="denarius" onChange={onChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }))

    expect(onChange).toHaveBeenCalledWith("")
    expect(screen.getByRole("textbox", { name: "Search coins" })).toHaveFocus()
  })

  it("reports typing", () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "gor" } })
    expect(onChange).toHaveBeenCalledWith("gor")
  })
})
