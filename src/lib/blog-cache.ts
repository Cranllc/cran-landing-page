import { cache } from "react";
import type { Post, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * DB columns that older generated `Post` types may omit (pre-migration) — intersect so blog metadata always type-checks.
 */
type PostSeoColumns = {
  seoTitle: string | null;
  seoDescription: string | null;
  featuredImageUrl: string | null;
};

/** Full row + author for public blog post pages. */
export type BlogPostWithAuthor = Post & PostSeoColumns & { author: User };

/** Cached post fetch — dedupes generateMetadata + page component on blog/[slug]. */
export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPostWithAuthor | null> => {
    return prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });
  }
);
