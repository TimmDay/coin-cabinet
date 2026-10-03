import { afterEach, describe, expect, it, vi } from "vitest"
import { publicRoute, PublicRouteError } from "./public-route"

vi.mock("~/database/supabase-server", () => ({
  createClient: () => Promise.resolve({}),
}))

const request = new Request("http://localhost/api/test")

async function body(response: Response) {
  return (await response.json()) as Record<string, unknown>
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe("publicRoute", () => {
  it("answers the data in a success envelope", async () => {
    const GET = publicRoute("mints", () =>
      Promise.resolve({ data: [{ id: 1 }], error: null }),
    )
    const response = await GET(request, undefined)

    expect(response.status).toBe(200)
    expect(await body(response)).toEqual({ success: true, data: [{ id: 1 }] })
    expect(response.headers.get("Cache-Control")).toBeNull()
  })

  it("sets cache headers only when asked", async () => {
    const GET = publicRoute(
      "deities",
      () => Promise.resolve({ data: [], error: null }),
      { cache: true },
    )
    const response = await GET(request, undefined)

    expect(response.headers.get("Cache-Control")).toContain("max-age=300")
  })

  it("answers 404 when the loader finds nothing", async () => {
    const GET = publicRoute("coin", () =>
      Promise.resolve({ data: null, error: null }),
    )
    const response = await GET(request, undefined)

    expect(response.status).toBe(404)
    expect(await body(response)).toEqual({
      success: false,
      message: "coin not found",
    })
  })

  it("keeps the database error out of a production response", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const GET = publicRoute("deities", () =>
      Promise.resolve({
        data: null,
        error: { message: 'relation "secret_table" does not exist' },
      }),
    )
    const response = await GET(request, undefined)
    const json = await body(response)

    expect(response.status).toBe(500)
    expect(json).toEqual({ success: false, message: "Failed to load deities" })
    expect(response.headers.get("Cache-Control")).toContain("no-store")
  })

  it("includes the cause outside production", async () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const GET = publicRoute("deities", () =>
      Promise.resolve({ data: null, error: { message: "boom" } }),
    )

    expect((await body(await GET(request, undefined))).error).toBe("boom")
  })

  it("masks an unexpected throw too", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const GET = publicRoute("places", () => {
      throw new Error("connection string leaked")
    })
    const json = await body(await GET(request, undefined))

    expect(JSON.stringify(json)).not.toContain("leaked")
  })

  it("passes a PublicRouteError through with its status", async () => {
    const GET = publicRoute("coin", () => {
      throw new PublicRouteError("Invalid coin id", 400)
    })
    const response = await GET(request, undefined)

    expect(response.status).toBe(400)
    expect(await body(response)).toEqual({
      success: false,
      message: "Invalid coin id",
    })
  })
})
