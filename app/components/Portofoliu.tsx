'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Portofoliu() {
  const { lang } = useLang()
  const tr = t[lang].portofoliu

  return (
    <section id="portofoliu" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            {tr.title}
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            {tr.sub}
          </p>
        </div>

        {/* Cazuri */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tr.items.map((caz) => (
            <div key={caz.client}
              className="relative border border-white/8 bg-black/50 overflow-hidden flex flex-col hover:border-gold/20 transition-colors duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.05)_0%,transparent_60%)]" />

              <div className="relative z-10 p-8 flex flex-col flex-1">
                {/* Header card */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-white/25 text-xs tracking-widest uppercase block mb-2">{caz.categorie}</span>
                    <h3 className="font-serif text-xl font-bold text-white leading-snug">{caz.client}</h3>
                  </div>
                  <span className={`shrink-0 text-xs px-3 py-1 tracking-widest uppercase ${
                    caz.tag === 'Realizat' || caz.tag === 'Delivered' ? 'bg-gold/15 text-gold' : 'bg-white/5 text-white/30'
                  }`}>
                    {caz.tag}
                  </span>
                </div>

                {/* Descriere */}
                <p className="text-white/50 text-sm leading-relaxed mb-6">{caz.descriere}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {caz.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-white/50 text-xs">
                      <span className="text-gold shrink-0 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Rezultat */}
                <div className="border border-gold/15 bg-gold/5 px-5 py-4 mb-5">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-1">{tr.rezultatLabel}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{caz.rezultat}</p>
                </div>

                {/* Recenzie */}
                {caz.recenzie && (
                  <div className="border-l-2 border-gold/30 pl-4 mb-5">
                    <p className="text-white/40 text-xs italic leading-relaxed">
                      &ldquo;{caz.recenzie}&rdquo;
                    </p>
                    <p className="text-white/20 text-xs mt-1">{tr.recenzieAutor}</p>
                  </div>
                )}

                {/* Link */}
                {caz.link ? (
                  <a href={caz.link} target="_blank" rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors group">
                    {tr.veziSite}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                ) : (
                  <a href="#contact"
                    className="mt-auto inline-flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase hover:text-gold transition-colors group">
                    {tr.similar}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Slot disponibil */}
        <div className="mt-6 p-8 border border-white/5 border-dashed text-center hover:border-gold/10 transition-colors">
          <p className="text-white/20 text-xs tracking-widest uppercase mb-2">{tr.slotLabel}</p>
          <p className="text-white/30 text-sm">{tr.slotText}</p>
          <a href="#contact" className="inline-block mt-4 text-gold/60 text-xs tracking-widest uppercase hover:text-gold transition-colors">
            {tr.slotCta}
          </a>
        </div>

      </div>
    </section>
  )
}
