import HomePage from "@/components/HomePage";
import { getLatestPublishedPosts } from "@/lib/blog";

export default async function Home() {
  const posts = await getLatestPublishedPosts();

  const serializedPosts = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    imageUrl: p.imageUrl,
  }));

  return <HomePage blogPosts={serializedPosts} />;
}
