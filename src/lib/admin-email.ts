/**
 * Emails allowed to use the CMS / admin APIs.
 * Domain match is case-insensitive (Resend / IdPs may vary casing).
 */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  const at = normalized.lastIndexOf("@")
  if (at < 1 || at === normalized.length - 1) return false
  const domain = normalized.slice(at + 1)
  return domain === "getcran.ai" || domain === "cran-us.com"
}
