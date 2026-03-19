import { prisma } from "@/lib/prisma";
import { getPostShareImageUrl } from "@/lib/markdown-images";

const LATEST_LIMIT = 3;

export { extractFirstImageUrl, getPostShareImageUrl } from "@/lib/markdown-images";

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
      featuredImageUrl: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });
  return posts.map((p) => ({
    ...p,
    imageUrl: getPostShareImageUrl(p),
  }));
}
