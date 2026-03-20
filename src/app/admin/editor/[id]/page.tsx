import { getPost } from "@/actions/blog"
import { notFound } from "next/navigation"
import EditorForm from "./EditorForm"
import Link from "next/link"

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedParams = await params
  const { tab } = await searchParams
  const post = await getPost(resolvedParams.id)

  if (!post) {
    notFound()
  }

  const initialTab =
    tab === "assets" ? "assets" : tab === "seo" ? "seo" : "write"

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin"
          className="text-sm font-semibold text-[#1a1a1a]/50 hover:text-cran inline-flex items-center gap-1.5 transition-colors min-h-11 sm:min-h-0 py-2 sm:py-0 touch-manipulation w-fit -mx-1 px-1 rounded-lg"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/30">
          Markdown Editor
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-[#E5E5E0] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <EditorForm post={post} initialTab={initialTab} />
      </div>
    </div>
  )
}
