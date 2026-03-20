/**
 * Auth environment validation — keep magic-link + JWT behavior predictable.
 * Used by instrumentation (runtime); see docs/auth-production.md.
 */

const MIN_SECRET_LEN = 16

export function getAuthEnvIssues(): string[] {
  const issues: string[] = []

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < MIN_SECRET_LEN) {
    issues.push(
      `AUTH_SECRET must be set and at least ${MIN_SECRET_LEN} characters (use a long random string; rotate = invalidate all sessions).`
    )
  }

  const authUrl = (process.env.AUTH_URL || process.env.NEXTAUTH_URL || "").trim()
  if (!authUrl) {
    issues.push(
      "Set AUTH_URL (or NEXTAUTH_URL) to your canonical public origin, e.g. https://www.getcran.ai — NextAuth rewrites requests to this host for links and cookies."
    )
  } else {
    try {
      const u = new URL(authUrl)
      const path = u.pathname.replace(/\/$/, "") || "/"
      // NextAuth merges origin from AUTH_URL; path should be / only (basePath is /api/auth in code).
      if (path !== "/" && path !== "/api/auth") {
        issues.push(
          `AUTH_URL should be the site origin only (e.g. https://www.getcran.ai), not path "${u.pathname}". This app sets basePath=/api/auth in code.`
        )
      }
      if (u.protocol !== "https:" && process.env.NODE_ENV === "production") {
        issues.push("AUTH_URL should use https: in production.")
      }
      if (u.hostname.endsWith(".vercel.app")) {
        issues.push(
          "AUTH_URL must not point at *.vercel.app for the deployment users actually use (e.g. www.getcran.ai), or magic links and cookies will target the wrong host."
        )
      }
      const cookieDom = (process.env.AUTH_COOKIE_DOMAIN || "").trim()
      if (cookieDom && process.env.VERCEL_ENV === "preview") {
        issues.push(
          "AUTH_COOKIE_DOMAIN is set on a Vercel Preview — remove it for preview (*.vercel.app) or session cookies may not stick. Use it on Production only."
        )
      }
    } catch {
      issues.push("AUTH_URL / NEXTAUTH_URL is not a valid URL.")
    }
  }

  const publicSite = (process.env.NEXT_PUBLIC_SITE_URL || "").trim()
  if (publicSite && authUrl) {
    try {
      const a = new URL(authUrl).origin
      const p = new URL(publicSite).origin
      if (a !== p) {
        issues.push(
          `NEXT_PUBLIC_SITE_URL origin (${p}) should match AUTH_URL origin (${a}) so SEO/metadata and auth see the same host.`
        )
      }
    } catch {
      /* ignore */
    }
  }

  if (!process.env.RESEND_API_KEY) {
    issues.push("RESEND_API_KEY is required for Resend magic links.")
  }

  return issues
}

/** Log once on Node server startup (instrumentation). Does not throw. */
export function logAuthEnvOnStartup(): void {
  if (process.env.NODE_ENV !== "production") return
  const issues = getAuthEnvIssues()
  if (issues.length === 0) return
  console.error("[auth-env] Misconfiguration detected:\n", issues.map((s) => `  - ${s}`).join("\n"))
}
