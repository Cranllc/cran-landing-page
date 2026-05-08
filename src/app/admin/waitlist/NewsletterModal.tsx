"use client"

import { useState, useTransition } from "react"
import { sendWaitlistBlast } from "@/actions/waitlist"
import { Loader2, Mail } from "lucide-react"

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null)

  const handleSend = () => {
    if (!subject || !message) {
      setStatus({ type: 'error', msg: "Please fill out both subject and message." })
      return
    }

    setStatus(null)
    startTransition(async () => {
      const result = await sendWaitlistBlast(subject, message)
      if (result.error) {
        setStatus({ type: 'error', msg: result.error })
      } else {
        setStatus({ type: 'success', msg: `Successfully blasted to ${result.count} shelters!` })
        setTimeout(() => {
          setIsOpen(false)
          setSubject("")
          setMessage("")
          setStatus(null)
        }, 3000)
      }
    })
  }

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 min-h-11 w-full sm:w-auto bg-[#1a1a1a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 touch-manipulation"
      >
        <Mail size={16} />
        Send Update
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#FAFAF8]/90 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[env(safe-area-inset-top,0px)] pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pb-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E5E5E0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[min(92dvh,900px)] sm:max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-[#E5E5E0] flex items-center justify-between bg-[#FAFAF8] shrink-0">
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Send Newsletter Update</h3>
                <p className="text-sm font-medium text-[#1a1a1a]/50 mt-0.5">Blast an email to everyone who signed up for pilot updates.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] min-h-11 min-w-11 inline-flex items-center justify-center p-2 bg-white rounded-md border border-[#E5E5E0] hover:bg-[#FAFAF8] transition-colors touch-manipulation shrink-0"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 overflow-y-auto">
              {status && (
                <div className={`p-4 rounded-lg text-sm font-semibold border ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {status.msg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a]/60">Email Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Exciting Beta Launch News!"
                  className="w-full bg-[#FAFAF8] border border-[#E5E5E0] rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20 text-[#1a1a1a] font-medium transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a]/60 flex justify-between">
                  <span>Message Body</span>
                  <span className="text-[#1a1a1a]/30 lowercase font-medium tracking-normal">(Line breaks will be preserved)</span>
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hello Shelters,\n\nWe are extremely excited to announce that Cran is now entering closed beta...!"
                  className="w-full min-h-[200px] sm:min-h-[250px] bg-[#FAFAF8] border border-[#E5E5E0] rounded-lg px-4 py-3 text-base sm:text-sm outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20 text-[#1a1a1a] font-medium transition-all resize-none"
                />
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-[#E5E5E0] bg-[#FAFAF8] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="min-h-11 px-5 py-2.5 text-sm font-semibold text-[#1a1a1a]/60 hover:text-[#1a1a1a] bg-white hover:bg-[#F0F0ED] rounded-lg transition-colors border border-[#E5E5E0] touch-manipulation"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSend}
                disabled={isPending || status?.type === 'success'}
                className="flex items-center justify-center gap-2 min-h-11 bg-cran text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B83A2E] transition-all shadow-sm disabled:opacity-50 sm:min-w-[140px] touch-manipulation"
              >
                {isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending Blast...</>
                ) : status?.type === 'success' ? (
                  "Sent!"
                ) : (
                  "Blast Newsletter"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
