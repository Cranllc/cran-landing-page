import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site-config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cran | Blog & Research',
  description: 'Stories, insights, and updates from the Cran team.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Cran | Blog',
    description: 'Stories, insights, and updates from the Cran team.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <main id="main-content" className="min-h-screen bg-[#F7F7F4] pt-32 pb-24 font-sans selection:bg-cran selection:text-white">
      {/* Container - Allow for the sidebar width + content width */}
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="mb-24 lg:ml-48">
          <h1 className="text-4xl font-bold text-[#26251E] tracking-tight mb-4">Blog</h1>
          <p className="text-[#26251E]/60 text-lg">Stories, insights, and updates from the Cran team.</p>
        </div>

        {/* Post List */}
        <div className="grid gap-16 lg:gap-24">
          {posts.length === 0 ? (
            <p className="text-[#26251E]/60 lg:ml-48">No posts published yet.</p>
          ) : (
            posts.map((post: any) => {
              // Extract a brief excerpt by taking the first 160 chars and stripping common markdown
              const excerpt = post.content.replace(/[#*`_>]/g, '').substring(0, 160) + '...';
              const dateString = new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

              return (
               <article key={post.slug} className="group relative flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-baseline">
                  {/* Date / Category Sidebar */}
                  <div className="w-full lg:w-36 shrink-0 lg:text-right pt-2 lg:pt-1">
                    <time className="text-sm font-medium text-[#26251E]/50 block mb-1" suppressHydrationWarning dateTime={new Date(post.createdAt).toISOString().split("T")[0]}>{dateString}</time>
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#26251E]/30 hidden lg:block">{post.category || "Uncategorized"}</span>
                  </div>
                  
                  {/* Content (Constrained to ~650px text width) */}
                  <div className="flex-1 max-w-[650px]">
                    <span className="text-xs font-semibold tracking-wider uppercase text-cran mb-3 block lg:hidden">{post.category || "Uncategorized"}</span>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl sm:text-[1.75rem] font-bold text-[#26251E] mb-4 group-hover:text-cran transition-colors leading-tight tracking-tight">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-[#26251E]/70 leading-relaxed mb-6 font-medium text-[16px]">
                      {excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-[#26251E] hover:text-cran inline-flex items-center gap-1.5 transition-colors">
                      Read article <span aria-hidden="true" className="rotate-45 block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">&uarr;</span>
                    </Link>
                  </div>
               </article>
              )
            })
          )}
        </div>

      </div>
    </main>
  );
}
