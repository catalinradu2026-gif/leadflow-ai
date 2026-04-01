const planuri = [
  {
    nume: 'Essential',
    pret: '500€',
    mentinere: '100€ / lună',
    mentinerePerioda: 'după primele 30 de zile',
    descriere: 'Ideal pentru afaceri care vor să automatizeze primul proces — răspuns rapid, implementare în 7 zile.',
    features: [
      'Bot WhatsApp AI personalizat',
      'Răspunsuri automate 24/7',
      'Integrare cu numărul tău WhatsApp',
      'Mesaje personalizate pe tonul brandului',
      'Notificări instant la tine pe telefon',
      'Setup complet + training',
      'Suport 30 de zile inclus',
    ],
    highlight: false,
  },
  {
    nume: 'Growth',
    pret: '1.500€',
    mentinere: '250€ / lună',
    mentinerePerioda: 'după primele 30 de zile',
    descriere: 'Sistemul complet pentru afaceri care vor să crească fără să angajeze — automatizare end-to-end.',
    features: [
      'Tot ce include Essential',
      'Automatizări complete de procese (n8n)',
      'Agent AI cu memorie (ține minte clienții)',
      'Integrare CRM / Google Sheets / Notion',
      'Generare automată oferte & follow-up',
      'Notificări email + WhatsApp automate',
      'Raportare lunară cu rezultate',
      'Suport 90 de zile + optimizare lunară',
    ],
    highlight: true,
  },
  {
    nume: 'Elite',
    pret: '3.000€',
    mentinere: '350€ / lună',
    mentinerePerioda: 'inclusă — 350€ valoare',
    descriere: 'Infrastructură AI completă pentru companii cu procese complexe și volum mare de clienți.',
    features: [
      'Tot ce include Growth',
      'Sisteme AI multiple integrate',
      'Agenți AI cu memorie avansată',
      'Integrări complexe (ERP, POS, rezervări)',
      'Audit & optimizare continuă',
      'Mentenanță lunară inclusă pe termen lung',
      'Strategie AI personalizată pentru business',
      'Account manager dedicat',
      'SLA garantat — răspuns în 4 ore',
    ],
    highlight: false,
  },
]

export default function Preturi() {
  return (
    <section id="preturi" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Investiție</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Pachete & Prețuri</h2>
          <p className="text-white/40">Prețuri de la, personalizate în funcție de complexitate</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {planuri.map((plan) => (
            <div
              key={plan.nume}
              className={`relative p-8 border transition-all duration-300 flex flex-col ${
                plan.highlight
                  ? 'border-gold/50 bg-gold/5'
                  : 'border-white/5 bg-black/40 hover:border-white/10'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black text-xs font-semibold tracking-widest uppercase">
                  Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-serif text-2xl font-semibold text-white mb-2">{plan.nume}</h3>
                <div className="text-gold font-serif text-4xl font-bold mb-4">
                  {plan.pret}
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{plan.descriere}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-white/60 text-sm flex items-start gap-3">
                    <span className="text-gold text-xs shrink-0 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>

              {/* Prețuri clare */}
              <div className={`px-4 py-4 mb-6 border ${
                plan.highlight ? 'border-gold/30 bg-gold/8' : 'border-white/8 bg-white/3'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/30 text-xs uppercase tracking-widest">Implementare</p>
                  <p className="text-white font-bold text-sm">{plan.pret} <span className="text-white/30 font-normal text-xs">o singură dată</span></p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <p className="text-white/30 text-xs uppercase tracking-widest">Mentenanță</p>
                  <div className="text-right">
                    <p className="text-gold font-semibold text-sm">{plan.mentinere}</p>
                    <p className="text-white/25 text-xs">{plan.mentinerePerioda}</p>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className={`block text-center py-3 text-sm tracking-widest uppercase transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gold text-black hover:bg-gold-light'
                    : 'border border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                Solicită ofertă
              </a>
            </div>
          ))}
        </div>

        {/* Notă mentenanță */}
        <div className="border border-white/5 bg-white/2 px-6 py-5 text-center mb-16">
          <p className="text-white/35 text-sm leading-relaxed max-w-3xl mx-auto">
            <span className="text-white/55 font-medium">Mentenanța include</span> actualizări continue, monitorizare 24/7 și suport tehnic prioritar.
            Costul exact se stabilește după discuție, în funcție de complexitatea sistemului.
          </p>
        </div>

        {/* Secțiune specială Clinici Medicale */}
        <div className="relative border border-white/10 bg-black/60 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,76,0.07)_0%,transparent_60%)]" />
          <div className="relative z-10 p-10 md:p-14">

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/30 bg-gold/5 mb-4">
                  <span className="text-gold text-xs tracking-[0.25em] uppercase">Soluție specializată</span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                  Sistem AI pentru<br />
                  <span className="text-gold">Clinici Medicale</span>
                </h3>
                <p className="text-white/40 text-sm max-w-md leading-relaxed">
                  Asistent vocal + bot WhatsApp + notificări urgențe — totul funcționând 24/7 fără personal administrativ suplimentar.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-white/30 text-xs tracking-widest uppercase mb-1">Investiție</div>
                <div className="font-serif text-5xl font-bold text-gold">3.500€</div>
                <div className="text-white/30 text-xs mt-1">o singură dată</div>
                <div className="mt-3 text-white/40 text-sm">+ <span className="text-white/70 font-semibold">400€</span> / lună mentenanță</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: '📞', titlu: 'Răspunde la telefon automat', desc: 'Preia apelurile la orice oră, identifică motivul și direcționează pacientul: programare, informații, urgență sau departament specific.' },
                { icon: '💬', titlu: 'Bot WhatsApp pentru programări', desc: 'Pacienții scriu pe WhatsApp și primesc confirmare de programare, reamintiri automate și instrucțiuni înainte de consultație.' },
                { icon: '🏥', titlu: 'Redirecționare pe departamente', desc: 'Sistemul identifică specialitatea necesară și trimite cererea direct la departamentul corect: cardiologie, pediatrie, ATI etc.' },
                { icon: '🚨', titlu: 'Notificări urgențe instant', desc: 'Când un pacient semnalează o urgență, medicul de gardă primește notificare imediată pe WhatsApp cu datele și simptomele.' },
              ].map((f) => (
                <div key={f.titlu} className="flex gap-4 p-6 border border-white/5 bg-white/[0.02] hover:border-gold/15 transition-colors">
                  <span className="text-2xl shrink-0">{f.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-2">{f.titlu}</h4>
                    <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-10 grid md:grid-cols-2 gap-10 items-end">
              <div>
                <p className="text-white/30 text-xs tracking-widest uppercase mb-5">Ce include</p>
                <ul className="space-y-3">
                  {[
                    'Asistent vocal telefonic cu redirecționare pe departamente',
                    'Bot WhatsApp programări, confirmări și reamintiri automate',
                    'Sistem notificări urgențe pentru medicul de gardă',
                    'Programările trimise automat la recepție (WhatsApp / email)',
                    'Configurare completă — toți medicii și departamentele',
                    'Instruire personal (3 ore)',
                    '30 zile suport gratuit după lansare',
                  ].map((item) => (
                    <li key={item} className="text-white/60 text-sm flex items-start gap-3">
                      <span className="text-gold text-xs mt-0.5 shrink-0">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#contact"
                  className="block text-center py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300">
                  Solicită ofertă pentru clinică
                </a>
                <a href="https://wa.me/40787813485?text=Buna%20ziua%2C%20vreau%20sa%20programez%20o%20discutie%20despre%20sistemul%20AI%20pentru%20clinica%20mea"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 border border-white/10 text-white/60 text-sm tracking-wide hover:border-white/30 hover:text-white transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Scrie-ne pe WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
