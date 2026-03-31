'use client'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="font-serif text-xl font-semibold tracking-wide text-white">
          LeadFlow <span className="text-gold">AI</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#servicii" className="hover:text-white transition-colors">Servicii</a>
          <a href="#proces" className="hover:text-white transition-colors">Proces</a>
          <a href="#preturi" className="hover:text-white transition-colors">Prețuri</a>
          <a href="#contact" className="ml-4 px-5 py-2 border border-gold/60 text-gold hover:bg-gold hover:text-black transition-all duration-300 text-xs tracking-widest uppercase">
            Contactează-ne
          </a>
        </div>
      </div>
    </nav>
  )
}
