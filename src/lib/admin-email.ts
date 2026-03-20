/**
 * Emails allowed to use the CMS / admin APIs.
 *
 * **Only the domain matters** — any mailbox is OK (`accounts@`, `tyler@`, etc.) as long as the
 * domain is exactly **`getcran.ai`** or **`cran-us.com`** (e.g. `team@getcran.ai`, `accounts@cran-us.com`).
 * Subdomains like `mail.cran-us.com` are not allowed — only these two root domains.
 * Matching is case-insensitive on the full address.
 */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  let normalized = email
    .replace(/\u00a0|\u202f|\u2007/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase()
  const at = normalized.lastIndexOf("@")
  if (at < 1 || at === normalized.length - 1) return false
  const domain = normalized.slice(at + 1)
  return domain === "getcran.ai" || domain === "cran-us.com"
}
