import { getPosts, createPost, deletePost } from "@/actions/blog"
import Link from "next/link"

export default async function AdminDashboard() {
  const posts = await getPosts()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Blog Posts</h1>
          <p className="text-sm font-medium text-[#1a1a1a]/50 mt-1">Manage all public content across the platform.</p>
        </div>
        
        <form action={createPost}>
          <button type="submit" className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
            Write Post
          </button>
        </form>
      </div>

      <div className="bg-white border border-[#E5E5E0] rounded-xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-[#1a1a1a]/40 text-sm font-medium">
            No posts found. Create your first post to get start.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E0]">
            {posts.map((post: any) => (
              <div key={post.id} className="p-5 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors">
                <div className="flex flex-col">
                  <Link href={`/admin/editor/${post.id}`} className="text-[15px] font-bold text-[#1a1a1a] hover:text-cran hover:underline decoration-cran/30 underline-offset-4">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5 text-[13px] font-medium">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                      post.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[#1a1a1a]/40 tracking-wide">/blog/{post.slug}</span>
                    <span className="text-[#1a1a1a]/30">• {new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/editor/${post.id}`} className="px-3 py-1.5 text-sm font-semibold text-[#1a1a1a]/60 hover:text-[#1a1a1a] bg-[#FAFAF8] hover:bg-[#F0F0ED] rounded-md transition-colors border border-transparent hover:border-[#E5E5E0]">
                    Edit
                  </Link>
                  
                  <form action={async () => {
                    "use server"
                    await deletePost(post.id)
                  }}>
                    <button type="submit" className="px-3 py-1.5 text-sm font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-md transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
