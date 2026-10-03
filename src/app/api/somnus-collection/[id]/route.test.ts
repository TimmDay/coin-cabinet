import { describe, expect, it, vi } from "vitest"
import { GET } from "./route"

const fetchCollectionDetail = vi.fn()

vi.mock("~/database/supabase-server", () => ({
  createClient: () => Promise.resolve({}),
}))
vi.mock("~/database/queries/collection", () => ({
  fetchCollectionDetail: (...args: unknown[]) => fetchCollectionDetail(...args),
}))

const request = new Request("http://localhost/api/somnus-collection/x")
const withId = (id: string) => ({ params: Promise.resolve({ id }) })

describe("GET /api/somnus-collection/[id]", () => {
  it.each(["abc", "12abc", "-1", "0", "1.5", "99999999999", ""])(
    "rejects the id %j without querying",
    async (id) => {
      const response = await GET(request, withId(id))

      expect(response.status).toBe(400)
      expect(fetchCollectionDetail).not.toHaveBeenCalled()
    },
  )

  it("loads a numeric id", async () => {
    fetchCollectionDetail.mockResolvedValue({ data: { id: 7 }, error: null })
    const response = await GET(request, withId("7"))

    expect(response.status).toBe(200)
    expect(fetchCollectionDetail).toHaveBeenCalledWith({}, 7)
  })
})
