'use client'
import { useLang } from '../LangContext'
import { t } from '../translations'

export default function Footer() {
  const { lang } = useLang()
  const tr = t[lang].footer

  return (
    <footer className="py-12 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-serif text-lg text-white">
            AI <span className="text-gold">Craiova</span>
          </span>
          <p className="text-white/20 text-xs mt-1">{tr.address}</p>
          <a href={`mailto:${tr.email}`} className="text-gold/60 text-xs mt-1 hover:text-gold transition-colors">{tr.email}</a>
        </div>
        <p className="text-white/20 text-sm">{tr.copy}</p>
        <div className="flex gap-6 text-white/30 text-xs">
          {tr.links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-white/60 transition-colors">{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
