"use server"

import { prisma } from "@/lib/prisma"

export async function joinWaitlist(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." }
  }

  try {
    await prisma.waitlist.create({
      data: { email }
    })
    return { success: true }
  } catch (error: any) {
    // P2002 is the Prisma error code for unique constraint violation
    if (error.code === 'P2002') {
      return { success: true } // If they are already on the waitlist, pretend it succeeded.
    }
    console.error("Waitlist error:", error)
    return { error: "Something went wrong. Please try again later." }
  }
}
