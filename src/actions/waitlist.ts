"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyAdmin() {
  const session = await auth()
  const user = session?.user
  
  if (!user || !user.email || (!user.email.endsWith("@getcran.ai") && !user.email.endsWith("@cran-us.com"))) {
    throw new Error("Unauthorized")
  }
  
  return user
}

export async function joinWaitlist(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." }
  }

  try {
    await (prisma as any).waitlist.create({
      data: { email }
    })
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: true }
    }
    console.error("Waitlist error:", error)
    return { error: "Something went wrong. Please try again later." }
  }
}

export async function sendWaitlistBlast(subject: string, message: string) {
  try {
    await verifyAdmin()
    
    if (!subject || !message) return { error: "Subject and message are required." }
    
    // Fetch all waitlist emails
    const signups = await (prisma as any).waitlist.findMany({ select: { email: true } })
    const emails = signups.map((s: any) => s.email)
    
    if (!emails.length) return { error: "No one on the waitlist yet!" }
    
    // Draft the email batch payload
    const batchList = emails.map((email: string) => ({
      from: "Cran Updates <no-reply@getcran.ai>",
      to: [email],
      replyTo: "no-reply@getcran.ai",
      subject: subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px 24px; color: #1a1a1a; max-width: 600px; margin: 0 auto; line-height: 1.6; background-color: #FAFAF8; border-radius: 12px; border: 1px solid #E5E5E0;">
          <div style="margin-bottom: 32px;">
            <strong style="font-size: 20px; letter-spacing: -0.5px;">Cran Animal AI Shelter Software</strong>
          </div>
          <div style="font-size: 16px;">
            ${message.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')}
          </div>
          <div style="margin-top: 48px; border-top: 1px solid #E5E5E0; padding-top: 24px; font-size: 13px; color: #8B939C;">
            You are receiving this update because you joined the Waitlist for Cran LLC.
          </div>
        </div>
      `
    }))

    // Send emails utilizing Resend's fast batch API
    const { error } = await resend.batch.send(batchList)
    
    if (error) {
      console.error(error)
      return { error: error.message }
    }
    
    return { success: true, count: emails.length }
  } catch (err: any) {
    console.error(err)
    return { error: err.message || "Something went wrong while sending the blast." }
  }
}
