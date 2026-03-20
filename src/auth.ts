import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { Resend as ResendSDK } from "resend"
import { prisma } from "@/lib/prisma"
import { prismaAdapterWithCaseInsensitiveEmail } from "@/lib/prisma-auth-adapter"
import { isAllowedAdminEmail } from "@/lib/admin-email"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  adapter: prismaAdapterWithCaseInsensitiveEmail(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.AUTH_FROM_EMAIL || "Cran <no-reply@cran-us.com>",
      async sendVerificationRequest({ identifier, url }) {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
          console.error("[Auth] RESEND_API_KEY is not set")
          throw new Error("Email provider not configured")
        }
        const from = process.env.AUTH_FROM_EMAIL || "Cran <no-reply@cran-us.com>"
        const resend = new ResendSDK(apiKey)
        const parsed = new URL(url)
        const params = new URLSearchParams(parsed.search)
        // Strip callbackUrl from link — nested URLs can trigger Chrome's phishing heuristics.
        // Keep the SAME origin Auth.js used for this token (localhost, preview, www, etc.). Replacing
        // with SITE_URL sent dev users to production while tokens lived in local DB → verify always failed.
        params.delete("callbackUrl")
        const magicLink = `${parsed.origin}${parsed.pathname}?${params.toString()}`
        const { error } = await resend.emails.send({
          from,
          to: identifier,
          subject: "Sign in to Cran CMS",
          html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome back to Cran</h2>
            <p>Click the secure link below to sign in to your CMS dashboard.</p>
            <a href="${magicLink}" style="background-color: #D64436; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px; font-weight: bold;">Sign In Securely</a>
            <p style="color: #666; margin-top: 24px; font-size: 14px;">If you did not request this email, you can safely ignore it.</p>
          </div>`,
        })
        if (error) {
          console.error("[Auth] Resend error:", error)
          throw new Error("Resend error: " + JSON.stringify(error))
        }
      },
    }),
  ],
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  /**
   * JWT sessions with Prisma adapter: users / verification tokens stay in Postgres; the session
   * cookie is an encrypted JWT. We keep a minimal `jwt` callback so `sub` / `email` from the DB user
   * are always copied into the token on sign-in (avoids empty `session.user.email` on `/admin`).
   */
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.id != null) token.sub = String(user.id)
        if (typeof user.email === "string" && user.email) token.email = user.email
        if (typeof user.name === "string") token.name = user.name
        if (user.image != null) token.picture = user.image
      }
      return token
    },
    async signIn({ user, account, profile }) {
      const fromUser = typeof user?.email === "string" ? user.email : ""
      const fromAccount =
        account?.type === "email" && typeof account.providerAccountId === "string"
          ? account.providerAccountId
          : ""
      const fromProfile =
        profile && typeof (profile as { email?: string }).email === "string"
          ? (profile as { email: string }).email
          : ""
      const candidate = (fromUser || fromAccount || fromProfile).trim()
      const ok = isAllowedAdminEmail(candidate || undefined)
      if (!ok && process.env.NODE_ENV === "development") {
        console.warn(
          "[auth] signIn denied — resolved email empty or not allowlisted. Check User.email casing vs login address."
        )
      }
      return ok
    },
    async session({ session, token }) {
      const te = typeof token.email === "string" ? token.email.trim() : ""
      const se = typeof session.user?.email === "string" ? session.user.email.trim() : ""
      const email = se || te || undefined
      return {
        user: {
          name: session.user?.name ?? (typeof token.name === "string" ? token.name : undefined),
          email,
          image:
            session.user?.image ??
            (typeof token.picture === "string" ? token.picture : undefined),
        },
        expires: session.expires?.toISOString?.() ?? session.expires,
      }
    },
    async redirect({ url, baseUrl: authBaseUrl }) {
      const origin = authBaseUrl.replace(/\/$/, "")
      if (url.startsWith("/")) return `${origin}${url}`
      try {
        if (new URL(url).origin === origin) return url
      } catch {}
      return `${origin}/admin`
    },
  },
})
