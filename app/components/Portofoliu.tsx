const cazuri = [
  {
    client: 'Sunset Beach — Olimp',
    categorie: 'Cazare & Turism',
    tag: 'Realizat',
    link: 'https://sunsetbeach.com.ro',
    descriere: 'Am implementat un bot AI pe WhatsApp care preia automat rezervările pentru studiouri (G108, G109, E317, E318). Botul verifică disponibilitatea în timp real, calculează prețul total, preia datele clientului și trimite confirmări automate — fără nicio intervenție manuală.',
    features: [
      'Verificare disponibilitate în timp real',
      'Calcul automat preț (nopți + sezon)',
      'Preluare date client + confirmare instant',
      'Notificare proprietar pe WhatsApp',
      'Funcționează 24/7 inclusiv weekend',
    ],
    rezultat: 'Clientul economisește zeci de ore pe lună la răspunsuri manuale și crește numărul de rezervări fără efort suplimentar.',
    recenzie: null,
  },
  {
    client: 'Bot Automatizat WhatsApp pentru Cazare',
    categorie: 'Automatizare & Rezervări',
    tag: 'Realizat',
    link: null,
    descriere: 'Sistem inteligent care preia automat rezervări, verifică disponibilitatea în timp real, calculează prețul și trimite confirmări instant clienților. Zero intervenție manuală, zero rezervări pierdute.',
    features: [
      'Preluare automată rezervări 24/7',
      'Verificare disponibilitate timp real',
      'Calcul preț și confirmare instant',
      'Integrare completă WhatsApp',
      'Notificări automate pentru proprietar',
    ],
    rezultat: 'Clientul economisește minim 3 ore pe zi și nu mai pierde nicio rezervare.',
    recenzie: 'Nu mai pierd rezervări noaptea... am câștigat minim 3 ore pe zi.',
  },
  {
    client: 'Bot Recrutare Internațională',
    categorie: 'Recrutare & HR Automatizat',
    tag: 'Realizat',
    link: null,
    descriere: 'Bot AI pe WhatsApp care gestionează complet procesul de recrutare pentru muncă sezonieră în străinătate. Colectează datele candidaților, îi califică automat în funcție de criterii specifice, îi redirecționează către recrutorul potrivit și trimite documentele necesare — totul fără intervenție umană.',
    features: [
      'Colectare automată date (nume, vârstă, telefon, acte)',
      'Calificare și redirecționare pe criterii specifice',
      'Meniu interactiv cu opțiuni de posturi disponibile',
      'Ore silențioase cu coadă automată de mesaje',
      'AI conversațional pentru întrebări suplimentare',
      'Notificări instant pentru recrutori pe WhatsApp',
    ],
    rezultat: 'Sute de candidați procesați automat lunar. Recrutorul primește doar dosarele complete, gata de analizat — economisind ore întregi de comunicare repetitivă.',
    recenzie: null,
  },
]

export default function Portofoliu() {
  return (
    <section id="portofoliu" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Rezultate reale</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Studii de caz — Ce am realizat
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Proiecte livrate, cu impact măsurabil pentru afaceri reale din România
          </p>
        </div>

        {/* Cazuri */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cazuri.map((caz) => (
            <div key={caz.client}
              className="relative border border-white/8 bg-black/50 overflow-hidden flex flex-col hover:border-gold/20 transition-colors duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.05)_0%,transparent_60%)]" />

              <div className="relative z-10 p-8 flex flex-col flex-1">
                {/* Header card */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-white/25 text-xs tracking-widest uppercase block mb-2">{caz.categorie}</span>
                    <h3 className="font-serif text-xl font-bold text-white leading-snug">{caz.client}</h3>
                  </div>
                  <span className={`shrink-0 text-xs px-3 py-1 tracking-widest uppercase ${
                    caz.tag === 'Realizat' ? 'bg-gold/15 text-gold' : 'bg-white/5 text-white/30'
                  }`}>
                    {caz.tag}
                  </span>
                </div>

                {/* Descriere */}
                <p className="text-white/50 text-sm leading-relaxed mb-6">{caz.descriere}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {caz.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-white/50 text-xs">
                      <span className="text-gold shrink-0 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Rezultat */}
                <div className="border border-gold/15 bg-gold/5 px-5 py-4 mb-5">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Rezultat</p>
                  <p className="text-white/70 text-sm leading-relaxed">{caz.rezultat}</p>
                </div>

                {/* Recenzie */}
                {caz.recenzie && (
                  <div className="border-l-2 border-gold/30 pl-4 mb-5">
                    <p className="text-white/40 text-xs italic leading-relaxed">
                      &ldquo;{caz.recenzie}&rdquo;
                    </p>
                    <p className="text-white/20 text-xs mt-1">— Proprietar locație cazare</p>
                  </div>
                )}

                {/* Link */}
                {caz.link ? (
                  <a href={caz.link} target="_blank" rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors group">
                    Vezi site-ul
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                ) : (
                  <a href="#contact"
                    className="mt-auto inline-flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase hover:text-gold transition-colors group">
                    Vreau ceva similar
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Slot disponibil */}
        <div className="mt-6 p-8 border border-white/5 border-dashed text-center hover:border-gold/10 transition-colors">
          <p className="text-white/20 text-xs tracking-widest uppercase mb-2">Urmează</p>
          <p className="text-white/30 text-sm">Locul tău este disponibil. Primii din nișa ta din Craiova & Dolj beneficiază de prețuri speciale.</p>
          <a href="#contact" className="inline-block mt-4 text-gold/60 text-xs tracking-widest uppercase hover:text-gold transition-colors">
            Programează o discuție gratuită →
          </a>
        </div>

      </div>
    </section>
  )
}
