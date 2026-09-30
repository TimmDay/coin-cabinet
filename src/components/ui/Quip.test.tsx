import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Quip, withQuips } from "./Quip"

describe("Quip", () => {
  it("renders a closed, labelled button and no popover text", () => {
    render(<Quip>a little aside</Quip>)
    const button = screen.getByRole("button", { name: "More info" })
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()
  })

  it("supports a custom accessible label", () => {
    render(<Quip label="About the yard">buried</Quip>)
    expect(
      screen.getByRole("button", { name: "About the yard" }),
    ).toBeInTheDocument()
  })

  it("shows the aside inside a status region when activated, and hides it on a second activation", () => {
    render(<Quip>a little aside</Quip>)
    const button = screen.getByRole("button", { name: "More info" })

    fireEvent.click(button)
    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("status")).toHaveTextContent("a little aside")

    fireEvent.click(button)
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()
  })

  it("closes on Escape", () => {
    render(<Quip>a little aside</Quip>)
    fireEvent.click(screen.getByRole("button"))
    expect(screen.getByText("a little aside")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()
  })

  it("closes when pressing outside, but not when pressing inside the popover", () => {
    render(
      <div>
        <Quip>a little aside</Quip>
        <p>elsewhere</p>
      </div>,
    )
    fireEvent.click(screen.getByRole("button"))

    fireEvent.pointerDown(screen.getByText("a little aside"))
    expect(screen.getByText("a little aside")).toBeInTheDocument()

    fireEvent.pointerDown(screen.getByText("elsewhere"))
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()
  })
})

describe("Quip hover", () => {
  it("shows on mouse hover and hides when the mouse leaves", () => {
    render(<Quip>a little aside</Quip>)
    const button = screen.getByRole("button")

    fireEvent.pointerEnter(button, { pointerType: "mouse" })
    expect(screen.getByText("a little aside")).toBeInTheDocument()
    expect(button).toHaveAttribute("aria-expanded", "true")

    fireEvent.pointerLeave(button, { pointerType: "mouse" })
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()
  })

  it("ignores touch hover so a tap only toggles once", () => {
    render(<Quip>a little aside</Quip>)
    const button = screen.getByRole("button")

    fireEvent.pointerEnter(button, { pointerType: "touch" })
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByText("a little aside")).toBeInTheDocument()
  })

  it("stays open after the mouse leaves once it has been clicked", () => {
    render(<Quip>a little aside</Quip>)
    const button = screen.getByRole("button")

    fireEvent.pointerEnter(button, { pointerType: "mouse" })
    fireEvent.click(button)
    fireEvent.pointerLeave(button, { pointerType: "mouse" })
    expect(screen.getByText("a little aside")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByText("a little aside")).not.toBeInTheDocument()
  })

  it("stays open while the mouse moves from the icon onto the popover", () => {
    render(<Quip>a little aside</Quip>)
    const button = screen.getByRole("button")

    fireEvent.pointerEnter(button, { pointerType: "mouse" })
    // Moving onto the popover is still inside the wrapper, so no leave fires.
    fireEvent.pointerEnter(screen.getByText("a little aside"), {
      pointerType: "mouse",
    })
    expect(screen.getByText("a little aside")).toBeInTheDocument()
  })
})

describe("withQuips", () => {
  const quips = { quip1: "first aside", quip2: "second aside" }

  it("turns each {placeholder} into a Quip showing its text", () => {
    render(<p>{withQuips("one {quip1} two {quip2} three", quips)}</p>)
    const buttons = screen.getAllByRole("button", { name: "More info" })
    expect(buttons).toHaveLength(2)

    fireEvent.click(buttons[1]!)
    expect(screen.getByText("second aside")).toBeInTheDocument()
    expect(screen.queryByText("first aside")).not.toBeInTheDocument()

    // Compare the prose only: the icons' decorative SVG text is not content.
    const paragraph = screen.getByText(/one/).cloneNode(true) as HTMLElement
    paragraph.querySelectorAll("svg, [role=status]").forEach((n) => n.remove())
    expect(paragraph.textContent?.replace(/\s+/g, " ")).toBe("one two three")
  })

  it("leaves text without placeholders untouched", () => {
    render(<p>{withQuips("plain text (with brackets)", quips)}</p>)
    expect(screen.getByText("plain text (with brackets)")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("leaves an unknown placeholder as literal text", () => {
    render(<p>{withQuips("oops {quip9}", quips)}</p>)
    expect(screen.getByText("oops {quip9}")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
