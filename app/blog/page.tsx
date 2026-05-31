export const metadata = {
  title: "Blog | E-Cell IISER Bhopal",
  description: "Read the latest articles, startup insights, and entrepreneurship news from E-Cell IISER Bhopal.",
};

export default function BlogPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Blog</span>
      </h1>
      <p className="text-white/50 max-w-md mx-auto mb-8">
        Insights, stories, and updates from the world of entrepreneurship. We are currently curating our first posts.
      </p>
      <div className="px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-2xl">
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest font-bold">
          Coming Soon
        </p>
      </div>
    </div>
  );
}