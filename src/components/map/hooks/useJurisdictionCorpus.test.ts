import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchJurisdictionCorpus } from "./useJurisdictionCorpus"

const collection = (slug: string) => ({
  type: "FeatureCollection",
  features: [{ type: "Feature", geometry: null, properties: { slug } }],
})

/** Answers each path with its body, or with a 500 when it has none. */
function serve(bodies: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn((path: string) =>
      Promise.resolve(
        path in bodies
          ? new Response(JSON.stringify(bodies[path]))
          : new Response("broken", { status: 500, statusText: "Broken" }),
      ),
    ),
  )
}

const REALMS = "/data/jurisdictions/realms.geojson"
const PROVINCES = "/data/jurisdictions/provinces.geojson"
const SOURCES = "/data/jurisdictions/sources.json"

afterEach(() => vi.unstubAllGlobals())

describe("fetchJurisdictionCorpus", () => {
  it("joins realms and provinces into one corpus with its Sources", async () => {
    const sources = { src: { title: "Test", coverage: { from: 0, to: 1 } } }
    serve({
      [REALMS]: collection("rome"),
      [PROVINCES]: collection("syria"),
      [SOURCES]: sources,
    })

    const corpus = await fetchJurisdictionCorpus()

    expect(corpus.features.map((f) => f.properties.slug)).toEqual([
      "rome",
      "syria",
    ])
    expect(corpus.sources).toEqual(sources)
  })

  // With no Source to vouch for it, everything resolves as Inferred rather
  // than unattributed geometry passing as fact
  it("falls back to no Sources when they fail to load", async () => {
    serve({ [REALMS]: collection("rome"), [PROVINCES]: collection("syria") })

    const corpus = await fetchJurisdictionCorpus()

    expect(corpus.sources).toEqual({})
    expect(corpus.features).toHaveLength(2)
  })

  it("fails when geometry fails to load, so it can be retried", async () => {
    serve({ [REALMS]: collection("rome"), [SOURCES]: {} })

    await expect(fetchJurisdictionCorpus()).rejects.toThrow(PROVINCES)
  })
})
