import { describe, expect, it } from "vitest"
import { getPostAuthorDisplayName } from "./blog-author"

describe("getPostAuthorDisplayName", () => {
  it("uses authorDisplayName when set", () => {
    expect(
      getPostAuthorDisplayName({
        authorDisplayName: "  Dr. Jane Doe  ",
        author: { name: "Admin", email: "admin@x.com" },
      })
    ).toBe("Dr. Jane Doe")
  })

  it("falls back to author name", () => {
    expect(
      getPostAuthorDisplayName({
        authorDisplayName: null,
        author: { name: "Pat", email: "p@x.com" },
      })
    ).toBe("Pat")
  })

  it("falls back to email local part", () => {
    expect(
      getPostAuthorDisplayName({
        author: { name: null, email: "hello@cran.ai" },
      })
    ).toBe("hello")
  })

  it("defaults when empty", () => {
    expect(getPostAuthorDisplayName({ author: null })).toBe("Cran Team")
  })
})
