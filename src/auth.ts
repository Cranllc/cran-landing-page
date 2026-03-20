import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { Resend as ResendSDK } from "resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/site-config"
import { isAllowedAdminEmail } from "@/lib/admin-email"

const baseUrl = SITE_URL.replace(/\/$/, "")

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
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
        // Redirect callback below defaults to /admin for magic-link sign-ins.
        params.delete("callbackUrl")
        const magicLink = `${baseUrl}${parsed.pathname}?${params.toString()}`
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      return isAllowedAdminEmail(user.email)
    },
    /** JWT strategy: persist email on the token so `session.user.email` is always set for admin gates. */
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email
      return token
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === "string") {
        session.user.email = token.email
      }
      return session
    },
    async redirect({ url }) {
      const siteBase = baseUrl
      if (url.startsWith("/")) return `${siteBase}${url}`
      try {
        if (new URL(url).origin === siteBase) return url
      } catch {}
      return `${siteBase}/admin`
    },
  },
})
