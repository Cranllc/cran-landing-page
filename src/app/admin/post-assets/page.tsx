import { getPosts } from "@/actions/blog"
import Link from "next/link"

export default async function PostAssetsPage() {
  const posts = await getPosts()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Post assets</h1>
        <p className="text-sm font-medium text-[#1a1a1a]/50 mt-1">
          Featured images, SEO fields, and markdown image alts — open the Assets tab for each post.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E0] rounded-xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-[#1a1a1a]/40 text-sm font-medium">
            No posts yet. Create one from Blog Posts.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E0]">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[15px] font-bold text-[#1a1a1a] truncate">{post.title}</span>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-1.5 text-[13px] font-medium text-[#1a1a1a]/40">
                    <span className="break-all">/blog/{post.slug}</span>
                    <span className="text-[#1a1a1a]/30">•</span>
                    <span>{post.featuredImageUrl ? "Featured image set" : "No featured image"}</span>
                  </div>
                </div>
                <Link
                  href={`/admin/editor/${post.id}?tab=assets`}
                  className="shrink-0 text-center px-4 py-2 text-sm font-semibold text-white bg-cran hover:bg-[#B83A2E] rounded-lg transition-colors"
                >
                  Open assets
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
