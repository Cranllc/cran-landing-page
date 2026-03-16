export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#F7F7F4] pt-32 pb-24 font-sans animate-pulse">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <div className="mb-24 lg:ml-48">
          <div className="h-10 w-24 bg-[#26251E]/10 rounded mb-4" />
          <div className="h-5 w-80 bg-[#26251E]/10 rounded" />
        </div>
        <div className="grid gap-16 lg:gap-24">
          {[1, 2, 3].map((i) => (
            <article key={i} className="flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-baseline">
              <div className="w-full lg:w-36 shrink-0 lg:text-right pt-2">
                <div className="h-4 w-20 bg-[#26251E]/10 rounded mb-1" />
                <div className="h-3 w-16 bg-[#26251E]/5 rounded hidden lg:block" />
              </div>
              <div className="flex-1 max-w-[650px]">
                <div className="h-8 w-3/4 bg-[#26251E]/10 rounded mb-4" />
                <div className="h-4 w-full bg-[#26251E]/5 rounded mb-4" />
                <div className="h-4 w-24 bg-[#26251E]/10 rounded" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
