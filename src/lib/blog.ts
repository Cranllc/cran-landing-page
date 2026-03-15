import { prisma } from "@/lib/prisma";

const LATEST_LIMIT = 3;

/** Extract the first image URL from markdown content, e.g. ![alt](https://...) */
export function extractFirstImageUrl(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1].trim() : null;
}

export type PostPreview = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string | null;
  createdAt: Date;
  author: { name: string | null } | null;
  imageUrl: string | null;
};

export async function getLatestPublishedPosts(): Promise<PostPreview[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: LATEST_LIMIT,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      category: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });
  return posts.map((p) => ({
    ...p,
    imageUrl: extractFirstImageUrl(p.content),
  }));
}
