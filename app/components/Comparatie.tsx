export default function Comparatie() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Calculul real</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            Variantă Tradițională vs AI
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Cât costă de fapt suport 24/7 pentru afacerea ta?
          </p>
        </div>

        {/* Carduri */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Card Tradițional */}
          <div className="relative border border-red-900/30 bg-red-950/8 p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(185,28,28,0.09)_0%,transparent_65%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-800/30 bg-red-900/10 mb-6">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-red-400 text-xs tracking-widest uppercase">Variantă tradițională</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-1">3 angajați umani 24/7</h3>
              <p className="text-white/30 text-sm mb-8">Program în schimburi non-stop</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-red-900/10 border border-red-900/20">
                  <p className="text-red-400/60 text-xs uppercase tracking-widest mb-1">Cost lunar</p>
                  <p className="font-serif text-2xl font-bold text-red-400">16.000–18.000</p>
                  <p className="text-white/30 text-xs">lei / lună</p>
                </div>
                <div className="p-4 bg-red-900/10 border border-red-900/20">
                  <p className="text-red-400/60 text-xs uppercase tracking-widest mb-1">Cost anual</p>
                  <p className="font-serif text-2xl font-bold text-red-400">192K–216K</p>
                  <p className="text-white/30 text-xs">lei / an</p>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  'Salarii nete + taxe și contribuții',
                  'Program în schimburi zi/noapte/weekend',
                  'Concedii medicale și fluctuație personal',
                  'Costuri birou, training, utilități',
                  'Erori umane și timp de răspuns variabil',
                  'Răspuns lent în orele de vârf',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/45 text-sm">
                    <span className="text-red-500 shrink-0 mt-0.5 text-base leading-none">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card AI Craiova */}
          <div className="relative border border-emerald-700/35 bg-emerald-950/8 p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(5,150,105,0.11)_0%,transparent_65%)]" />
            <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-black text-xs font-bold tracking-widest uppercase">
              Recomandat
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-700/35 bg-emerald-900/10 mb-6">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs tracking-widest uppercase">AI Craiova</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-1">Sistem AI complet</h3>
              <p className="text-white/30 text-sm mb-8">Bot + automatizări + mentenanță</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-emerald-900/10 border border-emerald-900/20">
                  <p className="text-emerald-400/60 text-xs uppercase tracking-widest mb-1">Implementare</p>
                  <p className="font-serif text-2xl font-bold text-emerald-400">500–4.900 €</p>
                  <p className="text-white/30 text-xs">o singură dată</p>
                </div>
                <div className="p-4 bg-emerald-900/10 border border-emerald-900/20">
                  <p className="text-emerald-400/60 text-xs uppercase tracking-widest mb-1">Mentenanță</p>
                  <p className="font-serif text-2xl font-bold text-emerald-400">100–400 €</p>
                  <p className="text-white/30 text-xs">/ lună</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gold/8 border border-gold/15">
                  <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">Economie lunară</p>
                  <p className="font-serif text-xl font-bold text-gold">15.600–17.900</p>
                  <p className="text-white/30 text-xs">lei față de 3 angajați</p>
                </div>
                <div className="p-4 bg-gold/8 border border-gold/15">
                  <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">Recuperare investiție</p>
                  <p className="font-serif text-xl font-bold text-gold">2–4 luni</p>
                  <p className="text-white/30 text-xs">din economii lunare</p>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  'Răspuns instant 24/7 fără nicio pauză',
                  'Nu cere concediu, salariu sau bonusuri',
                  'Gestionează sute de mesaje simultan',
                  'Scalabil, consistent și zero erori umane',
                  'Recuperezi investiția în 2–4 luni',
                  'Îmbunătățit continuu prin mentenanță',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/60 text-sm">
                    <span className="text-emerald-400 shrink-0 mt-0.5 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Concluzie */}
        <div className="border border-gold/20 bg-gold/5 p-8 md:p-10 text-center">
          <p className="text-white font-semibold text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Cu AI Craiova economisești de{' '}
            <span className="text-gold font-bold">10–15 ori mai mult</span>{' '}
            și îți recuperezi investiția complet în doar{' '}
            <span className="text-gold font-bold">2–4 luni.</span>
          </p>
          <a href="#contact"
            className="inline-block mt-6 px-8 py-3 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300">
            Calculează economia pentru afacerea ta →
          </a>
        </div>

      </div>
    </section>
  )
}
