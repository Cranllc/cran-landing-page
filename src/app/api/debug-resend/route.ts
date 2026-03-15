import { NextResponse } from "next/server"
import { Resend } from "resend"

/** Test Resend delivery. In dev: sends test email & returns any error. In prod: runs locally for diagnosis. */
export async function GET(req: Request) {
  const isDev = process.env.NODE_ENV === "development"
  if (!isDev) {
    return NextResponse.json({
      error: "Run locally (npm run dev) and open this URL to see the Resend error.",
      hint: "The diagnostic only works in development.",
    }, { status: 200 })
  }
  const { searchParams } = new URL(req.url)
  const to = searchParams.get("to") || "tyler@getcran.ai"
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
