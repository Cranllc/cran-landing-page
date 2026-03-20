"use client"

import { useState, useTransition, useRef, useMemo, useEffect } from "react"
import { updatePost } from "@/actions/blog"
import { uploadBlogImage } from "@/actions/storage"
import {
  parseMarkdownImages,
  removeMarkdownImageAtIndex,
  replaceMarkdownImageAlt,
  resolveImageUrlForPreview,
  sanitizeMarkdownImageAlt,
} from "@/lib/markdown-images"
import { SITE_URL } from "@/lib/site-config"
import type { Post } from "@prisma/client"
import {
  ImageIcon,
  Loader2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  FileText,
  Images,
  Star,
  Copy,
  Check,
  Share2,
  Trash2,
} from "lucide-react"

/** SEO columns — intersect so EditorForm type-checks even if TS uses a pre-migration Prisma `Post`. */
type PostForEditor = Post & {
  seoTitle?: string | null
  seoDescription?: string | null
  featuredImageUrl?: string | null
  heroImageUrl?: string | null
  previewImageUrl?: string | null
}

type EditorTab = "write" | "assets" | "seo"

export default function EditorForm({
  post,
  initialTab = "write",
}: {
  post: PostForEditor
  initialTab?: EditorTab
}) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    published: post.published,
    category: post.category || "",
    tags: post.tags?.join(", ") || "",
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
    heroImageUrl: post.heroImageUrl?.trim() || post.featuredImageUrl?.trim() || "",
    previewImageUrl: post.previewImageUrl?.trim() || "",
  })
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const heroFileInputRef = useRef<HTMLInputElement>(null)
  const previewFileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [editorTab, setEditorTab] = useState<EditorTab>(initialTab)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    setEditorTab(initialTab)
  }, [initialTab])

  /** Absolute base for resolving `/…` image URLs in previews (localhost vs production). */
  const [previewOrigin, setPreviewOrigin] = useState("")
  useEffect(() => {
    setPreviewOrigin(window.location.origin)
  }, [])

  const imagePreviewBase = previewOrigin || SITE_URL.replace(/\/$/, "")

  const contentImages = useMemo(() => parseMarkdownImages(formData.content), [formData.content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePublishToggle = () => {
    setFormData({ ...formData, published: !formData.published })
  }

  const handleSave = () => {
    setSaveStatus("saving")
    startTransition(async () => {
      try {
        const tagsArray = formData.tags
          ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : []

        await updatePost(post.id, {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          published: formData.published,
          category: formData.category || null,
          tags: tagsArray,
          seoTitle: formData.seoTitle.trim() || null,
          seoDescription: formData.seoDescription.trim() || null,
          heroImageUrl: formData.heroImageUrl.trim() || null,
          previewImageUrl: formData.previewImageUrl.trim() || null,
        })
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch (error) {
        alert("Failed to save post")
        setSaveStatus("idle")
      }
    })
  }

  const insertTextAtCursor = (text: string, wrapText: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    
    let newContent = ""
    let newCursorPos = start

    if (wrapText) {
      // e.g. wrapText = "**" -> **selectedText**
      newContent = formData.content.substring(0, start) + wrapText + selectedText + wrapText + formData.content.substring(end)
      newCursorPos = end + wrapText.length * 2
    } else {
      // standard insert / prefix
      newContent = formData.content.substring(0, start) + text + selectedText + formData.content.substring(end)
      newCursorPos = end + text.length
    }
    
    setFormData(prev => ({ ...prev, content: newContent }))
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = newCursorPos
      textarea.focus()
    }, 0)
  }

  const applyFormatting = (type: string) => {
    switch (type) {
      case "bold": insertTextAtCursor("", "**"); break;
      case "italic": insertTextAtCursor("", "_"); break;
      case "h1": insertTextAtCursor("# "); break;
      case "h2": insertTextAtCursor("## "); break;
      case "quote": insertTextAtCursor("> "); break;
      case "ul": insertTextAtCursor("- "); break;
      case "ol": insertTextAtCursor("1. "); break;
      case "code": insertTextAtCursor("", "`"); break;
      case "link": insertTextAtCursor("[", "](url)"); break;
    }
  }

  const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // match Supabase bucket / server action limit

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return
    if (file.size > MAX_IMAGE_BYTES) {
      alert(`Image is too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB). Try compressing or resizing.`)
      return
    }

    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append("file", file)

    try {
      const res = await uploadBlogImage(uploadData)
      if (res.error) throw new Error(res.error)

      const imageMarkdown = `\n![${sanitizeMarkdownImageAlt(file.name)}](${res.url})\n`
      insertTextAtCursor(imageMarkdown)
    } catch (err) {
      console.error(err)
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to upload image (if this says “unexpected response”, the file may still be too large or the server rejected the request)."
      alert(msg)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSideImageUpload = async (file: File, field: "heroImageUrl" | "previewImageUrl") => {
    if (!file.type.startsWith("image/")) return
    if (file.size > MAX_IMAGE_BYTES) {
      alert(`Image is too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB). Try compressing or resizing.`)
      return
    }
    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append("file", file)
    try {
      const res = await uploadBlogImage(uploadData)
      if (res.error) throw new Error(res.error)
      setFormData((prev) => ({ ...prev, [field]: res.url ?? "" }))
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : "Failed to upload image"
      alert(msg)
    } finally {
      setIsUploading(false)
      const ref = field === "heroImageUrl" ? heroFileInputRef : previewFileInputRef
      if (ref.current) ref.current.value = ""
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault()
        const file = items[i].getAsFile()
        if (file) handleImageUpload(file)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file)
    }
  }

  const updateImageAlt = (imageIndex: number, newAlt: string) => {
    setFormData((prev) => ({
      ...prev,
      content: replaceMarkdownImageAlt(prev.content, imageIndex, newAlt),
    }))
  }

  const removeImageFromPost = (imageIndex: number, imageUrl: string) => {
    if (
      !confirm(
        "Remove this image from the post body? The file is not deleted from storage (e.g. Supabase) — only the markdown line is removed. Hero / preview will be cleared if they used this URL."
      )
    ) {
      return
    }
    const trimmedUrl = imageUrl.trim()
    setFormData((prev) => {
      const nextContent = removeMarkdownImageAtIndex(prev.content, imageIndex)
      const heroTrim = prev.heroImageUrl.trim()
      const previewTrim = prev.previewImageUrl.trim()
      return {
        ...prev,
        content: nextContent,
        heroImageUrl: heroTrim === trimmedUrl ? "" : prev.heroImageUrl,
        previewImageUrl: previewTrim === trimmedUrl ? "" : prev.previewImageUrl,
      }
    })
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch {
      alert("Could not copy to clipboard")
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAF8]">
      {/* Top action bar */}
      <div className="min-h-[60px] py-3 sm:py-0 border-b border-[#E5E5E0] bg-white flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 shrink-0 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full min-w-0 sm:w-auto">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="text-base sm:text-lg font-bold text-[#1a1a1a] bg-transparent border-none outline-none focus:ring-0 placeholder-[#1a1a1a]/30 w-full sm:w-[300px] min-w-0"
            placeholder="Post Title"
          />
          <div className="hidden sm:block h-4 w-px bg-[#E5E5E0]"></div>
          <div className="flex items-center gap-1.5 text-base sm:text-sm font-medium text-[#1a1a1a]/40 bg-[#FAFAF8] px-2 py-2 sm:py-1 rounded-md border border-[#E5E5E0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] w-full sm:w-fit mt-1 sm:mt-0 min-w-0">
            <span className="shrink-0">/blog/</span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="bg-transparent border-none outline-none focus:ring-0 text-[#1a1a1a] flex-1 min-w-0 w-full sm:w-[150px] p-0"
              placeholder="url-slug"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePublishToggle}
            className={`flex-1 sm:flex-none min-h-11 sm:min-h-0 px-3 py-2.5 sm:py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-colors border touch-manipulation ${
              formData.published 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-white text-[#1a1a1a]/50 border-[#E5E5E0] hover:bg-[#F0F0ED] hover:text-[#1a1a1a]'
            }`}
          >
            {formData.published ? "Published" : "Draft"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || saveStatus === "saving"}
            className="flex-1 sm:flex-none flex items-center gap-2 bg-[#1a1a1a] text-white px-5 min-h-11 sm:min-h-0 py-2.5 sm:py-1.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed sm:min-w-[100px] justify-center touch-manipulation"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Post"}
          </button>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="min-h-[50px] py-3 sm:py-0 border-b border-[#E5E5E0] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 shrink-0 gap-4 sm:gap-6 text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <span className="text-[#1a1a1a]/50 font-bold uppercase tracking-wider text-[11px] w-full sm:w-auto">Category</span>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Engineering"
            className="flex-1 w-full sm:w-[160px] bg-transparent border border-[#E5E5E0] rounded px-2 py-2 sm:py-1 outline-none text-base sm:text-[13px] focus:border-cran/50 focus:ring-1 focus:ring-cran/20 text-[#1a1a1a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all min-w-0"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:flex-1">
          <span className="text-[#1a1a1a]/50 font-bold uppercase tracking-wider text-[11px] w-full sm:w-auto">Tags</span>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. React, Performance (comma separated)"
            className="flex-1 w-full sm:max-w-[400px] bg-transparent border border-[#E5E5E0] rounded px-2 py-2 sm:py-1 outline-none text-base sm:text-[13px] focus:border-cran/50 focus:ring-1 focus:ring-cran/20 text-[#1a1a1a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all min-w-0"
          />
        </div>
      </div>

      {/* Write | Assets (markdown images) | SEO */}
      <div className="border-b border-[#E5E5E0] bg-white shrink-0 flex gap-1 flex-nowrap overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none px-4 sm:px-6 pb-px">
        <button
          type="button"
          onClick={() => setEditorTab("write")}
          className={`shrink-0 flex items-center gap-2 px-4 py-3 sm:py-2.5 text-[13px] font-semibold rounded-t-lg border-b-2 -mb-px transition-colors touch-manipulation ${
            editorTab === "write"
              ? "border-cran text-[#1a1a1a] bg-[#FAFAF8]"
              : "border-transparent text-[#1a1a1a]/45 hover:text-[#1a1a1a]/70"
          }`}
        >
          <FileText size={16} aria-hidden />
          Write
        </button>
        <button
          type="button"
          onClick={() => setEditorTab("assets")}
          className={`shrink-0 flex items-center gap-2 px-4 py-3 sm:py-2.5 text-[13px] font-semibold rounded-t-lg border-b-2 -mb-px transition-colors touch-manipulation ${
            editorTab === "assets"
              ? "border-cran text-[#1a1a1a] bg-[#FAFAF8]"
              : "border-transparent text-[#1a1a1a]/45 hover:text-[#1a1a1a]/70"
          }`}
        >
          <Images size={16} aria-hidden />
          Assets
          {contentImages.length > 0 && (
            <span className="text-[10px] font-bold tabular-nums bg-[#1a1a1a]/10 text-[#1a1a1a]/60 px-1.5 py-0.5 rounded">
              {contentImages.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setEditorTab("seo")}
          className={`shrink-0 flex items-center gap-2 px-4 py-3 sm:py-2.5 text-[13px] font-semibold rounded-t-lg border-b-2 -mb-px transition-colors touch-manipulation ${
            editorTab === "seo"
              ? "border-cran text-[#1a1a1a] bg-[#FAFAF8]"
              : "border-transparent text-[#1a1a1a]/45 hover:text-[#1a1a1a]/70"
          }`}
        >
          <Share2 size={16} aria-hidden />
          SEO
        </button>
      </div>

      {editorTab === "seo" && (
        <div className="flex-1 overflow-y-auto border-b border-[#E5E5E0] bg-[#FAFAF8] px-4 sm:px-6 py-6 space-y-8">
          <p className="text-[13px] text-[#1a1a1a]/50 max-w-2xl">
            Text snippets for search/social, plus <strong>hero</strong> (top of the article) and <strong>preview</strong> (cards + link previews). Neither is taken from markdown body images — use <strong>Assets</strong> for those.
          </p>
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/40">
              Search &amp; social
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 bg-white border border-[#E5E5E0] rounded-xl p-4 sm:p-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="seoTitle" className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">
                  SEO title
                </label>
                <input
                  id="seoTitle"
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="Defaults to post title — used as the browser tab / search title"
                  className="w-full border border-[#E5E5E0] rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-[13px] text-[#1a1a1a] outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20 min-w-0"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="seoDescription" className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">
                  Meta description ({formData.seoDescription.length}/320)
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  maxLength={320}
                  placeholder="~150–160 characters ideal for Google. Leave empty to auto-generate from the first lines of the post."
                  className="w-full border border-[#E5E5E0] rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-[13px] text-[#1a1a1a] outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20 resize-y min-h-[88px] sm:min-h-[72px]"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/40">
              Hero image (article header)
            </h2>
            <div className="bg-white border border-[#E5E5E0] rounded-xl p-4 sm:p-5 space-y-3">
              <p className="text-[12px] text-[#1a1a1a]/55 leading-relaxed">
                Large image under the title on the post page only. Leave empty for the branded placeholder — we <strong>do not</strong> pull this from markdown images.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="heroImageUrl"
                  type="url"
                  name="heroImageUrl"
                  value={formData.heroImageUrl}
                  onChange={handleChange}
                  placeholder="https://…"
                  className="flex-1 min-w-0 border border-[#E5E5E0] rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-[13px] text-[#1a1a1a] outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20"
                />
                <input
                  type="file"
                  ref={heroFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleSideImageUpload(file, "heroImageUrl")
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  disabled={isUploading}
                  className="shrink-0 min-h-11 px-4 py-2.5 sm:py-2 rounded-lg border border-[#E5E5E0] text-[12px] font-semibold text-[#1a1a1a]/70 hover:bg-[#FAFAF8] disabled:opacity-50 touch-manipulation"
                >
                  Upload
                </button>
              </div>
              {(() => {
                const heroPv = resolveImageUrlForPreview(formData.heroImageUrl, imagePreviewBase)
                if (!heroPv) return null
                return (
                  <div className="mt-3 rounded-lg border border-[#E5E5E0] overflow-hidden max-w-lg bg-[#FAFAF8]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1a1a1a]/40 px-3 pt-2 pb-1">
                      Hero preview
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroPv}
                      alt=""
                      className="w-full max-h-64 min-h-[160px] object-contain object-center bg-[#F3F3F0]"
                    />
                  </div>
                )
              })()}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/40">
              Preview image (cards &amp; link shares)
            </h2>
            <div className="bg-white border border-[#E5E5E0] rounded-xl p-4 sm:p-5 space-y-3">
              <p className="text-[12px] text-[#1a1a1a]/55 leading-relaxed">
                Homepage blog cards, Open Graph, and Twitter. If empty, we use the <strong>hero</strong> image. Still not taken from in-article markdown.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="previewImageUrl"
                  type="url"
                  name="previewImageUrl"
                  value={formData.previewImageUrl}
                  onChange={handleChange}
                  placeholder="https://… (optional)"
                  className="flex-1 min-w-0 border border-[#E5E5E0] rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-[13px] text-[#1a1a1a] outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20"
                />
                <input
                  type="file"
                  ref={previewFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleSideImageUpload(file, "previewImageUrl")
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => previewFileInputRef.current?.click()}
                  disabled={isUploading}
                  className="shrink-0 min-h-11 px-4 py-2.5 sm:py-2 rounded-lg border border-[#E5E5E0] text-[12px] font-semibold text-[#1a1a1a]/70 hover:bg-[#FAFAF8] disabled:opacity-50 touch-manipulation"
                >
                  Upload
                </button>
              </div>
              {(() => {
                const cardPv = resolveImageUrlForPreview(formData.previewImageUrl, imagePreviewBase)
                if (!cardPv) return null
                return (
                  <div className="mt-3 rounded-lg border border-[#E5E5E0] overflow-hidden max-w-lg bg-[#FAFAF8]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1a1a1a]/40 px-3 pt-2 pb-1">
                      Preview / OG
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cardPv}
                      alt=""
                      className="w-full max-h-64 min-h-[160px] object-contain object-center bg-[#F3F3F0]"
                    />
                  </div>
                )
              })()}
            </div>
          </section>
        </div>
      )}

      {editorTab === "assets" && (
        <div className="flex-1 overflow-y-auto border-b border-[#E5E5E0] bg-[#FAFAF8] px-4 sm:px-6 py-6 space-y-8">
          <p className="text-[13px] text-[#1a1a1a]/50 max-w-2xl">
            <strong>Assets</strong> are only the images referenced in your markdown (<code className="text-[12px] bg-white px-1 py-0.5 rounded border border-[#E5E5E0]">![]()</code>). Set alt text and URLs here, or <strong>remove</strong> a line from the post (storage files are unchanged). Use <strong>SEO</strong> for hero, preview, and meta tags.
          </p>
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/40">
              Images in this post
            </h2>
            {contentImages.length === 0 ? (
              <p className="text-[13px] text-[#1a1a1a]/45 bg-white border border-dashed border-[#E5E5E0] rounded-xl px-4 py-8 text-center">
                No markdown images yet. On the <strong>Write</strong> tab, use <strong>Add image</strong> or paste/drag files into the editor.
              </p>
            ) : (
              <ul className="space-y-4">
                {contentImages.map((img) => {
                  const isHero = formData.heroImageUrl.trim() === img.url
                  const isPreview = formData.previewImageUrl.trim() === img.url
                  const rowPreview = resolveImageUrlForPreview(img.url, imagePreviewBase)
                  return (
                    <li
                      key={`content-image-${img.start}-${img.end}`}
                      className="bg-white border border-[#E5E5E0] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="shrink-0 w-full sm:w-40 h-32 rounded-lg border border-[#E5E5E0] overflow-hidden bg-[#FAFAF8] flex items-center justify-center">
                        {rowPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rowPreview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-[#1a1a1a]/35 px-2 text-center leading-snug">
                            Add an https URL or a path like /image.png (preview uses your site base)
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">
                            Alt text (accessibility &amp; SEO)
                          </label>
                          <input
                            type="text"
                            value={img.alt}
                            onChange={(e) => updateImageAlt(img.index, e.target.value)}
                            placeholder="Describe the image for screen readers and search"
                            className="w-full min-w-0 border border-[#E5E5E0] rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-[13px] text-[#1a1a1a] outline-none focus:border-cran/50 focus:ring-1 focus:ring-cran/20"
                          />
                        </div>
                        <div className="flex flex-wrap items-stretch sm:items-center gap-2">
                          <code className="text-[11px] text-[#1a1a1a]/55 break-all bg-[#FAFAF8] px-2 py-2 sm:py-1 rounded border border-[#E5E5E0] max-w-full min-w-0 flex-[1_1_100%] sm:flex-[unset]">
                            {img.url}
                          </code>
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(img.url)}
                            className="inline-flex items-center justify-center gap-1 min-h-10 px-3 py-2 rounded-md border border-[#E5E5E0] text-[11px] font-semibold text-[#1a1a1a]/70 hover:bg-[#FAFAF8] touch-manipulation"
                          >
                            {copiedUrl === img.url ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            {copiedUrl === img.url ? "Copied" : "Copy URL"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                heroImageUrl: isHero ? "" : img.url,
                              }))
                            }
                            className={`inline-flex items-center justify-center gap-1 min-h-10 px-3 py-2 rounded-md border text-[11px] font-semibold transition-colors touch-manipulation ${
                              isHero
                                ? "border-cran/40 bg-cran/10 text-cran"
                                : "border-[#E5E5E0] text-[#1a1a1a]/70 hover:bg-[#FAFAF8]"
                            }`}
                          >
                            <Star size={12} className={isHero ? "fill-cran text-cran" : ""} aria-hidden />
                            {isHero ? "Hero set" : "Use as hero"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                previewImageUrl: isPreview ? "" : img.url,
                              }))
                            }
                            className={`inline-flex items-center justify-center gap-1 min-h-10 px-3 py-2 rounded-md border text-[11px] font-semibold transition-colors touch-manipulation ${
                              isPreview
                                ? "border-emerald-600/40 bg-emerald-50 text-emerald-800"
                                : "border-[#E5E5E0] text-[#1a1a1a]/70 hover:bg-[#FAFAF8]"
                            }`}
                          >
                            <Share2 size={12} className={isPreview ? "text-emerald-700" : ""} aria-hidden />
                            {isPreview ? "Preview set" : "Use as preview"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImageFromPost(img.index, img.url)}
                            className="inline-flex items-center justify-center gap-1 min-h-10 px-3 py-2 rounded-md border border-red-200 bg-red-50/80 text-[11px] font-semibold text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors touch-manipulation sm:ml-auto"
                            aria-label={`Remove image from post: ${img.alt || img.url}`}
                          >
                            <Trash2 size={12} className="shrink-0" aria-hidden />
                            Remove from post
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* Editor Content Area */}
      {editorTab === "write" && (
      <div 
        className={`flex-1 p-0 relative flex flex-col min-h-0 transition-colors ${isDragOver ? 'bg-cran/5' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Editor Toolbar (Rich Text + Image Upload) */}
        <div className="min-h-11 sm:h-12 border-b border-[#E5E5E0] bg-[#FAFAF8] flex items-center px-2 sm:px-4 shrink-0 gap-1 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none touch-manipulation">
          
          <div className="flex items-center gap-0.5 border-r border-[#E5E5E0] pr-2 mr-1 shrink-0">
            <button type="button" onClick={() => applyFormatting("h1")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded text-xs font-bold sm:w-7 flex items-center justify-center transition-colors" title="Heading 1">H1</button>
            <button type="button" onClick={() => applyFormatting("h2")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded text-xs font-bold sm:w-7 flex items-center justify-center transition-colors" title="Heading 2">H2</button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-[#E5E5E0] pr-2 mr-1 shrink-0">
            <button type="button" onClick={() => applyFormatting("bold")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Bold"><Bold size={16} strokeWidth={2.25} /></button>
            <button type="button" onClick={() => applyFormatting("italic")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Italic"><Italic size={16} strokeWidth={2.25} /></button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-[#E5E5E0] pr-2 mr-1 shrink-0">
            <button type="button" onClick={() => applyFormatting("ul")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Bulleted List"><List size={16} strokeWidth={2.25} /></button>
            <button type="button" onClick={() => applyFormatting("ol")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Numbered List"><ListOrdered size={16} strokeWidth={2.25} /></button>
            <button type="button" onClick={() => applyFormatting("quote")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Quote"><Quote size={16} strokeWidth={2.25} /></button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-[#E5E5E0] pr-2 mr-1 shrink-0">
            <button type="button" onClick={() => applyFormatting("link")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Insert Link"><LinkIcon size={16} strokeWidth={2.25} /></button>
            <button type="button" onClick={() => applyFormatting("code")} className="min-h-10 min-w-10 sm:min-h-0 sm:min-w-0 sm:p-1.5 p-2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors flex items-center justify-center" title="Code Block"><Code size={16} strokeWidth={2.25} /></button>
          </div>

          <div className="flex items-center gap-2 pl-1 shrink-0 pr-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 min-h-10 px-3 py-2 sm:px-2.5 sm:py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/60 hover:text-cran hover:bg-cran/5 rounded-md transition-colors disabled:opacity-50 touch-manipulation whitespace-nowrap"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} strokeWidth={2.25} />}
              {isUploading ? 'Uploading...' : 'Add Image'}
            </button>
            <span className="text-[11px] font-medium text-[#1a1a1a]/30 hidden md:inline whitespace-nowrap">
              (Drag &amp; drop)
            </span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          name="content"
          value={formData.content}
          onChange={handleChange}
          onPaste={handlePaste}
          className="w-full h-full min-h-[12rem] p-4 sm:p-8 md:p-12 resize-none border-none outline-none bg-transparent text-[#1a1a1a] text-base leading-relaxed font-mono focus:ring-0 placeholder-[#1a1a1a]/20"
          placeholder="Write your post content here using Markdown..."
        />
        
        {isDragOver && (
          <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-cran rounded-lg bg-cran/5 z-10 flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-cran flex items-center gap-2">
              <ImageIcon size={18} />
              Drop image to upload
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
