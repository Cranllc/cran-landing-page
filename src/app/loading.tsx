export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cran border-t-transparent animate-spin" aria-hidden />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
