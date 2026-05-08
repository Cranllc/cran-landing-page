/** Alt text safe inside `![alt](url)`; `]` or newlines break the markdown parser. */
export function sanitizeMarkdownImageAlt(alt: string): string {
  const cleaned = alt
    .replace(/\u00a0|\u202f|\u2007/g, " ") // NBSP / narrow NBSP (common in macOS screenshot names)
    .replace(/\]/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
  return cleaned.length > 0 ? cleaned : "Image";
}

/** Extract the first image URL from markdown content, e.g. ![alt](https://...) */
export function extractFirstImageUrl(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1].trim() : null;
}

/** Normalized https URL or null (ignores root-relative here; use resolveImageUrlForPreview for admin). */
export function pickHttpImageUrl(url: string | null | undefined): string | null {
  const u = url?.trim();
  if (!u) return null;
  if (u.startsWith("https://") || u.startsWith("http://")) return u;
  return null;
}

/**
 * Article header image only. Never uses markdown body images.
 * Legacy: falls back to `featuredImageUrl` if `heroImageUrl` is empty.
 */
export function getPostHeroImageUrl(post: {
  heroImageUrl?: string | null;
  featuredImageUrl?: string | null;
}): string | null {
  return pickHttpImageUrl(post.heroImageUrl) || pickHttpImageUrl(post.featuredImageUrl);
}

/**
 * Blog cards + Open Graph / Twitter. Order: preview → hero → legacy featured.
 * Never uses markdown body images.
 */
export function getPostPreviewImageUrl(post: {
  previewImageUrl?: string | null;
  heroImageUrl?: string | null;
  featuredImageUrl?: string | null;
}): string | null {
  return (
    pickHttpImageUrl(post.previewImageUrl) ||
    pickHttpImageUrl(post.heroImageUrl) ||
    pickHttpImageUrl(post.featuredImageUrl)
  );
}

/**
 * @deprecated Prefer getPostPreviewImageUrl. Kept for imports; ignores `content` (no body fallback).
 */
export function getPostShareImageUrl(post: {
  featuredImageUrl?: string | null;
  content?: string;
  previewImageUrl?: string | null;
  heroImageUrl?: string | null;
}): string | null {
  return getPostPreviewImageUrl(post);
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

/** Remove the Nth `![alt](url)` from markdown (0-based scan order). Does not delete remote files. */
export function removeMarkdownImageAtIndex(content: string, imageIndex: number): string {
  const images = parseMarkdownImages(content);
  const target = images.find((img) => img.index === imageIndex);
  if (!target) return content;
  const before = content.slice(0, target.start);
  const after = content.slice(target.end);
  const merged = before + after;
  return merged.replace(/\n{3,}/g, "\n\n");
}
