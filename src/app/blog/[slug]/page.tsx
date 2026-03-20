import Link from 'next/link';
import { getPostBySlug, type BlogPostWithAuthor } from '@/lib/blog-cache';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/site-config';
import { getPostHeroImageUrl, getPostPreviewImageUrl } from '@/lib/markdown-images';
import { sanitizeMarkdownPasteArtifacts } from '@/lib/sanitize-markdown-paste';
import ShareArticleClient from '@/components/ShareArticleClient';
import Image from 'next/image';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const metaDescription = (() => {
    const custom = post.seoDescription?.trim();
    if (custom) return custom.slice(0, 320);
    const stripped = post.content.replace(/[#*`_>]/g, "").trim();
    const excerpt = stripped.slice(0, 157);
    return excerpt + (stripped.length > 157 ? "..." : "");
  })();
  const authorName = post.author?.name || post.author?.email?.split('@')[0] || "Cran Team";
  const shareImage = getPostPreviewImageUrl(post);
  const hasShareImage = Boolean(
    shareImage && (shareImage.startsWith("https://") || shareImage.startsWith("http://"))
  );

  const pageTitle = post.seoTitle?.trim() || post.title;
  return {
    title: pageTitle,
    description: metaDescription,
    authors: [{ name: authorName }],
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: 'Cran',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [authorName],
      ...(hasShareImage &&
        shareImage && {
          images: [{ url: shareImage, alt: post.title, width: 1200, height: 630 }],
        }),
    },
    twitter: {
      card: hasShareImage ? 'summary_large_image' : 'summary',
      title: pageTitle,
      description: metaDescription,
      ...(hasShareImage && shareImage && { images: [shareImage] }),
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    }
  }
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post: BlogPostWithAuthor | null = await getPostBySlug(resolvedParams.slug);

  if (!post || !post.published) {
    notFound();
  }

  const dateString = new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const authorName = post.author?.name || post.author?.email?.split('@')[0] || "Cran Team";
  const heroImageUrl = getPostHeroImageUrl(post);
  const hasHeroImage = Boolean(
    heroImageUrl && (heroImageUrl.startsWith("https://") || heroImageUrl.startsWith("http://"))
  );
  const base = SITE_URL.replace(/\/$/, "");
  const canonicalUrl = `${base}/blog/${post.slug}`;
  const ogImageUrl = `${base}/openGraph.png`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(hasHeroImage && heroImageUrl ? { image: [heroImageUrl] } : {}),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Cran, LLC",
      logo: {
        "@type": "ImageObject",
        url: ogImageUrl,
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <article id="main-content" className="min-h-screen bg-[#F7F7F4] pt-32 pb-32 font-sans selection:bg-cran selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      
      <div className="mx-auto max-w-5xl px-6 lg:px-12 relative flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Sidebar / Breadcrumbs (Sticky on Desktop) */}
        <aside className="w-full lg:w-36 shrink-0 relative lg:sticky lg:top-32 h-fit">
          <nav className="mb-8 lg:mb-12">
            <Link 
              href="/blog" 
              className="text-sm font-semibold text-[#26251E]/40 hover:text-[#26251E] transition-colors flex items-center gap-1.5"
            >
              <span aria-hidden="true" className="rotate-[225deg] inline-block">&uarr;</span> Blog
            </Link>
          </nav>
          
          {post.category && (
            <div className="mb-8 lg:mb-12 hidden lg:block">
              <span className="text-[11px] font-bold tracking-wider uppercase text-cran bg-cran/5 px-2.5 py-1 rounded-md border border-cran/10 inline-block">
                {post.category}
              </span>
            </div>
          )}

          <div className="hidden lg:block text-sm">
            <time className="text-[#26251E]/70 font-medium mb-1 block" suppressHydrationWarning dateTime={new Date(post.createdAt).toISOString().split("T")[0]}>{dateString}</time>
            <p className="text-[#26251E]/40">by {authorName}</p>
          </div>

          <div className="hidden lg:block mt-8 pt-8 border-t border-[#26251E]/10">
            <ShareArticleClient url={`${SITE_URL}/blog/${post.slug}`} title={post.title} stacked />
          </div>
        </aside>

        {/* Main Reading Column */}
        <div className="flex-1 max-w-[650px] w-full">
          
          {/* Mobile Metadata */}
          <div className="lg:hidden mb-6 text-sm flex items-center flex-wrap gap-3">
            {post.category && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-cran bg-cran/5 px-2 py-0.5 rounded border border-cran/10">
                {post.category}
              </span>
            )}
            <div>
              <time className="text-[#26251E]/70 font-medium inline-block mr-3" suppressHydrationWarning dateTime={new Date(post.createdAt).toISOString().split("T")[0]}>{dateString}</time>
              <p className="text-[#26251E]/40 inline-block">by {authorName}</p>
            </div>
          </div>

          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[#26251E] tracking-tight leading-[1.15] mb-6">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-[11px] font-bold tracking-wider uppercase text-[#26251E]/60 bg-white border border-[#E5E5E0] px-2.5 py-1 rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Hero image or branded placeholder (matches landing page preview) */}
            <div className="w-full aspect-[2/1] rounded-md overflow-hidden relative mb-12 flex items-center justify-center">
              {hasHeroImage && heroImageUrl ? (
                <img
                  src={heroImageUrl}
                  alt={`Hero image for ${post.title}`}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: `
                      radial-gradient(ellipse 120% 80% at 10% 90%, rgba(214, 68, 54, 0.2) 0%, transparent 55%),
                      radial-gradient(ellipse 100% 100% at 90% 10%, rgba(214, 68, 54, 0.14) 0%, transparent 50%),
                      radial-gradient(ellipse 70% 90% at 70% 65%, rgba(208, 196, 184, 0.5) 0%, transparent 55%),
                      radial-gradient(ellipse 90% 70% at 25% 30%, rgba(250, 250, 248, 0.95) 0%, transparent 50%),
                      linear-gradient(155deg, #F5EDE8 0%, #FAFAF8 40%, #EFE8E3 75%, #EDE6E1 100%)
                    `
                  }}
                >
                  <div className="absolute top-[15%] right-[20%] w-20 h-20 rounded-full bg-cran/10 blur-xl" />
                  <div className="absolute bottom-[25%] left-[15%] w-24 h-24 rounded-full bg-[#D0C4B8]/40 blur-2xl" />
                  <div className="absolute top-[50%] left-[45%] w-16 h-16 rounded-full bg-cran/8 blur-lg" />
                  <Image
                    src="/cran-logo.png"
                    alt=""
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain opacity-30 relative z-10 drop-shadow-sm"
                  />
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-lg prose-neutral max-w-none text-[#26251E] prose-p:text-[#26251E]/90 prose-p:font-medium prose-p:leading-relaxed prose-headings:text-[#26251E] prose-headings:tracking-tight prose-a:text-cran prose-a:no-underline hover:prose-a:underline prose-strong:text-[#26251E]">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({...props}) => <p className="text-[17px] leading-relaxed text-[#26251E]/80 mb-6 font-medium" {...props} />,
                h1: ({...props}) => <h1 className="text-3xl font-bold text-[#26251E] tracking-tight mt-16 mb-6" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-bold text-[#26251E] tracking-tight mt-16 mb-6" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-bold text-[#26251E] tracking-tight mt-12 mb-4" {...props} />,
                a: ({ href, children, className, ...props }) => {
                  const external = typeof href === "string" && /^https?:\/\//i.test(href)
                  return (
                    <a
                      href={href}
                      className={`text-cran font-semibold underline-offset-[3px] decoration-cran/35 decoration-2 hover:underline ${className ?? ""}`}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...props}
                    >
                      {children}
                    </a>
                  )
                },
                code: ({...props}) => <code className="bg-[#1a1a1a]/5 text-[#B83A2E] px-1.5 py-0.5 rounded font-mono text-[14px]" {...props} />,
                img: ({ src, alt, ...props }) => {
                  if (!src || typeof src !== "string") return null;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={alt ?? ""}
                      className="not-prose block w-full max-w-full h-auto my-8 first:mt-0 rounded-lg border border-[#26251E]/10 bg-[#FAFAF8] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                      loading="lazy"
                      decoding="async"
                      {...props}
                    />
                  );
                },
              }}
            >
              {sanitizeMarkdownPasteArtifacts(post.content)}
            </ReactMarkdown>
            
            <p className="mt-8 mb-6">
              <span className="inline-block w-3 h-3 bg-cran relative top-[-1px] ml-1"></span>
            </p>
          </div>

          <hr className="my-16 border-[#26251E]/10" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ShareArticleClient url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#26251E]/70 hover:text-cran transition-colors flex items-center gap-1.5"
            >
              <span aria-hidden="true" className="rotate-[225deg] inline-block">&uarr;</span> Back to blog
            </Link>
          </div>

        </div>
      </div>
    </article>
  );
}
