import { auth, signOut } from "@/auth"
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

  const email = session?.user?.email || ""
  if (!email.endsWith("@getcran.ai") && !email.endsWith("@cran-us.com")) {
    redirect("/auth/signin?error=AccessDenied")
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      {/* Admin Navbar */}
      <header className="h-[68px] border-b border-[#E5E5E0] bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-cran rounded-lg shadow-sm flex items-center justify-center group-hover:bg-[#B83A2E] transition-colors">
              <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-lg tracking-tight">Cran Blog Admin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
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
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 shrink-0 rounded-lg px-2 py-1.5 sm:px-3 text-sm font-semibold text-cran hover:bg-cran/10 hover:text-[#B83A2E] transition-colors whitespace-nowrap"
          >
            <Home className="w-4 h-4 shrink-0" strokeWidth={2.25} aria-hidden />
            View site
          </Link>
          <div className="text-[13px] font-medium text-[#1a1a1a]/60 max-w-[100px] sm:max-w-[180px] lg:max-w-[220px] truncate" title={email}>
            {email}
          </div>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit" className="text-[13px] font-semibold text-cran hover:text-[#B83A2E] bg-cran/10 hover:bg-cran/20 px-3 py-1.5 rounded-md transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl pt-8 pb-32 md:py-12 px-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E0] z-50 flex items-center justify-around px-1 pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Link href="/admin" className="flex flex-col items-center gap-1 p-2.5 text-[#1a1a1a]/60 hover:text-cran transition-colors active:scale-95 flex-1 text-center min-w-0">
          <LayoutDashboard strokeWidth={2.5} size={20} className="opacity-80 shrink-0" />
          <span className="text-[9px] font-bold tracking-wide uppercase truncate w-full">Posts</span>
        </Link>
        <Link href="/admin/post-assets" className="flex flex-col items-center gap-1 p-2.5 text-[#1a1a1a]/60 hover:text-cran transition-colors active:scale-95 flex-1 text-center min-w-0">
          <Images strokeWidth={2.5} size={20} className="opacity-80 shrink-0" />
          <span className="text-[9px] font-bold tracking-wide uppercase truncate w-full">Images</span>
        </Link>
        <Link href="/admin/waitlist" className="flex flex-col items-center gap-1 p-2.5 text-[#1a1a1a]/60 hover:text-cran transition-colors active:scale-95 flex-1 text-center min-w-0">
          <ClipboardList strokeWidth={2.5} size={20} className="opacity-80 shrink-0" />
          <span className="text-[9px] font-bold tracking-wide uppercase truncate w-full">Waitlist</span>
        </Link>
      </nav>
    </div>
  )
}
