export default function Footer() {
  return (
    <footer className="py-12 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif text-lg text-white">
          LeadFlow <span className="text-gold">AI</span>
        </span>
        <p className="text-white/20 text-sm">© 2026 LeadFlow AI. Toate drepturile rezervate.</p>
        <div className="flex gap-6 text-white/30 text-xs">
          <a href="#servicii" className="hover:text-white/60 transition-colors">Servicii</a>
          <a href="#preturi" className="hover:text-white/60 transition-colors">Prețuri</a>
          <a href="#contact" className="hover:text-white/60 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
