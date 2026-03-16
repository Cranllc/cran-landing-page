import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Cached post fetch — dedupes generateMetadata + page component on blog/[slug]. */
export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
});
