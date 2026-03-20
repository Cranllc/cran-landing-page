import { auth, signOut } from "@/auth"
import { isAllowedAdminEmail } from "@/lib/admin-email"
import { redirect } from "next/navigation"
import { LayoutDashboard, ClipboardList, Images, Home } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog Admin",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // No cookie / session: not "wrong email" — avoid ?error=AccessDenied (that implies allowlist reject).
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const email = session.user.email || ""
  if (!isAllowedAdminEmail(email)) {
    redirect("/auth/signin?error=AccessDenied")
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF8] text-[#1a1a1a] flex flex-col">
      {/* Admin Navbar */}
      <header className="min-h-[3.5rem] sm:h-[68px] border-b border-[#E5E5E0] bg-white flex items-center justify-between gap-2 px-3 sm:px-6 py-2 sm:py-0 pt-[max(0.5rem,env(safe-area-inset-top,0px))] sm:pt-0 sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-10 min-w-0 flex-1">
          <Link href="/admin" className="flex items-center gap-2 sm:gap-3 group min-w-0 touch-manipulation">
            <div className="w-8 h-8 sm:w-7 sm:h-7 shrink-0 bg-cran rounded-lg shadow-sm flex items-center justify-center group-hover:bg-[#B83A2E] transition-colors">
              <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-[15px] sm:text-lg tracking-tight truncate">
              <span className="sm:hidden">Cran Admin</span>
              <span className="hidden sm:inline">Cran Blog Admin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 shrink-0">
            <Link href="/admin" className="text-sm font-semibold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">
              Blog Posts
            </Link>
            <Link href="/admin/post-assets" className="text-sm font-semibold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">
              Post images
            </Link>
            <Link href="/admin/waitlist" className="text-sm font-semibold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">
              Waitlist
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 min-w-0 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg min-h-11 min-w-11 sm:min-w-0 sm:px-3 px-2 text-sm font-semibold text-cran hover:bg-cran/10 hover:text-[#B83A2E] transition-colors touch-manipulation"
            aria-label="View site"
          >
            <Home className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="hidden sm:inline">View site</span>
          </Link>
          <div className="hidden min-[420px]:block text-[12px] sm:text-[13px] font-medium text-[#1a1a1a]/60 max-w-[88px] sm:max-w-[180px] lg:max-w-[220px] truncate" title={email}>
            {email}
          </div>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button
              type="submit"
              className="text-[11px] sm:text-[13px] font-semibold text-cran hover:text-[#B83A2E] bg-cran/10 hover:bg-cran/20 px-2.5 sm:px-3 min-h-11 sm:min-h-0 sm:py-1.5 py-2 rounded-md transition-colors touch-manipulation whitespace-nowrap"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main: extra bottom padding for fixed mobile tab bar + safe area */}
      <main className="flex flex-col flex-1 min-h-0 mx-auto max-w-5xl w-full pt-4 sm:pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 md:pt-12 px-3 sm:px-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation — 44px+ touch targets */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E0] z-50 flex items-stretch justify-around px-1 pt-1"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <Link
          href="/admin"
          className="flex flex-col items-center justify-center gap-0.5 py-2 min-h-[3.25rem] text-[#1a1a1a]/60 hover:text-cran active:text-cran flex-1 text-center min-w-0 touch-manipulation"
        >
          <LayoutDashboard strokeWidth={2.5} size={22} className="opacity-80 shrink-0" />
          <span className="text-[10px] font-bold tracking-wide uppercase truncate w-full px-0.5">Posts</span>
        </Link>
        <Link
          href="/admin/post-assets"
          className="flex flex-col items-center justify-center gap-0.5 py-2 min-h-[3.25rem] text-[#1a1a1a]/60 hover:text-cran active:text-cran flex-1 text-center min-w-0 touch-manipulation"
        >
          <Images strokeWidth={2.5} size={22} className="opacity-80 shrink-0" />
          <span className="text-[10px] font-bold tracking-wide uppercase truncate w-full px-0.5">Images</span>
        </Link>
        <Link
          href="/admin/waitlist"
          className="flex flex-col items-center justify-center gap-0.5 py-2 min-h-[3.25rem] text-[#1a1a1a]/60 hover:text-cran active:text-cran flex-1 text-center min-w-0 touch-manipulation"
        >
          <ClipboardList strokeWidth={2.5} size={22} className="opacity-80 shrink-0" />
          <span className="text-[10px] font-bold tracking-wide uppercase truncate w-full px-0.5">Waitlist</span>
        </Link>
      </nav>
    </div>
  )
}
