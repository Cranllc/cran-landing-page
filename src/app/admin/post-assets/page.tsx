import { getPosts } from "@/actions/blog"
import { getFirstInPostImagePreviewUrl, parseMarkdownImages } from "@/lib/markdown-images"
import { SITE_URL } from "@/lib/site-config"
import Link from "next/link"

export default async function PostAssetsPage() {
  const posts = await getPosts()
  const siteBase = SITE_URL.replace(/\/$/, "")

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Post images</h1>
        <p className="text-sm font-medium text-[#1a1a1a]/50 mt-1">
          Images embedded in post markdown — edit alts and URLs in the editor <strong>Assets</strong> tab. SEO and cover image live under <strong>SEO</strong>.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E0] rounded-xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-[#1a1a1a]/40 text-sm font-medium">
            No posts yet. Create one from Blog Posts.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E0]">
            {posts.map((post) => {
              const inPostImages = parseMarkdownImages(post.content)
              const previewSrc = getFirstInPostImagePreviewUrl(post.content, siteBase)
              return (
              <div
                key={post.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex gap-4 min-w-0 flex-1 items-start sm:items-center">
                  <div className="shrink-0 w-24 h-16 sm:w-28 sm:h-[4.5rem] rounded-lg border border-[#E5E5E0] overflow-hidden bg-[#F0F0ED] flex items-center justify-center">
                    {previewSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewSrc}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] font-medium text-[#1a1a1a]/35 px-2 text-center leading-snug">
                        No preview
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                  <span className="text-[15px] font-bold text-[#1a1a1a] truncate">{post.title}</span>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-1.5 text-[13px] font-medium text-[#1a1a1a]/40">
                    <span className="break-all">/blog/{post.slug}</span>
                    <span className="text-[#1a1a1a]/30">•</span>
                    <span>
                      {inPostImages.length === 0
                        ? "No images in post"
                        : `${inPostImages.length} image${inPostImages.length === 1 ? "" : "s"} in markdown`}
                    </span>
                  </div>
                  </div>
                </div>
                <Link
                  href={`/admin/editor/${post.id}?tab=assets`}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center text-center min-h-11 px-4 py-2.5 text-sm font-semibold text-white bg-cran hover:bg-[#B83A2E] rounded-lg transition-colors touch-manipulation"
                >
                  Edit images
                </Link>
              </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
