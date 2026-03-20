"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { ArrowRight, Home, Lock } from "lucide-react"

function signInErrorMessage(raw: string | null | undefined): string {
  const code = typeof raw === "string" ? raw : ""
  if (code.includes("AccessDenied")) {
    return "That address isn’t allowed for admin. Use a mailbox on getcran.ai or cran-us.com (including subdomains like mail.cran-us.com), e.g. you@getcran.ai or accounts@cran-us.com."
  }
  return "We couldn’t send the sign-in email. Please try again in a moment."
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMessage(null)

    try {
      const res = await signIn("resend", { 
        email, 
        redirect: false
      })

      if (res?.error) {
        setStatus("error")
        const raw =
          typeof res.error === "string" ? res.error : (res as { error?: string }).error ?? null
        setErrorMessage(signInErrorMessage(raw))
      } else {
        setStatus("success")
        // NOTE: For Magic Links, NextAuth doesn't automatically log you in right here. 
        // It just sends the email. So we show the "Check your inbox" screen.
        // The actual redirect to /admin happens WHEN THEY CLICK THE LINK IN THEIR EMAIL.
      }
    } catch (err) {
      console.error(err)
      setStatus("error")
      setErrorMessage(signInErrorMessage(err instanceof Error ? err.message : null))
    }
  }

  return (
    <div className="min-h-screen bg-white text-charcoal font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link
        href="/"
        className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]/60 hover:text-cran transition-colors"
      >
        <Home className="w-4 h-4 shrink-0" strokeWidth={2.25} aria-hidden />
        Back to site
      </Link>

      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cran/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo Mark */}
        <div className="w-12 h-12 bg-cran rounded-xl shadow-lg flex items-center justify-center mb-8 shrink-0">
          <div className="w-4 h-4 bg-white rounded-[3px]"></div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-center mb-2 text-[#1a1a1a]">Welcome back.</h1>
        <p className="text-[#1a1a1a]/50 text-center mb-8 font-medium">Enter your email to receive a secure login link.</p>
        <div className="w-full bg-white border border-charcoal/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-cran/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-cran rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Check your inbox</h3>
              <p className="text-[#1a1a1a]/60 text-sm leading-relaxed">
                We sent a magic link to <span className="font-semibold text-[#1a1a1a]">{email}</span>. Click it to securely log in to your dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/40 mb-2">
                  <Lock size={12} /> Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === "error") {
                      setStatus("idle")
                      setErrorMessage(null)
                    }
                  }}
                disabled={status === "loading"}
                  placeholder="you@getcran.ai"
                  required
                  autoFocus
                  className="w-full h-12 rounded-xl border border-charcoal/10 bg-[#FAFAF8] px-4 text-[15px] font-medium text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-cran/50 focus:ring-2 focus:ring-cran/20 focus:bg-white transition-all disabled:opacity-50"
                />
                <p className="mt-2 text-[11px] font-medium text-[#1a1a1a]/40">
                  Allowed: <span className="text-[#1a1a1a]/55">*.getcran.ai</span> ·{" "}
                  <span className="text-[#1a1a1a]/55">*.cran-us.com</span>
                </p>
              </div>

              {status === "error" && errorMessage && (
                <div
                  className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"
                  role="alert"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="group w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-charcoal px-6 text-[15px] font-bold text-white transition-all hover:bg-black shadow-md shadow-charcoal/10 disabled:opacity-50 mt-2"
              >
                {status === "loading" ? (
                  "Sending Link..."
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight size={16} className="text-white/60 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
