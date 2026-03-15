import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { Resend as ResendSDK } from "resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
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
        const { error } = await resend.emails.send({
          from,
          to: identifier,
          subject: "Sign in to Cran CMS",
          html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome back to Cran</h2>
            <p>Click the secure link below to sign in to your CMS dashboard.</p>
            <a href="${url}" style="background-color: #D64436; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px; font-weight: bold;">Sign In Securely</a>
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
      if (!user.email) return false
      return user.email.endsWith("@getcran.ai") || user.email.endsWith("@cran-us.com")
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Force all logins to go to the admin dashboard by default
      return `${baseUrl}/admin`
    },
  },
})
