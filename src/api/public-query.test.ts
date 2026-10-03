import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchPublic } from "./public-query"

function respondWith(body: unknown, init: ResponseInit = { status: 200 }) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve(
        new Response(
          typeof body === "string" ? body : JSON.stringify(body),
          init,
        ),
      ),
    ),
  )
}

afterEach(() => vi.unstubAllGlobals())

describe("fetchPublic", () => {
  it("unwraps the data", async () => {
    respondWith({ success: true, data: [1, 2] })
    expect(await fetchPublic<number[]>("/api/x", "numbers")).toEqual([1, 2])
  })

  it("throws the route's message", async () => {
    respondWith({ success: false, message: "Coin not found" }, { status: 404 })
    await expect(fetchPublic("/api/x", "coin")).rejects.toThrow(
      "Coin not found",
    )
  })

  it("falls back to a plain message when the body is not JSON", async () => {
    respondWith("<html>Bad gateway</html>", { status: 502 })
    await expect(fetchPublic("/api/x", "mints")).rejects.toThrow(
      "Failed to load mints",
    )
  })
})
