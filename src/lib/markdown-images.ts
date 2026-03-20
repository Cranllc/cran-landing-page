/** Extract the first image URL from markdown content, e.g. ![alt](https://...) */
export function extractFirstImageUrl(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1].trim() : null;
}

/** Featured image URL if set and http(s), else first markdown image in body */
export function getPostShareImageUrl(post: {
  featuredImageUrl?: string | null;
  content: string;
}): string | null {
  const f = post.featuredImageUrl?.trim();
  if (f && (f.startsWith("https://") || f.startsWith("http://"))) return f;
  return extractFirstImageUrl(post.content);
}

/**
 * Turn a stored image URL into an absolute URL for `<img src>` (admin previews, etc.).
 * Supports `https://…`, `http://…`, and site-root paths like `/foo.jpg`.
 */
export function resolveImageUrlForPreview(url: string | null | undefined, siteBaseUrl: string): string | null {
  const u = url?.trim();
  if (!u) return null;
  if (u.startsWith("https://") || u.startsWith("http://")) return u;
  const base = siteBaseUrl.replace(/\/$/, "");
  if (u.startsWith("/") && base.length > 0) return `${base}${u}`;
  return null;
}

/** First `![alt](url)` in the post body as an absolute URL (admin list thumbnails). Ignores featured/cover. */
export function getFirstInPostImagePreviewUrl(content: string, siteBaseUrl: string): string | null {
  return resolveImageUrlForPreview(extractFirstImageUrl(content), siteBaseUrl);
}

/** One markdown image `![alt](url)` occurrence in content (by scan order). */
export type ParsedMarkdownImage = {
  index: number;
  alt: string;
  url: string;
  start: number;
  end: number;
};

const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

export function parseMarkdownImages(content: string): ParsedMarkdownImage[] {
  const out: ParsedMarkdownImage[] = [];
  let m: RegExpExecArray | null;
  let index = 0;
  const re = new RegExp(IMAGE_RE.source, "g");
  while ((m = re.exec(content)) !== null) {
    out.push({
      index: index++,
      alt: m[1],
      url: m[2].trim(),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return out;
}

/** Replace alt text for the Nth markdown image (0-based). `]` stripped from alt for valid MD. */
export function replaceMarkdownImageAlt(content: string, imageIndex: number, newAlt: string): string {
  const images = parseMarkdownImages(content);
  const target = images.find((img) => img.index === imageIndex);
  if (!target) return content;
  const safeAlt = newAlt.replace(/\]/g, "");
  const replacement = `![${safeAlt}](${target.url})`;
  return content.slice(0, target.start) + replacement + content.slice(target.end);
}
