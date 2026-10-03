import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ImageCarousel } from "./ImageCarousel"

// The real component asks Cloudinary for the picture; a plain img shows which one is up.
vi.mock("~/components/CloudinaryImage", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

const shown = () => screen.getByRole("img").getAttribute("src")

describe("ImageCarousel", () => {
  it("shows a single image with nothing to click", () => {
    render(<ImageCarousel images={["a"]} alt="Concordia" />)

    expect(shown()).toBe("a")
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("steps to the next image when the picture is clicked, and wraps", () => {
    render(<ImageCarousel images={["a", "b", "c"]} alt="Concordia" />)
    const picture = screen.getByRole("button", { name: /Show the next image/ })

    fireEvent.click(picture)
    expect(shown()).toBe("b")
    fireEvent.click(picture)
    fireEvent.click(picture)
    expect(shown()).toBe("a")
  })

  it("jumps to an image from the dots and marks the current one", () => {
    render(<ImageCarousel images={["a", "b", "c"]} alt="Concordia" />)

    fireEvent.click(screen.getByRole("button", { name: "Image 3" }))

    expect(shown()).toBe("c")
    expect(screen.getByRole("button", { name: "Image 3" })).toHaveAttribute(
      "aria-current",
      "true",
    )
    expect(screen.getByRole("button", { name: "Image 1" })).not.toHaveAttribute(
      "aria-current",
    )
  })

  it("says which image of how many is showing", () => {
    render(<ImageCarousel images={["a", "b"]} alt="Concordia" />)

    expect(
      screen.getByRole("button", { name: /image 1 of 2/ }),
    ).toBeInTheDocument()
  })

  it("renders nothing for no images", () => {
    const { container } = render(<ImageCarousel images={[]} alt="x" />)
    expect(container).toBeEmptyDOMElement()
  })
})
