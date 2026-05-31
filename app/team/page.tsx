// app/team/page.tsx
export const metadata = {
  title: "Our Team",
  description: "Meet the passionate students and faculty behind the Entrepreneurship Cell at IISER Bhopal.",
};

export default function TeamPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Team</span>
      </h1>
      <p className="text-white/50 max-w-md mx-auto mb-8">
        The innovators, thinkers, and builders working behind the scenes to foster a culture of entrepreneurship on campus.
      </p>
      <div className="px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-2xl">
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest font-bold">
          Coming Soon
        </p>
      </div>
    </div>
  );
}