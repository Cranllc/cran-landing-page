/**
 * Allowed admin mailboxes (getcran.ai / cran-us.com trees).
 *
 * Used when requesting a magic link (server `signIn` + optional client pre-check on the form).
 * After a link is sent, the callback trusts the verified token; we don’t re-check here on every page.
 */
function isUnderApex(host: string, apex: string): boolean {
  return host === apex || host === `www.${apex}` || host.endsWith(`.${apex}`)
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  let normalized = email
    .normalize("NFKC")
    .replace(/\u00a0|\u202f|\u2007/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase()
  const at = normalized.lastIndexOf("@")
  if (at < 1 || at === normalized.length - 1) return false
  const domain = normalized.slice(at + 1)
  return isUnderApex(domain, "getcran.ai") || isUnderApex(domain, "cran-us.com")
}
