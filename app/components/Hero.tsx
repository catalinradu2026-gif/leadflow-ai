export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-8 animate-fade-in">
          Agenție de Automatizări AI
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-8 animate-fade-up">
          Transformăm afacerea ta într-un{' '}
          <span className="text-gold">sistem automat</span>{' '}
          de vânzare
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up animate-delay-200">
          Implementăm soluții AI care atrag, califică și convertesc clienți fără intervenție manuală.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-300">
          <a
            href="#contact"
            className="px-10 py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300"
          >
            Solicită o demonstrație
          </a>
          <a
            href="#servicii"
            className="px-10 py-4 border border-white/20 text-white/70 text-sm tracking-widest uppercase hover:border-white/50 hover:text-white transition-all duration-300"
          >
            Descoperă serviciile
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs tracking-widest">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        SCROLL
      </div>
    </section>
  )
}
