/**
 * Emails allowed to use the CMS / admin APIs.
 *
 * **Only the host matters** — any mailbox is OK as long as the domain is the apex or a
 * **subdomain** of **`getcran.ai`** or **`cran-us.com`** (e.g. `you@cran-us.com`,
 * `you@mail.cran-us.com`, `you@www.getcran.ai`). Matching is case-insensitive.
 */
function isUnderApex(host: string, apex: string): boolean {
  return host === apex || host === `www.${apex}` || host.endsWith(`.${apex}`)
}

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
  return isUnderApex(domain, "getcran.ai") || isUnderApex(domain, "cran-us.com")
}
