'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function DeceNoi() {
  const { lang } = useLang()
  const tr = t[lang].deceNoi

  return (
    <section className="py-32 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">{tr.title}</h2>
          <p className="text-white/40 max-w-xl mx-auto">{tr.sub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tr.items.map((m) => (
            <div key={m.titlu} className="p-8 border border-white/5 hover:border-gold/20 transition-all duration-300">
              <div className="text-3xl mb-4">{m.icon}</div>
              <h3 className="font-semibold text-white mb-3">{m.titlu}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{m.descriere}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
