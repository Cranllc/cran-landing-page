"use server"

import { auth } from "@/auth"
import { isAllowedAdminEmail } from "@/lib/admin-email"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET_NAME = "blog-images"

async function verifyAdmin() {
  const session = await auth()
  const user = session?.user
  
  if (!user || !isAllowedAdminEmail(user.email)) {
    throw new Error("Unauthorized")
  }
  
  return user
}

export async function uploadBlogImage(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin()

    // 1. Verify admin permissions
    await verifyAdmin()

    // 2. Extract file
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file uploaded")
    }

    // 3. Ensure bucket exists and is public
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.find(b => b.name === BUCKET_NAME)) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      })
    }

    // 4. Generate unique filename and convert file to buffer for upload
    const fileExtension = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // 5. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      throw error
    }

    // 6. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return { url: publicUrl }
    
  } catch (error: any) {
    console.error("Storage upload error:", error)
    return { error: error.message || "Failed to upload image" }
  }
}
