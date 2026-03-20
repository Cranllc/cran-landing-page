import { describe, expect, it } from "vitest"
import { sanitizeMarkdownPasteArtifacts } from "./sanitize-markdown-paste"

describe("sanitizeMarkdownPasteArtifacts", () => {
  it("unwraps ](url)https://…](url) style paste", () => {
    const raw =
      "See ](url)https://www.cabidigitallibrary.org/doi/10.1079/hai.2025.0042](url) for details."
    const out = sanitizeMarkdownPasteArtifacts(raw)
    expect(out).toContain("https://www.cabidigitallibrary.org/doi/10.1079/hai.2025.0042")
    expect(out).not.toContain("](url)")
  })

  it("handles case-insensitive (url)", () => {
    expect(sanitizeMarkdownPasteArtifacts("x ](URL)https://example.com/path y")).toBe(
      "x https://example.com/path y"
    )
  })

  it("strips trailing ](url) after URL", () => {
    expect(sanitizeMarkdownPasteArtifacts("https://example.com/foo](url)")).toBe(
      "https://example.com/foo"
    )
  })
})
