'use client'

const APP = 'https://homesmart.aicraiova.ro'
const WA = 'https://wa.me/40787813485?text=' + encodeURIComponent('Salut! Vreau sa-mi conectez dispozitivele smart la AI Home Smart. Imi poti trimite codul QR de conectare?')

export default function AIHomeSmartPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header simplu */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="font-serif text-lg font-semibold tracking-wide">AI <span className="text-gold">Craiova</span></a>
          <a href={`${APP}/login`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-widest uppercase px-4 py-2 bg-gold text-black hover:bg-gold-light transition">Intră în cont</a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="text-5xl">🏠</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4">AI Home Smart</h1>
        <p className="text-white/60 text-lg mt-5 leading-relaxed">
          Casa ta inteligentă, controlată <b className="text-white">local și instant</b>, cu asistenta vocală <b className="text-white">Mira</b> în română.
          Folosește surplusul solar ca să-ți încălzească sau răcorească inteligent și <b className="text-white">gratis</b> casa. Fără cloud, fără limite.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm">
          {['🎁 30 zile gratis', '🗣️ Voce română', '☀️ Solar + încălzire', '⚡ Control local'].map((t) => (
            <span key={t} className="px-3 py-1.5 border border-white/15 rounded-full text-white/80">{t}</span>
          ))}
        </div>
      </section>

      {/* Pasi */}
      <section className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-serif text-2xl font-bold mb-6">Cum începi — 3 pași</h2>

        <Step n={1} title="Creează-ți cont (gratis 30 de zile)" desc="Acces complet 30 de zile: Mira, autopilot, control local. Apoi 7€/lună, fără obligații.">
          <a href={`${APP}/login`} target="_blank" rel="noopener noreferrer" className="btn-gold">Creează cont</a>
        </Step>

        <Step n={2} title="Conectează-ți dispozitivele" desc="Îți trimitem un cod QR personalizat pe WhatsApp. Îl scanezi cu aplicația Smart Life de pe telefon și toate dispozitivele tale apar în aplicație.">
          <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2.5 rounded-lg font-bold text-white" style={{ background: '#25D366' }}>💬 Cere codul QR pe WhatsApp</a>
        </Step>

        <Step n={3} title="Instalează aplicația" desc="Pe PC pui programul de control local (rapid, fără cloud). Pe telefon o adaugi pe ecran ca s-o ai la îndemână.">
          <div className="flex flex-wrap gap-3">
            <a href={`${APP}/instalare`} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2.5 rounded-lg font-bold text-white" style={{ background: 'linear-gradient(135deg,#0a84ff,#0061c9)' }}>💻 Instalează pe PC (hub)</a>
            <a href={APP} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2.5 rounded-lg font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>📱 Pune-o pe telefon</a>
          </div>
          <p className="text-white/40 text-xs mt-3">Pe telefon: deschide aplicația și din meniul browserului alege Adaugă la ecran principal.</p>
        </Step>
      </section>

      {/* Ce poate face */}
      <section className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-serif text-2xl font-bold mb-6">Ce poți face</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Feature e="🗣️" t="Vorbește cu Mira" d="Hey Mira, stinge lumina din living — comenzi vocale în română." />
          <Feature e="☀️" t="Economie solară" d="Pornește boilerul sau AC-ul automat când ai surplus de la panouri." />
          <Feature e="🏠" t="Te întâmpină acasă" d="Detectează când ajungi și-ți pregătește ambianța dorită." />
          <Feature e="🌡️" t="Autopilot confort" d="Menține singur temperatura — încălzire și răcire inteligentă." />
        </div>
      </section>

      {/* Preturi */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="font-serif text-2xl font-bold mb-2 text-center">Planuri și prețuri</h2>
        <p className="text-white/50 text-center text-sm mb-8">Începi cu 30 de zile gratis. Apoi alegi — fără obligații, anulezi oricând.</p>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Standard */}
          <div className="border border-white/10 bg-black/30 rounded-2xl p-6 flex flex-col">
            <div className="text-3xl">⚡</div>
            <h3 className="font-serif text-xl font-bold mt-3">Standard</h3>
            <div className="mt-2"><span className="text-3xl font-bold">7€</span><span className="text-white/50">/lună</span></div>
            <p className="text-white/50 text-sm mt-3 leading-relaxed flex-1">Toată puterea AI Home Smart, configurată de tine. Control local, Mira în română, autopilot pe solar și încălzire, întâmpinare la sosire. Pentru cine vrea control și preț mic.</p>
            <ul className="text-white/70 text-sm mt-4 space-y-1.5">
              <li>✓ Aplicația completă + Mira</li>
              <li>✓ Control local instant</li>
              <li>✓ Autopilot solar + încălzire</li>
              <li>✓ Îți pui singur scenele</li>
            </ul>
          </div>

          {/* Premium — evidentiat */}
          <div className="border-2 border-gold bg-gradient-to-b from-gold/10 to-black/30 rounded-2xl p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">RECOMANDAT</div>
            <div className="text-3xl">👑</div>
            <h3 className="font-serif text-xl font-bold mt-3">Premium</h3>
            <div className="mt-2"><span className="text-3xl font-bold">17€</span><span className="text-white/50">/lună</span></div>
            <p className="text-white/60 text-sm mt-3 leading-relaxed flex-1">Totul gata făcut pentru tine. Echipa AIcraiova îți configurează personalizat toată casa, de la distanță. Tu doar te bucuri.</p>
            <ul className="text-white/80 text-sm mt-4 space-y-1.5">
              <li>✓ Tot din Standard</li>
              <li>✓ <b className="text-white">Configurare personalizată de noi</b></li>
              <li>✓ Suport prioritar + ajustări oricând</li>
              <li>✓ La cerere, instalare personală la tine acasă</li>
            </ul>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-5 block text-center bg-gold text-black font-bold py-2.5 rounded-lg hover:bg-gold-light transition">Vreau Premium</a>
          </div>

          {/* Proba */}
          <div className="border border-white/10 bg-black/30 rounded-2xl p-6 flex flex-col">
            <div className="text-3xl">🎁</div>
            <h3 className="font-serif text-xl font-bold mt-3">Probă</h3>
            <div className="mt-2"><span className="text-3xl font-bold">Gratis</span><span className="text-white/50"> · 30 zile</span></div>
            <p className="text-white/50 text-sm mt-3 leading-relaxed flex-1">Încearcă tot, fără niciun ban. Acces complet 30 de zile la toate funcțiile. Vezi cum îți simplifică viața, apoi alegi planul.</p>
            <ul className="text-white/70 text-sm mt-4 space-y-1.5">
              <li>✓ Acces complet, gratuit</li>
              <li>✓ Fără card la înscriere</li>
              <li>✓ Anulezi oricând</li>
            </ul>
            <a href={`${APP}/login`} target="_blank" rel="noopener noreferrer" className="mt-5 block text-center border border-white/20 text-white font-bold py-2.5 rounded-lg hover:bg-white/5 transition">Începe gratis</a>
          </div>
        </div>

        {/* Instalatori — B2B */}
        <div className="mt-8 border border-gold/30 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="text-4xl">🤝</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-serif text-xl font-bold">Ești firmă de instalări fotovoltaice sau smart home?</h3>
            <p className="text-white/55 text-sm mt-2 leading-relaxed">Adaugă o casă inteligentă completă în oferta ta, <b className="text-white">sub brandul firmei tale</b>. Îți diferențiezi serviciul și le aduci clienților economie reală — surplusul solar le încălzește și răcorește casa automat. Noi punem la dispoziție platforma completă; tu rămâi partenerul de încredere, cu o sursă nouă de venit recurent.</p>
          </div>
          <a href={`https://wa.me/40787813485?text=${encodeURIComponent('Salut! Sunt instalator si vreau sa devin partener AI Home Smart (white-label).')}`} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-gold-light transition whitespace-nowrap">Devino partener</a>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <a href={`${APP}/login`} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-gold text-black font-bold text-sm tracking-widest uppercase hover:bg-gold-light transition">Începe gratis 30 de zile →</a>
        <p className="text-white/40 text-xs mt-6">Întrebări? Scrie-ne pe <a href={WA} className="text-gold">WhatsApp</a> sau la contact@aicraiova.ro</p>
      </section>

      <style jsx>{`
        .btn-gold { display:inline-block; padding:10px 20px; border-radius:8px; background:var(--gold,#d4af37); color:#000; font-weight:800; }
      `}</style>
    </main>
  )
}

function Step({ n, title, desc, children }: { n: number; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-black/30 rounded-2xl p-6 mb-4 flex gap-4">
      <div className="shrink-0 w-9 h-9 rounded-full bg-gold text-black font-bold grid place-items-center">{n}</div>
      <div>
        <b className="text-lg">{title}</b>
        <p className="text-white/50 text-sm mt-1 mb-3 leading-relaxed">{desc}</p>
        {children}
      </div>
    </div>
  )
}

function Feature({ e, t, d }: { e: string; t: string; d: string }) {
  return (
    <div className="border border-white/10 bg-black/30 rounded-2xl p-5">
      <div className="text-2xl">{e}</div>
      <b className="block mt-2">{t}</b>
      <p className="text-white/50 text-sm mt-1 leading-relaxed">{d}</p>
    </div>
  )
}
