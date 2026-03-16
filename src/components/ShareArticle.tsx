"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Check } from "lucide-react";

type ShareArticleProps = {
  url: string;
  title: string;
  className?: string;
  stacked?: boolean;
};

export default function ShareArticle({ url, title, className = "", stacked = false }: ShareArticleProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex ${stacked ? "flex-col items-start gap-3" : "flex-wrap items-center gap-2"} ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
        Share
      </span>
      <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-charcoal/15 bg-white text-charcoal/60 hover:text-cran hover:border-cran/30 transition-colors"
        title="Copy link"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} className="text-cran" aria-hidden /> : <Link2 size={16} aria-hidden />}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-charcoal/15 bg-white text-charcoal/60 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-colors"
        title="Share on X"
        aria-label="Share on X"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-charcoal/15 bg-white text-charcoal/60 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-colors"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} aria-hidden />
      </a>
      </div>
    </div>
  );
}
