"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock } from "lucide-react"

export default function SignIn() {
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setStatus("loading")

    try {
      const res = await signIn("credentials", { 
        password, 
        redirect: false 
      })

      if (res?.error) {
        setStatus("error")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-white text-charcoal font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cran/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo Mark */}
        <div className="w-12 h-12 bg-cran rounded-xl shadow-lg flex items-center justify-center mb-8 shrink-0">
          <div className="w-4 h-4 bg-white rounded-[3px]"></div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-center mb-2 text-[#1a1a1a]">Welcome back.</h1>
        <p className="text-[#1a1a1a]/50 text-center mb-8 font-medium">Enter your admin password to manage content.</p>

        <div className="w-full bg-white border border-charcoal/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/40 mb-2">
                <Lock size={12} /> Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (status === "error") setStatus("idle")
                }}
                disabled={status === "loading"}
                placeholder="••••••••••••"
                required
                autoFocus
                className="w-full h-12 rounded-xl border border-charcoal/10 bg-[#FAFAF8] px-4 text-[15px] font-medium text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-cran/50 focus:ring-2 focus:ring-cran/20 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>

            {status === "error" && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                Incorrect password. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !password}
              className="group w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-charcoal px-6 text-[15px] font-bold text-white transition-all hover:bg-black shadow-md shadow-charcoal/10 disabled:opacity-50 mt-2"
            >
              {status === "loading" ? (
                "Verifying..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="text-white/60 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
