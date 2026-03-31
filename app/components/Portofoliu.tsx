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

        {/* Card principal Sunset Beach */}
        <div className="relative border border-white/10 bg-zinc-950/60 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06)_0%,transparent_60%)]" />

          <div className="relative z-10 grid md:grid-cols-2 gap-0">

            {/* Stânga — context */}
            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-gold/15 text-gold text-xs tracking-widest uppercase">Realizat</span>
                <span className="text-white/20 text-xs">Cazare & Turism</span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                Sunset Beach
              </h3>
              <p className="text-white/40 text-sm mb-8">Cazare studiouri la mare — Olimp</p>

              <div className="space-y-5 mb-10">
                <p className="text-white/60 text-sm leading-relaxed">
                  Am implementat un bot AI pe WhatsApp care preia automat rezervările pentru studiouri
                  (G108, G109, E317, E318). Botul verifică disponibilitatea în timp real, calculează
                  prețul total pe numărul de nopți, preia datele clientului și trimite confirmări automate.
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Clientul nu mai răspunde manual la zeci de mesaje zilnice — sistemul gestionează
                  totul automat, inclusiv noaptea și în weekend.
                </p>
              </div>

              <a
                href="https://sunsetbeach.com.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors group"
              >
                Vezi site-ul
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Dreapta — rezultate */}
            <div className="p-10 md:p-14 flex flex-col justify-between">

              <div>
                <p className="text-white/30 text-xs tracking-widest uppercase mb-6">Ce face botul</p>
                <ul className="space-y-4 mb-10">
                  {[
                    'Verifică disponibilitatea în timp real pentru fiecare studio',
                    'Calculează prețul total în funcție de nopți și sezon',
                    'Preia automat datele clientului (nume, telefon, date)',
                    'Trimite confirmare automată după fiecare rezervare',
                    'Notifică proprietarul instant pe WhatsApp',
                    'Funcționează 24/7 — inclusiv noaptea și în weekend',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/55 text-sm">
                      <span className="text-gold text-xs mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rezultat highlight */}
              <div className="border border-gold/20 bg-gold/5 p-6">
                <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Rezultat</p>
                <p className="text-white font-semibold text-base leading-snug mb-1">
                  Zeci de ore economisite lunar
                </p>
                <p className="text-white/40 text-sm">
                  Fără răspunsuri manuale, fără rezervări ratate, fără stres. Numărul de rezervări
                  a crescut fără niciun efort suplimentar din partea clientului.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Placeholder slot 2 */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[
            { titlu: 'Urmează afacerea ta', nisa: 'Clinică / Restaurant / Hotel / Salon', text: 'Locul tău este rezervat. Implementăm sistemul AI personalizat pentru afacerea ta în 7–14 zile.' },
            { titlu: 'Poziție deschisă', nisa: 'Orice domeniu din Craiova & Dolj', text: 'Prețuri speciale pentru primii clienți din fiecare nișă. Exclusivitate pe domeniu în zona ta.' },
          ].map((slot) => (
            <div
              key={slot.titlu}
              className="p-8 border border-white/5 border-dashed bg-black/20 hover:border-gold/15 transition-colors flex flex-col justify-between gap-6"
            >
              <div>
                <span className="text-white/20 text-xs tracking-widest uppercase">{slot.nisa}</span>
                <h4 className="font-serif text-lg text-white/50 mt-3 mb-3">{slot.titlu}</h4>
                <p className="text-white/30 text-sm leading-relaxed">{slot.text}</p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-gold/60 text-xs tracking-widest uppercase hover:text-gold transition-colors"
              >
                Programează o discuție →
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
