import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { DeepDiveCard } from "./DeepDiveCard"

describe("DeepDiveCard", () => {
  it("shows no stray count for a card with nothing to expand", () => {
    const { container } = render(
      <DeepDiveCard title="Aurelian" footer="Aurelianus" citations={[]} />,
    )
    expect(container.textContent).toBe("AurelianAurelianus")
  })
})
