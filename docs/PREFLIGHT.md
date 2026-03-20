# Pre-release checks (blog SEO & editor)

Run automated tests, then do a quick manual pass before deploying.

## 1. Automated tests

```bash
npm run test
```

This covers markdown image parsing, alt replacement, featured vs body image URL logic (no database).

## 2. Database migration

Apply migrations **before** `npm run build` (build prerenders `/blog` and needs these columns):

```bash
# Local
npx prisma migrate dev

# Staging / production
npx prisma migrate deploy
```

Confirm `Post` has `seoTitle`, `seoDescription`, `featuredImageUrl`.

## 3. Manual — local (`npm run dev`)

- [ ] **Admin → open a post** — **Write** tab: edit body, save, no errors.
- [ ] **SEO** tab — SEO title, meta description, cover/featured URL + upload.
- [ ] **Assets** tab — Only markdown `![]()` images; editing **alt** updates markdown (switch to Write and confirm).
- [ ] **Use as cover** (on Assets) — Sets cover URL on SEO tab; toggle off clears it.
- [ ] **Copy URL** — Puts image URL on clipboard.
- [ ] **Published post** — Visit `/blog/{slug}`: hero uses featured or first image; view source or DevTools → `<script type="application/ld+json">` contains Article + BreadcrumbList.

## 4. Production smoke (after deploy)

- [ ] `https://www.getcran.ai/sitemap.xml` returns **200** XML.
- [ ] One blog URL: correct `<title>` (post title only; home is `Cran | …`) and meta description (custom or auto).
- [ ] Optional: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or Twitter Card Validator on a post URL.

## 5. Existing scripts

```bash
npm run test:ga   # GA consent helper (optional)
npm run build     # Must pass before ship
```
