import { NextResponse } from "next/server"
import { Resend } from "resend"

/** Development-only endpoint to test Resend. GET /api/debug-resend?to=tyler@getcran.ai */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const to = searchParams.get("to") || "tyler@getcran.ai"
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 })
  }
  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: "Cran <no-reply@getcran.ai>",
    to,
    subject: "Resend Test",
    html: "<p>If you received this, Resend is working.</p>",
  })
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}
