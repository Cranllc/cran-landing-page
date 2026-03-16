# Optimization & SEO Audit

## Fixes Applied (No Extra Charges)

### 1. **Duplicate Database Call Removed** ✅
- **Blog post pages** (`/blog/[slug]`) were fetching the same post **twice** (generateMetadata + page component)
- **Fix:** Added `getPostBySlug` in `src/lib/blog-cache.ts` using React's `cache()` — one DB call per page load

### 2. **NextAuth Debug Disabled in Production** ✅
- `debug: true` was always on, causing extra server logs
- **Fix:** `debug: process.env.NODE_ENV === "development"` — no console spam in production

### 3. **Scroll Listener Optimized** ✅
- Header scroll listener now uses `{ passive: true }` — improves scroll performance, no layout thrashing

### 4. **Existing Safeguards (Already in Place)**
- **GA:** `cranGALoaded` guard prevents multiple gtag script loads
- **Prisma:** Single instance via `globalThis` (no connection pool explosion)
- **CookieConsent:** Event listeners cleaned up in useEffect returns
- **IntersectionObserver:** useCounter and useReveal disconnect on unmount

---

## Cost Audit — What Bills You

| Service | Trigger | Cost Control |
|---------|---------|--------------|
| **Vercel** | Deployments, serverless invocations, bandwidth | Static pages cached. DB calls only on dynamic routes. |
| **Postgres (Prisma)** | Page loads, admin actions | Blog slug: 1 call (was 2). Home: 1 call for 3 posts. Sitemap: 1 call. |
| **Resend** | Magic link (sign-in), waitlist blast | User-triggered only. Debug endpoint disabled in production. |
| **Supabase Storage** | Blog image uploads (admin) | Only when you upload. No background sync. |
| **Google Analytics** | Page views (when consent granted) | Free tier. Consent Mode = no collection until user accepts. |

**No identified redundant calls.** All fetches are request-scoped and necessary.

---

## SEO — How to Rank Higher

### Already Implemented ✅
- Unique `<title>`, `<meta description>`, Open Graph per page
- Canonical URLs, sitemap.xml, robots.txt
- JSON-LD structured data (SoftwareApplication, WebSite, FAQ, Article)
- Semantic HTML, proper heading hierarchy
- Blog posts in sitemap with lastModified, priority, changeFrequency

### Recommended Next Steps

1. **Google Search Console**
   - Add property: https://search.google.com/search-console
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: `https://getcran.ai/sitemap.xml`

2. **Bing Webmaster Tools**
   - https://www.bing.com/webmasters
   - Submit same sitemap

3. **Content & Keywords**
   - Target phrases like "shelter management software", "animal shelter software", "kennel management"
   - Add more blog posts around those terms
   - Use internal links (blog → homepage, feature sections)

4. **Core Web Vitals**
   - Images: use `priority` on above-the-fold images, `loading="lazy"` on rest
   - Fonts: Outfit uses `display: swap` — good
   - Consider `next/image` for blog hero images

5. **Backlinks**
   - Get listed on shelter/rescue directories, software comparison sites
   - Press, partnerships, guest posts

6. **robots.txt Note**
   - AI crawlers (GPTBot, PerplexityBot, etc.) are currently disallowed
   - This reduces AI answer traffic but can protect content from training
   - To allow AI citations: remove those `disallow` rules from `src/app/robots.ts`
