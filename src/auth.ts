import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Password",
      credentials: {
        password: { label: "Admin Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple fixed password check for the single admin
        if (!process.env.ADMIN_PASSWORD) {
          console.error("ADMIN_PASSWORD is not set in environment variables.")
          return null
        }
        
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          // Return a mock user object representing the single admin
          return { id: "1", name: "Cran Admin", email: "admin@cran.ai" }
        }
        
        return null // Failed login
      }
    })
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
      if (user.email === "admin@cran.ai") return true
      return false
    },
  },
})
