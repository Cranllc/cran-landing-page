import HomePage from "@/components/HomePage";
import { getLatestPublishedPosts } from "@/lib/blog";

export default async function Home() {
  const posts = await getLatestPublishedPosts();

  const serializedPosts = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    dateString: p.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    imageUrl: p.imageUrl,
  }));

  return <HomePage blogPosts={serializedPosts} />;
}
