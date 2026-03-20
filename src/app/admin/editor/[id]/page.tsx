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
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin" className="text-sm font-semibold text-[#1a1a1a]/50 hover:text-cran flex items-center gap-1.5 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Dashboard
        </Link>
        <div className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/30">
          Markdown Editor
        </div>
      </div>
      
      <div className="flex-1 bg-white border border-[#E5E5E0] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <EditorForm post={post} initialTab={initialTab} />
      </div>
    </div>
  )
}
