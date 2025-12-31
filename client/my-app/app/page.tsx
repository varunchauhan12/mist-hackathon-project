export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2a140a] via-[#1a0d07] to-black text-amber-100">
      
      {/* HERO / TEST SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-amber-300 drop-shadow-xl">
          MysticSikkim
        </h1>

        <p className="mt-4 max-w-2xl text-lg md:text-xl text-amber-200 leading-relaxed">
          A glassmorphic Next.js experience to explore the spiritual heritage,
          monasteries, and culture of Sikkim.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <button className="px-8 py-3 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-500 transition">
            Explore Now
          </button>

          <button className="px-8 py-3 rounded-xl border-2 border-amber-400 text-amber-300 hover:bg-amber-400/10 transition">
            View Features
          </button>
        </div>
      </section>

      {/* SCROLL TEST CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        {[1, 2, 3].map((block) => (
          <div
            key={block}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-amber-300 mb-3">
              Glassmorphism Test Section {block}
            </h2>
            <p className="text-amber-200 leading-relaxed">
              Scroll the page to observe the navbar transitioning into a
              glassmorphic state. This section exists only to create vertical
              space and test layout stability, blur layers, and contrast
              handling across devices.
            </p>
          </div>
        ))}
      </section>

      {/* FOOTER SPACER (OPTIONAL) */}
      <div className="h-20" />
    </main>
  );
}
