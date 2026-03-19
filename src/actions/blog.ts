"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function verifyAdmin() {
  const session = await auth()
  const user = session?.user
  
  if (!user || !user.email || (!user.email.endsWith("@getcran.ai") && !user.email.endsWith("@cran-us.com"))) {
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
    featuredImageUrl?: string | null
  }
) {
  await verifyAdmin()

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      published: data.published,
      category: data.category,
      tags: data.tags,
      seoTitle: data.seoTitle === undefined ? undefined : data.seoTitle || null,
      seoDescription: data.seoDescription === undefined ? undefined : data.seoDescription || null,
      featuredImageUrl: data.featuredImageUrl === undefined ? undefined : data.featuredImageUrl || null,
    },
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
