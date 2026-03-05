import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.email?.endsWith("@cran.ai")) {
    redirect("/auth/signin?error=AccessDenied")
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      {/* Admin Navbar */}
      <header className="h-[68px] border-b border-[#E5E5E0] bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cran rounded-lg shadow-sm flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-lg tracking-tight">cran CMS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-[13px] font-medium text-[#1a1a1a]/60">
            {session.user.email}
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
      <main className="mx-auto max-w-5xl py-12 px-6">
        {children}
      </main>
    </div>
  )
}
