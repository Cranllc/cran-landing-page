import { describe, expect, it } from "vitest"
import { isAllowedAdminEmail } from "./admin-email"

describe("isAllowedAdminEmail", () => {
  it("allows apex and case-insensitive", () => {
    expect(isAllowedAdminEmail("a@getcran.ai")).toBe(true)
    expect(isAllowedAdminEmail("A@GETCRAN.AI")).toBe(true)
    expect(isAllowedAdminEmail("x@cran-us.com")).toBe(true)
  })

  it("allows www host aliases", () => {
    expect(isAllowedAdminEmail("u@www.getcran.ai")).toBe(true)
    expect(isAllowedAdminEmail("u@www.cran-us.com")).toBe(true)
  })

  it("allows subdomains under managed apex", () => {
    expect(isAllowedAdminEmail("u@mail.cran-us.com")).toBe(true)
    expect(isAllowedAdminEmail("u@team.getcran.ai")).toBe(true)
  })

  it("rejects other domains", () => {
    expect(isAllowedAdminEmail("a@gmail.com")).toBe(false)
    expect(isAllowedAdminEmail("a@notcran-us.com")).toBe(false)
    expect(isAllowedAdminEmail("a@evilgetcran.ai")).toBe(false)
  })

  it("rejects empty and malformed", () => {
    expect(isAllowedAdminEmail("")).toBe(false)
    expect(isAllowedAdminEmail(null)).toBe(false)
    expect(isAllowedAdminEmail(undefined)).toBe(false)
    expect(isAllowedAdminEmail("@getcran.ai")).toBe(false)
    expect(isAllowedAdminEmail("nope")).toBe(false)
  })
})
