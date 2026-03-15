import { NextResponse } from "next/server"
import { Resend } from "resend"

/** Test Resend delivery. Sends test email & returns any error. Only allows @getcran.ai / @cran-us.com to prevent abuse. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const to = searchParams.get("to") || "tyler@cran-us.com"
  if (!to.endsWith("@getcran.ai") && !to.endsWith("@cran-us.com")) {
    return NextResponse.json({ error: "Only @getcran.ai or @cran-us.com addresses allowed." }, { status: 403 })
  }
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 })
  }
  const resend = new Resend(apiKey)
  const from = process.env.AUTH_FROM_EMAIL || "Cran <no-reply@cran-us.com>"
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Resend Test",
    html: "<p>If you received this, Resend is working.</p>",
  })
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}
