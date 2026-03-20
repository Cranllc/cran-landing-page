/**
 * Public byline for a post: custom name wins, then linked User, then default.
 */
export function getPostAuthorDisplayName(post: {
  authorDisplayName?: string | null
  author?: { name: string | null; email?: string | null } | null
}): string {
  const custom = post.authorDisplayName?.trim()
  if (custom) return custom
  const fromUser =
    post.author?.name?.trim() ||
    (post.author?.email ? post.author.email.split("@")[0] : null)
  if (fromUser) return fromUser
  return "Cran Team"
}
