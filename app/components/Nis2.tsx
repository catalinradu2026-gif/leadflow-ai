const NIS2_URL = '/evaluare-nis2'

export default function Nis2() {
  return (
    <section id="nis2" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <a
          href={NIS2_URL}
          title="Evaluare gratuită de conformitate NIS2 / ISO 27001 — aflați în 10 minute unde stă firma dvs."
          className="group flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 border border-white/10 hover:border-gold/40 bg-gradient-to-br from-zinc-900/80 to-black transition-all duration-500 hover:from-zinc-900"
        >
          {/* Iconiță */}
          <div className="shrink-0 relative">
            <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-2xl group-hover:bg-gold/30 transition-all duration-500" />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 bg-zinc-900 border border-gold/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-14 h-14 md:w-16 md:h-16 fill-none stroke-gold" strokeWidth="1.5">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Nou · Conformitate & securitate</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              Evaluare gratuită NIS2 / ISO 27001
            </h2>
            <p className="text-white/70 text-base md:text-lg">
              Legea NIS2 poate afecta firma dvs. chiar dacă nu sunteți în sectorul reglementat — prin furnizorii cu care lucrați.
            </p>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl mt-3 max-h-40 opacity-100 overflow-hidden transition-all duration-500 md:mt-0 md:max-h-0 md:opacity-0 md:group-hover:mt-3 md:group-hover:max-h-40 md:group-hover:opacity-100">
              Completați un formular de 10 minute și primiți gratuit, pe email, un document cu ce aveți deja bine,
              ce lipsește față de cerințele NIS2/ISO 27001, și un preț estimat dacă vreți să continuăm. Fără obligații.
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black text-xs font-semibold tracking-widest uppercase group-hover:bg-gold-light transition-all duration-300">
              Evaluare gratuită
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </section>
  )
}
