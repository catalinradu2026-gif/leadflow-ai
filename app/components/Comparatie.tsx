export default function Comparatie() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Calculul real</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            Cât costă de fapt suport 24/7<br className="hidden md:block" />
            <span className="text-white/40"> pentru afacerea ta?</span>
          </h2>
        </div>

        {/* Carduri comparative */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Chenar 1 — Echipă umană */}
          <div className="relative border border-red-900/40 bg-red-950/10 p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(185,28,28,0.08)_0%,transparent_60%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-800/40 bg-red-900/10 mb-6">
                <span className="text-red-400 text-xs tracking-widest uppercase">Varianta tradițională</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                3 angajați care lucrează non-stop
              </h3>
              <p className="text-white/30 text-sm mb-8">Program în schimburi 24/7</p>

              <div className="mb-8">
                <p className="text-white/30 text-xs tracking-widest uppercase mb-2">Cost lunar</p>
                <div className="font-serif text-4xl font-bold text-red-400">
                  9.000 – 12.000 <span className="text-2xl">lei</span>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  '3 salarii net + taxe și contribuții',
                  'Program în schimburi (zi / noapte / weekend)',
                  'Concedii medicale, fluctuație de personal',
                  'Costuri extra (training, birou, utilități)',
                  'Risc de erori umane și răspuns variabil',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/50 text-sm">
                    <span className="text-red-500 text-base leading-none shrink-0 mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chenar 2 — AI Craiova */}
          <div className="relative border border-emerald-700/40 bg-emerald-950/10 p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(5,150,105,0.10)_0%,transparent_60%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-700/40 bg-emerald-900/10 mb-6">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs tracking-widest uppercase">AI Craiova</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Sistem AI complet
              </h3>
              <p className="text-white/30 text-sm mb-8">Bot + automatizări + mentenanță</p>

              <div className="mb-8 flex flex-col gap-2">
                <div>
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Investiție inițială</p>
                  <div className="font-serif text-3xl font-bold text-emerald-400">
                    de la 1.500 – 4.900 € <span className="text-base font-normal text-white/30">o singură dată</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Cost lunar</p>
                  <div className="font-serif text-3xl font-bold text-emerald-400">
                    400 € <span className="text-base font-normal text-white/30">mentenanță</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  'Răspunde instant 24/7 fără nicio pauză',
                  'Nu cere concediu, salariu sau bonusuri',
                  'Gestionează sute de mesaje simultan',
                  'Scalabil, consistent și fără erori',
                  'Recuperezi investiția în 2 luni',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/60 text-sm">
                    <span className="text-emerald-400 text-xs shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Concluzie */}
        <div className="border border-gold/20 bg-gold/5 p-8 text-center">
          <p className="text-white font-semibold text-lg md:text-xl leading-relaxed">
            Cu AI Craiova plătești de{' '}
            <span className="text-gold">10–15 ori mai puțin</span>{' '}
            și ai suport non-stop,<br className="hidden md:block" />
            precis și disponibil oricând.
          </p>
          <a
            href="#contact"
            className="inline-block mt-6 px-8 py-3 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300"
          >
            Vreau să economisesc →
          </a>
        </div>

      </div>
    </section>
  )
}
