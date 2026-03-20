import { PrismaAdapter } from "@auth/prisma-adapter"
import type { PrismaClient } from "@prisma/client"

/**
 * Auth.js email flow lowercases the address, but Postgres `User.email` lookups are
 * case-sensitive by default. If the DB has `Tyler@cran-us.com` and the token carries
 * `tyler@cran-us.com`, `findUnique` misses → fragile user state and `signIn` can see
 * inconsistent `user` shapes. Use case-insensitive matching for email login.
 */
export function prismaAdapterWithCaseInsensitiveEmail(prisma: PrismaClient) {
  const base = PrismaAdapter(prisma)
  return {
    ...base,
    async getUserByEmail(email: string) {
      const trimmed = email?.trim()
      if (!trimmed) return null
      return prisma.user.findFirst({
        where: {
          email: { equals: trimmed, mode: "insensitive" },
        },
      })
    },
  }
}
