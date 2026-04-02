'use client'
import { useState, useEffect } from 'react'
import { useLang } from '../LangContext'
import { t } from '../translations'

const WA_BASE = 'https://wa.me/40787813485?text='

export default function Navbar() {
  const { lang, toggleLang } = useLang()
  const tr = t[lang].navbar

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const WA_LINK = `${WA_BASE}${encodeURIComponent(tr.waText)}`

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'bg-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">

          {/* Logo */}
          <a href="#" className="shrink-0 font-serif text-xl font-semibold tracking-wide text-white">
            AI <span className="text-gold">Craiova</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7 text-sm text-white/50">
            {tr.links.map((l) => (
              <a key={l.label} href={l.href}
                className="hover:text-white transition-colors duration-200 whitespace-nowrap">
                {l.label}
              </a>
            ))}
          </div>

          {/* Lang toggle desktop */}
          <button
            onClick={toggleLang}
            className="hidden md:inline-flex items-center px-3 py-1.5 border border-white/15 text-white/50 text-xs font-semibold tracking-widest uppercase hover:border-white/40 hover:text-white transition-all duration-200 shrink-0"
          >
            {lang === 'ro' ? 'EN' : 'RO'}
          </button>

          {/* CTA desktop */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 shrink-0 px-5 py-2.5 bg-gold text-black text-xs font-semibold tracking-widest uppercase hover:bg-gold-light transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {tr.cta}
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 shrink-0"
            aria-label="Meniu"
          >
            <span className={`block w-6 h-px bg-white/70 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px bg-white/70 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-white/70 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>

        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-6 pb-6 flex flex-col gap-1 border-t border-white/5">
            {tr.links.map((l) => (
              <a key={l.label} href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-white/60 hover:text-white text-sm border-b border-white/5 last:border-0 transition-colors">
                {l.label}
              </a>
            ))}
            {/* Lang toggle mobile */}
            <button
              onClick={() => { toggleLang(); setOpen(false) }}
              className="py-3 text-white/60 hover:text-white text-sm border-b border-white/5 transition-colors text-left"
            >
              {lang === 'ro' ? '🇬🇧 English' : '🇷🇴 Română'}
            </button>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 py-3 bg-gold text-black text-xs font-semibold tracking-widest uppercase"
            >
              {tr.ctaMobile}
            </a>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  )
}
