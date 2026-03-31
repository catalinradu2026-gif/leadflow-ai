export default function CTA() {
  return (
    <section id="contact" className="py-40 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Următorul pas</p>
        <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Gata să transformi afacerea ta?
        </h2>
        <p className="text-white/40 text-lg mb-12 leading-relaxed">
          Programează o discuție gratuită de 30 de minute. Analizăm împreună potențialul de automatizare al afacerii tale și îți prezentăm un plan concret.
        </p>
        <a
          href="https://wa.me/40785023085?text=Buna%20ziua%2C%20vreau%20sa%20programez%20o%20discutie%20despre%20LeadFlow%20AI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-5 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300"
        >
          Programează o discuție →
        </a>
        <p className="text-white/20 text-xs mt-6">Fără obligații. Fără contracte ascunse.</p>
      </div>
    </section>
  )
}
