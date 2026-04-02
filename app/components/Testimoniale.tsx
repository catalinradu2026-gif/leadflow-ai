'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Testimoniale() {
  const { lang } = useLang()
  const tr = t[lang].testimoniale

  return (
    <section className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">{tr.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">{tr.title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tr.items.map((item, i) => (
            <div key={i} className={`p-8 border bg-black/40 hover:border-gold/10 transition-all duration-300 flex flex-col ${i === 1 ? 'border-gold/25 bg-gold/[0.03]' : 'border-white/5'}`}>
              {item.tag && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-5 self-start">
                  {item.tag}
                </div>
              )}
              <div className="text-gold text-3xl font-serif mb-6">"</div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 italic flex-1">{item.text}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold shrink-0 ${i === 1 ? 'bg-gold/30 text-gold' : 'bg-gold/20 text-gold'}`}>
                  {item.initiale}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{item.nume}</div>
                  <div className="text-white/30 text-xs">{item.rol}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
