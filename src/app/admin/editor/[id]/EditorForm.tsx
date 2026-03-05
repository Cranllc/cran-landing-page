"use client"

import { useState, useTransition } from "react"
import { updatePost } from "@/actions/blog"
import type { Post } from "@prisma/client"

export default function EditorForm({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    published: post.published
  })
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePublishToggle = () => {
    setFormData({ ...formData, published: !formData.published })
  }

  const handleSave = () => {
    setSaveStatus("saving")
    startTransition(async () => {
      await updatePost(post.id, formData)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    })
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAF8]">
      {/* Top action bar */}
      <div className="h-[60px] border-b border-[#E5E5E0] bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="text-lg font-bold text-[#1a1a1a] bg-transparent border-none outline-none focus:ring-0 placeholder-[#1a1a1a]/30 w-[300px]"
            placeholder="Post Title"
          />
          <div className="h-4 w-px bg-[#E5E5E0]"></div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a]/40 bg-[#FAFAF8] px-2 py-1 rounded-md border border-[#E5E5E0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            <span>/blog/</span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="bg-transparent border-none outline-none focus:ring-0 text-[#1a1a1a] w-[150px] p-0"
              placeholder="url-slug"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePublishToggle}
            className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-colors border ${
              formData.published 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-white text-[#1a1a1a]/50 border-[#E5E5E0] hover:bg-[#F0F0ED] hover:text-[#1a1a1a]'
            }`}
          >
            {formData.published ? "Published" : "Draft"}
          </button>

          <button
            onClick={handleSave}
            disabled={isPending || saveStatus === "saving"}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-1.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Post"}
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 p-0 relative">
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full h-full p-8 md:p-12 resize-none border-none outline-none bg-[#FAFAF8] text-[#1a1a1a] text-base leading-relaxed font-mono focus:ring-0 placeholder-[#1a1a1a]/20"
          placeholder="Write your post content here using Markdown..."
        />
      </div>
    </div>
  )
}
