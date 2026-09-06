import { prisma } from "@/lib/prisma";
import { getPostPreviewImageUrl } from "@/lib/markdown-images";

const LATEST_LIMIT = 3;

export {
  extractFirstImageUrl,
  getPostHeroImageUrl,
  getPostPreviewImageUrl,
  getPostShareImageUrl,
} from "@/lib/markdown-images";

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
  try {
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
        heroImageUrl: true,
        previewImageUrl: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    });
    return posts.map((p) => ({
      ...p,
      imageUrl: getPostPreviewImageUrl(p),
    }));
  } catch {
    // Local/dev without DB env, or a transient outage — homepage still renders.
    return [];
  }
}
