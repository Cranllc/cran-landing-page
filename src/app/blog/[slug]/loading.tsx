export default function BlogPostLoading() {
  return (
    <article className="min-h-screen bg-[#F7F7F4] pt-32 pb-32 font-sans animate-pulse">
      <div className="mx-auto max-w-5xl px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
        <aside className="w-full lg:w-36 shrink-0">
          <div className="h-4 w-12 bg-[#26251E]/10 rounded mb-8" />
          <div className="h-3 w-20 bg-[#26251E]/5 rounded mb-8" />
          <div className="h-4 w-24 bg-[#26251E]/10 rounded mb-8" />
          <div className="h-16 w-full bg-[#26251E]/5 rounded mt-8 pt-8 border-t border-[#26251E]/10" />
        </aside>
        <div className="flex-1 max-w-[650px]">
          <div className="h-4 w-32 bg-[#26251E]/10 rounded mb-6 lg:hidden" />
          <div className="h-10 w-full bg-[#26251E]/10 rounded mb-8" />
          <div className="h-32 w-full aspect-[2/1] bg-[#26251E]/5 rounded-md mb-12" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-full bg-[#26251E]/5 rounded" />
            ))}
          </div>
          <hr className="my-16 border-[#26251E]/10" />
          <div className="flex justify-between gap-4">
            <div className="h-9 w-32 bg-[#26251E]/10 rounded" />
            <div className="h-4 w-24 bg-[#26251E]/5 rounded" />
          </div>
        </div>
      </div>
    </article>
  );
}
