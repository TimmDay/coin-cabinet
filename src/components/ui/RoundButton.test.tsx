import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { RoundButton } from "./RoundButton"

describe("RoundButton", () => {
  it("renders with children", () => {
    render(<RoundButton>Click me</RoundButton>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn()
    render(<RoundButton onClick={handleClick}>Click me</RoundButton>)

    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn()
    render(
      <RoundButton onClick={handleClick} disabled>
        Click me
      </RoundButton>,
    )

    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("applies correct size classes", () => {
    const { rerender } = render(<RoundButton size="sm">Small</RoundButton>)
    expect(screen.getByRole("button")).toHaveClass("px-3", "py-1.5", "text-sm")

    rerender(<RoundButton size="md">Medium</RoundButton>)
    expect(screen.getByRole("button")).toHaveClass("px-4", "py-2", "text-base")

    rerender(<RoundButton size="lg">Large</RoundButton>)
    expect(screen.getByRole("button")).toHaveClass("px-6", "py-3", "text-lg")
  })

  it("applies correct variant classes", () => {
    const { rerender } = render(
      <RoundButton variant="primary">Primary</RoundButton>,
    )
    expect(screen.getByRole("button")).toHaveClass("bg-amber-600")

    rerender(<RoundButton variant="secondary">Secondary</RoundButton>)
    expect(screen.getByRole("button")).toHaveClass("bg-slate-600")

    rerender(<RoundButton variant="danger">Danger</RoundButton>)
    expect(screen.getByRole("button")).toHaveClass("bg-rose-800/80")
  })

  it("applies disabled styles when disabled", () => {
    render(<RoundButton disabled>Disabled</RoundButton>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed")
  })

  it("applies custom className", () => {
    render(<RoundButton className="custom-class">Button</RoundButton>)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })

  it("supports different button types", () => {
    render(<RoundButton type="submit">Submit</RoundButton>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })
})
