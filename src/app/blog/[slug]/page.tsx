import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
    include: { author: true }
  });

  if (!post) {
    return {
      title: 'Post Not Found | Cran',
      description: 'The requested blog post could not be found.',
    }
  }

  // Extract a brief excerpt for the description
  const excerpt = post.content.replace(/[#*`_>]/g, '').substring(0, 160) + '...';
  const authorName = post.author?.name || post.author?.email?.split('@')[0] || "Cran Team";

  return {
    title: `${post.title} | Cran Blog`,
    description: excerpt,
    authors: [{ name: authorName }],
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://cran.us.com/blog/${post.slug}`,
      siteName: 'Cran Animal Shelter Software',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
    },
    alternates: {
      canonical: `https://cran.us.com/blog/${post.slug}`,
    }
  }
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
    include: { author: true }
  });

  if (!post || !post.published) {
    notFound();
  }

  const dateString = new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const authorName = post.author?.name || post.author?.email?.split('@')[0] || "Cran Team";

  // 2026 SEO: JSON-LD Structured Data for AI overviews and rich search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  }

  return (
    <article className="min-h-screen bg-[#F7F7F4] pt-32 pb-32 font-sans selection:bg-cran selection:text-white">
      {/* Inject JSON-LD structured data to the DOM safely */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          
          <div className="hidden lg:block text-sm">
            <p className="text-[#26251E]/70 font-medium mb-1">{dateString}</p>
            <p className="text-[#26251E]/40">by {authorName}</p>
          </div>
        </aside>

        {/* Main Reading Column */}
        <div className="flex-1 max-w-[650px] w-full">
          
          {/* Mobile Metadata */}
          <div className="lg:hidden mb-6 text-sm">
            <p className="text-[#26251E]/70 font-medium inline-block mr-3">{dateString}</p>
            <p className="text-[#26251E]/40 inline-block">by {authorName}</p>
          </div>

          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[#26251E] tracking-tight leading-[1.15] mb-8">
              {post.title}
            </h1>
            
            {/* Minimalist Hero Graphic */}
            <div className="w-full aspect-[2/1] bg-[#8B939C] rounded-md overflow-hidden relative mb-12 flex items-center justify-center">
              {/* Abstract wireframe loops to mimic Cursor's hero */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-[80%] h-[60%] border-t border-b border-white rounded-[100%] absolute mix-blend-overlay"></div>
                <div className="w-[70%] h-[70%] border-t border-b border-white rounded-[100%] absolute mix-blend-overlay rotate-[15deg]"></div>
                <div className="w-[70%] h-[70%] border-t border-b border-white rounded-[100%] absolute mix-blend-overlay -rotate-[15deg]"></div>
                <div className="w-[40%] h-[80%] border-l border-r border-white rounded-[100%] absolute mix-blend-overlay"></div>
              </div>
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
                code: ({...props}) => <code className="bg-[#1a1a1a]/5 text-[#B83A2E] px-1.5 py-0.5 rounded font-mono text-[14px]" {...props} />
              }}
            >
              {post.content}
            </ReactMarkdown>
            
            <p className="mt-8 mb-6">
              <span className="inline-block w-3 h-3 bg-cran relative top-[-1px] ml-1"></span>
            </p>
          </div>

          <hr className="my-16 border-[#26251E]/10" />

        </div>
      </div>
    </article>
  );
}
