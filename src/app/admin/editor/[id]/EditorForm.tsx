"use client"

import { useState, useTransition, useRef } from "react"
import { updatePost } from "@/actions/blog"
import { uploadBlogImage } from "@/actions/storage"
import type { Post } from "@prisma/client"
import { 
  ImageIcon, Loader2, Bold, Italic, 
  Heading1, Heading2, Quote, List, 
  ListOrdered, Link as LinkIcon, Code
} from "lucide-react"

export default function EditorForm({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    published: post.published
  })
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

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

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return
    
    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append("file", file)
    
    try {
      const res = await uploadBlogImage(uploadData)
      if (res.error) throw new Error(res.error)
      
      const imageMarkdown = `\n![${file.name}](${res.url})\n`
      insertTextAtCursor(imageMarkdown)
    } catch (err) {
      console.error(err)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
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
      <div 
        className={`flex-1 p-0 relative flex flex-col transition-colors ${isDragOver ? 'bg-cran/5' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Editor Toolbar (Rich Text + Image Upload) */}
        <div className="h-12 border-b border-[#E5E5E0] bg-[#FAFAF8] flex items-center px-4 shrink-0 gap-1 overflow-x-auto">
          
          <div className="flex items-center gap-1 border-r border-[#E5E5E0] pr-2 mr-1">
            <button type="button" onClick={() => applyFormatting("h1")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded text-xs font-bold w-7 flex items-center justify-center transition-colors" title="Heading 1">H1</button>
            <button type="button" onClick={() => applyFormatting("h2")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded text-xs font-bold w-7 flex items-center justify-center transition-colors" title="Heading 2">H2</button>
          </div>

          <div className="flex items-center gap-1 border-r border-[#E5E5E0] pr-2 mr-1">
            <button type="button" onClick={() => applyFormatting("bold")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Bold"><Bold size={15} /></button>
            <button type="button" onClick={() => applyFormatting("italic")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Italic"><Italic size={15} /></button>
          </div>

          <div className="flex items-center gap-1 border-r border-[#E5E5E0] pr-2 mr-1">
            <button type="button" onClick={() => applyFormatting("ul")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Bulleted List"><List size={15} /></button>
            <button type="button" onClick={() => applyFormatting("ol")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Numbered List"><ListOrdered size={15} /></button>
            <button type="button" onClick={() => applyFormatting("quote")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Quote"><Quote size={15} /></button>
          </div>

          <div className="flex items-center gap-1 border-r border-[#E5E5E0] pr-2 mr-1">
            <button type="button" onClick={() => applyFormatting("link")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Insert Link"><LinkIcon size={15} /></button>
            <button type="button" onClick={() => applyFormatting("code")} className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#E5E5E0]/50 rounded transition-colors" title="Code Block"><Code size={15} /></button>
          </div>

          <div className="flex items-center gap-2 pl-1">
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/60 hover:text-cran hover:bg-cran/5 rounded-md transition-colors disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
              {isUploading ? 'Uploading...' : 'Add Image'}
            </button>
            <span className="text-[11px] font-medium text-[#1a1a1a]/30 hidden md:block">
              (Drag & drop supported)
            </span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          name="content"
          value={formData.content}
          onChange={handleChange}
          onPaste={handlePaste}
          className="w-full h-full p-8 md:p-12 resize-none border-none outline-none bg-transparent text-[#1a1a1a] text-base leading-relaxed font-mono focus:ring-0 placeholder-[#1a1a1a]/20"
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
    </div>
  )
}
