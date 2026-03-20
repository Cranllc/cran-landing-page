/**
 * Emails allowed to use the CMS / admin APIs.
 *
 * **Only the domain matters** — any mailbox is OK (`accounts@`, `tyler@`, etc.) as long as the
 * domain is **`getcran.ai`** or **`cran-us.com`** (or the same with a **`www.`** prefix).
 * Other subdomains like `mail.cran-us.com` are not allowed.
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
  // Treat www.* like the apex domain (some orgs use www in MX / aliases; site canonical is www.getcran.ai)
  const root =
    domain === "www.getcran.ai"
      ? "getcran.ai"
      : domain === "www.cran-us.com"
        ? "cran-us.com"
        : domain
  return root === "getcran.ai" || root === "cran-us.com"
}
