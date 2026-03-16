"use client";

import dynamic from "next/dynamic";

const ShareArticle = dynamic(() => import("@/components/ShareArticle"), {
  ssr: false, // Share buttons are non-critical, load after hydration
  loading: () => (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-3 w-10 bg-[#26251E]/10 rounded" />
      <div className="flex gap-2">
        <div className="w-9 h-9 rounded-lg bg-[#26251E]/5" />
        <div className="w-9 h-9 rounded-lg bg-[#26251E]/5" />
        <div className="w-9 h-9 rounded-lg bg-[#26251E]/5" />
      </div>
    </div>
  ),
});

type ShareArticleProps = {
  url: string;
  title: string;
  className?: string;
  stacked?: boolean;
};

export default function ShareArticleClient({ url, title, className, stacked }: ShareArticleProps) {
  return <ShareArticle url={url} title={title} className={className} stacked={stacked} />;
}
