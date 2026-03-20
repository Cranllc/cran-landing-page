-- Hero (article header) and preview (cards / OG) are separate from in-content markdown images.
ALTER TABLE "Post" ADD COLUMN "heroImageUrl" TEXT;
ALTER TABLE "Post" ADD COLUMN "previewImageUrl" TEXT;

-- Seed from legacy featured field so existing posts keep the same visuals.
UPDATE "Post"
SET
  "heroImageUrl" = "featuredImageUrl",
  "previewImageUrl" = "featuredImageUrl"
WHERE "featuredImageUrl" IS NOT NULL;
