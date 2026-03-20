import { handlers } from "@/auth"

/** Prisma + NextAuth must run in Node (not Edge). */
export const runtime = "nodejs"

export const { GET, POST } = handlers
