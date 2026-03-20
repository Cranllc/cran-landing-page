"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { isAllowedAdminEmail } from "@/lib/admin-email"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function verifyAdmin() {
  const session = await auth()
  const user = session?.user
  
  if (!user || !isAllowedAdminEmail(user.email)) {
    throw new Error("Unauthorized")
  }
  
  return user
}

export async function getPosts() {
  await verifyAdmin()
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } })
}

export async function getPost(id: string) {
  await verifyAdmin()
  return prisma.post.findUnique({ where: { id } })
}

export async function createPost() {
  const user = await verifyAdmin()
  
  // Get or create the user in the DB to satisfy the relation
  let dbUser = await prisma.user.findUnique({ where: { email: user.email! }})
  if (!dbUser) {
    dbUser = await prisma.user.create({ data: { email: user.email!, name: user.name, password: Math.random().toString(36).slice(-8) }})
  }

  const newPost = await prisma.post.create({
    data: {
      title: "Untitled Post",
      slug: `untitled-${Date.now()}`,
      content: "",
      published: false,
      authorId: dbUser.id
    }
  })

  revalidatePath("/admin")
  redirect(`/admin/editor/${newPost.id}`)
}

export async function updatePost(
  id: string,
  data: {
    title: string
    slug: string
    content: string
    published: boolean
    category?: string | null
    tags?: string[]
    seoTitle?: string | null
    seoDescription?: string | null
    /** Article header — not from markdown body */
    heroImageUrl?: string | null
    /** Cards + OG/Twitter; falls back to hero in readers if empty */
    previewImageUrl?: string | null
  }
) {
  await verifyAdmin()

  const preview = data.previewImageUrl === undefined ? undefined : data.previewImageUrl || null
  const hero = data.heroImageUrl === undefined ? undefined : data.heroImageUrl || null
  /** Legacy column: keep aligned for anything still reading `featuredImageUrl` only */
  const featuredSync =
    preview !== undefined || hero !== undefined ? preview || hero || null : undefined

  // Inferred object (no `Prisma.PostUpdateInput` annotation): avoids IDE/ts errors when
  // @prisma/client is briefly out of sync with schema before `prisma generate`.
  const patch = {
    title: data.title,
    slug: data.slug,
    content: data.content,
    published: data.published,
    ...(data.category !== undefined ? { category: data.category } : {}),
    ...(data.tags !== undefined ? { tags: data.tags } : {}),
    ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle || null } : {}),
    ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription || null } : {}),
    ...(hero !== undefined ? { heroImageUrl: hero } : {}),
    ...(preview !== undefined ? { previewImageUrl: preview } : {}),
    ...(featuredSync !== undefined ? { featuredImageUrl: featuredSync } : {}),
  }

  await prisma.post.update({
    where: { id },
    data: patch,
  })
  
  revalidatePath("/admin")
  revalidatePath("/blog")
  revalidatePath(`/blog/${data.slug}`)
  revalidatePath("/")
}

export async function deletePost(id: string) {
  await verifyAdmin()
  
  await prisma.post.delete({ where: { id } })
  
  revalidatePath("/admin")
}
