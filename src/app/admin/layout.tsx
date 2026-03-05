import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { LayoutDashboard, ClipboardList } from "lucide-react"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  const email = session?.user?.email || ""
  if (!email.endsWith("@cran.ai") && !email.endsWith("@cran-us.com")) {
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
            <span className="font-bold text-lg tracking-tight">cran CMS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-semibold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">
              Blog Posts
            </Link>
            <Link href="/admin/waitlist" className="text-sm font-semibold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors items-center flex gap-1.5">
              Waitlist <span className="px-1.5 py-0.5 rounded bg-cran/10 text-cran text-[10px] font-bold uppercase tracking-wider">New</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-[13px] font-medium text-[#1a1a1a]/60">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E0] z-50 flex items-center justify-around px-2 pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Link href="/admin" className="flex flex-col items-center gap-1.5 p-3 text-[#1a1a1a]/60 hover:text-cran transition-colors active:scale-95 flex-1 text-center">
          <LayoutDashboard strokeWidth={2.5} size={22} className="opacity-80" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Posts</span>
        </Link>
        <Link href="/admin/waitlist" className="flex flex-col items-center gap-1.5 p-3 text-[#1a1a1a]/60 hover:text-cran transition-colors active:scale-95 flex-1 text-center">
          <div className="relative">
            <ClipboardList strokeWidth={2.5} size={22} className="opacity-80" />
            <div className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-cran shadow-[0_0_8px_rgba(214,68,54,0.6)]"></div>
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">Waitlist</span>
        </Link>
      </nav>
    </div>
  )
}
