/**
 * Strip Word / RTF / publisher paste junk so URLs become plain `https://…` strings.
 * remark-gfm then autolinks them and they pick up Cran link styles.
 *
 * Example broken paste: `](url)https://www.cabidigitallibrary.org/doi/...](url)`
 */
export function sanitizeMarkdownPasteArtifacts(markdown: string): string {
  let s = markdown

  // `](url)` immediately before a URL, optional duplicate `](url)` after (case-insensitive "url")
  s = s.replace(/\]\(\s*url\s*\)\s*(https?:\/\/[^\s<>"'`\[\]]+)/gi, "$1")
  s = s.replace(/(https?:\/\/[^\s<>"'`\[\]]+?)\s*\]\(\s*url\s*\)/gi, "$1")

  // Stray `](url)` tokens left on their own line or after text
  s = s.replace(/\s*\]\(\s*url\s*\)\s*/gi, " ")

  return s
}
