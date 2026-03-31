const caseStudies = [
  {
    client: 'Sunset Beach — Olimp',
    categorie: 'Cazare & Turism',
    descriere: 'Am creat un bot AI care preia rezervări automate pe WhatsApp pentru o locație de cazare premium la mare. Botul răspunde la întrebări despre prețuri, disponibilitate și trimite detalii de rezervare — fără intervenție manuală.',
    rezultate: ['Rezervări automate 24/7', 'Reducere 80% timp răspuns', 'Zero rezervări ratate'],
    tag: 'Realizat',
    link: 'https://sunsetbeach.com.ro',
  },
  {
    client: 'Afacerea ta',
    categorie: 'Clinică / Restaurant / Hotel / Salon',
    descriere: 'Locul tău este rezervat. Implementăm sistemul AI personalizat pentru afacerea ta în 7-14 zile. Programează o discuție gratuită și construim împreună soluția potrivită.',
    rezultate: ['Implementare 7-14 zile', 'Sistem personalizat', 'ROI măsurabil'],
    tag: 'Disponibil',
    link: null,
  },
  {
    client: 'Poziție deschisă',
    categorie: 'Orice domeniu din Craiova & Dolj',
    descriere: 'Căutăm parteneri locali care vor să fie primii din domeniul lor cu sisteme AI. Prețuri speciale pentru primii clienți din fiecare nișă.',
    rezultate: ['Preț special early adopter', 'Exclusivitate pe nișă', 'Portofoliu comun'],
    tag: 'Disponibil',
    link: null,
  },
]

export default function Portofoliu() {
  return (
    <section id="portofoliu" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Proiecte reale</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Portofoliu & Case Studies</h2>
          <p className="text-white/40 max-w-xl mx-auto">Rezultate concrete pentru afaceri reale din România</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((cs) => (
            <div key={cs.client} className="p-8 border border-white/5 bg-black/40 hover:border-gold/20 transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs tracking-widest uppercase text-white/30">{cs.categorie}</span>
                <span className={`text-xs px-3 py-1 ${cs.tag === 'Realizat' ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40'}`}>
                  {cs.tag}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-4">{cs.client}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6 flex-1">{cs.descriere}</p>
              <ul className="space-y-2 border-t border-white/5 pt-6">
                {cs.rezultate.map((r) => (
                  <li key={r} className="text-white/50 text-xs flex items-center gap-2">
                    <span className="text-gold">→</span> {r}
                  </li>
                ))}
              </ul>
              {cs.link && (
                <a
                  href={cs.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors"
                >
                  Vezi site-ul →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
