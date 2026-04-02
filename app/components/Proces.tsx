'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Proces() {
  const { lang } = useLang()
  const tr = t[lang].proces

  return (
    <section id="proces" className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">{tr.title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Linie conectoare */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          {tr.items.map((pas) => (
            <div key={pas.nr} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/30 text-gold font-serif text-xl mb-8 relative">
                {pas.nr}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-4">{pas.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{pas.descriere}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
