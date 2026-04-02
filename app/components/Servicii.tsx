'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Servicii() {
  const { lang } = useLang()
  const tr = t[lang].servicii

  return (
    <section id="servicii" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">{tr.title}</h2>
          <p className="text-white/40 max-w-xl mx-auto">{tr.sub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tr.items.map((s) => (
            <div key={s.titlu} className="group p-8 border border-white/5 hover:border-gold/30 bg-black/40 transition-all duration-500 hover:bg-black/60">
              <div className="text-3xl mb-6">{s.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-white mb-4">{s.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{s.descriere}</p>
              <ul className="space-y-2 mb-4">
                {s.features.map((f) => (
                  <li key={f} className="text-white/30 text-xs flex items-center gap-2">
                    <span className="text-gold">✓</span> {f}
                  </li>
                ))}
              </ul>
              {s.preturi && (
                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-1">
                  <p className="text-white/50 text-xs">
                    <span className="text-gold font-semibold">{s.preturi.implementare}</span>
                    <span className="text-white/30"> {tr.implementare}</span>
                  </p>
                  <p className="text-white/50 text-xs">
                    <span className="text-gold font-semibold">{s.preturi.mentinere}</span>
                    <span className="text-white/30"> {tr.mentinere}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
