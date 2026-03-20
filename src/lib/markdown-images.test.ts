import { describe, it, expect } from "vitest";
import {
  parseMarkdownImages,
  replaceMarkdownImageAlt,
  extractFirstImageUrl,
  getPostShareImageUrl,
  resolveImageUrlForPreview,
  getFirstInPostImagePreviewUrl,
  sanitizeMarkdownImageAlt,
} from "./markdown-images";

describe("sanitizeMarkdownImageAlt", () => {
  it("strips brackets that would break ![alt](url)", () => {
    expect(sanitizeMarkdownImageAlt("shot ] oops.png")).toBe("shot  oops.png");
  });

  it("uses fallback when empty after sanitize", () => {
    expect(sanitizeMarkdownImageAlt("]")).toBe("Image");
  });
});

describe("parseMarkdownImages", () => {
  it("returns empty array when no images", () => {
    expect(parseMarkdownImages("Hello world")).toEqual([]);
  });

  it("parses one image with alt and url", () => {
    const md = "Intro\n\n![A cat](https://cdn.example.com/cat.png)\n\nOutro";
    const imgs = parseMarkdownImages(md);
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toMatchObject({
      index: 0,
      alt: "A cat",
      url: "https://cdn.example.com/cat.png",
    });
    expect(md.slice(imgs[0].start, imgs[0].end)).toBe("![A cat](https://cdn.example.com/cat.png)");
  });

  it("parses multiple images in order", () => {
    const md = "![one](https://a.com/1.png) x ![two](https://b.com/2.jpg)";
    const imgs = parseMarkdownImages(md);
    expect(imgs).toHaveLength(2);
    expect(imgs[0].alt).toBe("one");
    expect(imgs[1].alt).toBe("two");
    expect(imgs[1].index).toBe(1);
  });

  it("allows empty alt", () => {
    const imgs = parseMarkdownImages("![](https://x.com/y.png)");
    expect(imgs).toHaveLength(1);
    expect(imgs[0].alt).toBe("");
  });
});

describe("replaceMarkdownImageAlt", () => {
  it("replaces alt for image at index 0", () => {
    const before = "![old](https://x.com/a.png)";
    const after = replaceMarkdownImageAlt(before, 0, "new alt");
    expect(after).toBe("![new alt](https://x.com/a.png)");
  });

  it("replaces alt for second image only", () => {
    const before = "![a](https://x.com/1.png) ![b](https://x.com/2.png)";
    const after = replaceMarkdownImageAlt(before, 1, "B updated");
    expect(after).toBe("![a](https://x.com/1.png) ![B updated](https://x.com/2.png)");
  });

  it("strips ] from alt to keep markdown valid", () => {
    const after = replaceMarkdownImageAlt("![x](https://x.com/z.png)", 0, "bad]alt");
    expect(after).toBe("![badalt](https://x.com/z.png)");
  });

  it("returns original content for invalid index", () => {
    const md = "![a](https://x.com/1.png)";
    expect(replaceMarkdownImageAlt(md, 99, "nope")).toBe(md);
  });
});

describe("extractFirstImageUrl", () => {
  it("returns first http url from markdown", () => {
    expect(extractFirstImageUrl("text ![x](https://cdn.com/i.png) more")).toBe("https://cdn.com/i.png");
  });

  it("returns null when no image", () => {
    expect(extractFirstImageUrl("no images here")).toBeNull();
  });
});

describe("getPostShareImageUrl", () => {
  it("prefers featuredImageUrl when http(s)", () => {
    expect(
      getPostShareImageUrl({
        featuredImageUrl: "https://featured.com/h.jpg",
        content: "![x](https://body.com/b.png)",
      })
    ).toBe("https://featured.com/h.jpg");
  });

  it("ignores empty featured and uses body image", () => {
    expect(
      getPostShareImageUrl({
        featuredImageUrl: "  ",
        content: "![x](https://body.com/b.png)",
      })
    ).toBe("https://body.com/b.png");
  });

  it("falls back to first markdown image when featured is relative", () => {
    expect(
      getPostShareImageUrl({
        featuredImageUrl: "/uploads/x.png",
        content: "![x](https://body.com/b.png)",
      })
    ).toBe("https://body.com/b.png");
  });

  it("returns null when nothing usable", () => {
    expect(getPostShareImageUrl({ featuredImageUrl: null, content: "no img" })).toBeNull();
  });
});

describe("resolveImageUrlForPreview", () => {
  const base = "https://www.example.com";

  it("returns https URLs unchanged", () => {
    expect(resolveImageUrlForPreview("https://cdn.com/a.png", base)).toBe("https://cdn.com/a.png");
  });

  it("joins root-relative paths to site base", () => {
    expect(resolveImageUrlForPreview("/dog.jpg", base)).toBe("https://www.example.com/dog.jpg");
  });

  it("returns null for empty base and relative path", () => {
    expect(resolveImageUrlForPreview("/x.png", "")).toBeNull();
  });
});

describe("getFirstInPostImagePreviewUrl", () => {
  const base = "https://www.example.com";

  it("uses first markdown image only (ignores featured concept)", () => {
    expect(
      getFirstInPostImagePreviewUrl("![a](https://z.com/1.png)", base)
    ).toBe("https://z.com/1.png");
  });

  it("resolves root-relative image in markdown", () => {
    expect(getFirstInPostImagePreviewUrl("![](/uploads/x.png)", base)).toBe(
      "https://www.example.com/uploads/x.png"
    );
  });

  it("returns null when no images in body", () => {
    expect(getFirstInPostImagePreviewUrl("No images here", base)).toBeNull();
  });
});
