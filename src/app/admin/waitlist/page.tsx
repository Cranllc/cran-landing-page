import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import NewsletterModal from "./NewsletterModal"

export const metadata = {
  title: "Waitlist Signups",
  robots: { index: false, follow: false },
}

export default async function WaitlistPage() {
  const session = await auth()
  const email = session?.user?.email || ""
  
  if (!email.endsWith("@getcran.ai") && !email.endsWith("@cran-us.com")) {
    redirect("/auth/signin?error=AccessDenied")
  }

  const signups = await (prisma as any).waitlist.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-4 sm:p-8 md:p-12 max-w-6xl mx-auto h-full overflow-y-auto pb-32">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] mb-2">Waitlist Signups</h1>
          <p className="text-[#1a1a1a]/60 font-medium">
            {signups.length} total shelters have expressed interest.
          </p>
        </div>
        
        <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
          <NewsletterModal />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E0] overflow-hidden">
        {signups.length === 0 ? (
          <div className="p-12 text-center text-[#1a1a1a]/50">
            No waitlist signups yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1a1a1a]">
              <thead className="text-xs uppercase bg-[#FAFAF8] text-[#1a1a1a]/50 font-bold tracking-wider border-b border-[#E5E5E0]">
                <tr>
                  <th className="px-6 py-4">Participant Email</th>
                  <th className="px-6 py-4 whitespace-nowrap">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {signups.map((signup: { id: string, email: string, createdAt: Date }) => (
                  <tr key={signup.id} className="hover:bg-[#FAFAF8]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#1a1a1a]">
                      {signup.email}
                    </td>
                    <td className="px-6 py-4 text-[#1a1a1a]/60 whitespace-nowrap">
                      {new Date(signup.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
