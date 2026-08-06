'use client'
import Link from 'next/link'

// Politica de confidențialitate — GDPR (Regulamentul UE 2016/679) + Legea nr. 190/2018.
// Model orientativ; a se valida juridic înainte de utilizarea în producție.

const PAGE_BG = 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)'
const CARD_BG = 'rgba(255,255,255,0.03)'
const BORDER = 'rgba(139,92,246,0.2)'

const ULTIMA_ACTUALIZARE = '3 iulie 2026'

function Sectiune({ titlu, children }: { titlu: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#c4b5fd', margin: '0 0 12px', letterSpacing: '-0.3px' }}>{titlu}</h2>
      <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75 }}>{children}</div>
    </section>
  )
}

export default function Confidentialitate() {
  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        <Link href="/aracip" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', textDecoration: 'none', fontSize: 13, marginBottom: 24 }}>← Înapoi la ARACIP</Link>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 30, padding: '6px 16px', marginBottom: 16, fontSize: 12, color: '#c4b5fd', fontWeight: 600 }}>
            🔐 Protecția datelor cu caracter personal
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>Politica de confidențialitate</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Ultima actualizare: {ULTIMA_ACTUALIZARE}</p>
        </div>

        <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.28)', borderRadius: 12, padding: '12px 16px', fontSize: 12.5, color: '#facc15', marginBottom: 28, lineHeight: 1.6 }}>
          Notă: acest document reprezintă un <b>model orientativ</b>. A se valida juridic de un specialist în protecția datelor înainte de utilizarea în producție.
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '32px 30px' }}>

          <Sectiune titlu="1. Operatorul de date">
            Operatorul care stabilește scopurile și mijloacele de prelucrare a datelor cu caracter personal este:
            <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', fontSize: 13.5 }}>
              <b style={{ color: '#f1f5f9' }}>NEWTIME CONCEPT SOLUTIONS SRL</b><br />
              CUI: 38803627 · Nr. registrul comerțului: J2018000242160<br />
              E-mail de contact pentru protecția datelor: <a href="mailto:contact@aicraiova.ro" style={{ color: '#a78bfa' }}>contact@aicraiova.ro</a>
            </div>
          </Sectiune>

          <Sectiune titlu="2. Cadrul legal">
            Prelucrarea datelor se realizează cu respectarea Regulamentului (UE) 2016/679 al Parlamentului European și al Consiliului
            din 27 aprilie 2016 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal și
            privind libera circulație a acestor date (<b>GDPR</b>), precum și a Legii nr. 190/2018 privind măsuri de punere în aplicare
            a Regulamentului (UE) 2016/679.
          </Sectiune>

          <Sectiune titlu="3. Ce date prelucrăm">
            În funcție de modul în care utilizați platforma, prelucrăm următoarele categorii de date cu caracter personal:
            <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
              <li><b>Date de identificare și contact:</b> nume și prenume, adresă de e-mail;</li>
              <li><b>Date profesionale:</b> unitatea de învățământ, județul, rolul (formabil / evaluator);</li>
              <li><b>Date privind activitatea de formare:</b> progresul în cadrul modulelor de formare, module finalizate;</li>
              <li><b>Rapoarte și depuneri:</b> rapoarte de simulare a autoevaluării, rapoarte de evaluare externă, depuneri de autoevaluare instituțională (RAEI) transmise de unități;</li>
              <li><b>Date tehnice minimale:</b> adresa IP, folosită exclusiv pentru limitarea abuzurilor (rate-limiting) și securitate.</li>
            </ul>
            Nu prelucrăm categorii speciale de date (date sensibile) în sensul art. 9 GDPR.
          </Sectiune>

          <Sectiune titlu="4. Scopurile prelucrării">
            Prelucrăm datele dumneavoastră pentru:
            <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
              <li>furnizarea programului de formare pentru formabili și evaluatori și emiterea certificatelor nominale;</li>
              <li>evaluarea calității în educație și susținerea lanțului calității (unitate → ISJ → ARACIP);</li>
              <li>generarea de rapoarte și situații agregate privind formarea și evaluarea;</li>
              <li>asigurarea securității platformei și prevenirea utilizării abuzive.</li>
            </ul>
          </Sectiune>

          <Sectiune titlu="5. Temeiul legal (art. 6 GDPR)">
            Prelucrarea se întemeiază, după caz, pe:
            <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
              <li><b>Consimțământul persoanei vizate</b> — art. 6 alin. (1) lit. (a) GDPR, exprimat la înscrierea în formare sau la depunerea datelor;</li>
              <li><b>Executarea unui contract</b> sau demersuri precontractuale — art. 6 alin. (1) lit. (b) GDPR;</li>
              <li><b>Îndeplinirea unei obligații legale</b> — art. 6 alin. (1) lit. (c) GDPR, acolo unde legislația din domeniul educației impune acest lucru;</li>
              <li><b>Interesul legitim</b> — art. 6 alin. (1) lit. (f) GDPR, pentru securitatea platformei.</li>
            </ul>
          </Sectiune>

          <Sectiune titlu="6. Perioada de retenție">
            Păstrăm datele cu caracter personal numai pe durata necesară îndeplinirii scopurilor pentru care au fost colectate,
            respectiv pe durata programului de formare și a evaluării, iar ulterior pentru perioada impusă de eventualele obligații
            legale de arhivare. La împlinirea acestor termene, datele sunt șterse sau anonimizate. Puteți solicita ștergerea
            anticipată a datelor în condițiile secțiunii 8.
          </Sectiune>

          <Sectiune titlu="7. Transferul și găzduirea datelor">
            Datele sunt găzduite pe infrastructură situată în <b>Uniunea Europeană</b>:
            <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
              <li>baza de date — <b>Supabase</b> (regiune Irlanda, UE);</li>
              <li>găzduirea aplicației — <b>Vercel</b>, cu procesare în regiuni din UE.</li>
            </ul>
            Nu transferăm datele către țări terțe fără garanții adecvate în sensul capitolului V din GDPR.
          </Sectiune>

          <Sectiune titlu="8. Drepturile persoanei vizate">
            În conformitate cu GDPR, beneficiați de următoarele drepturi:
            <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
              <li><b>dreptul de acces</b> la datele prelucrate (art. 15);</li>
              <li><b>dreptul la rectificare</b> a datelor inexacte (art. 16);</li>
              <li><b>dreptul la ștergerea datelor</b> („dreptul de a fi uitat", art. 17);</li>
              <li><b>dreptul la restricționarea prelucrării</b> (art. 18);</li>
              <li><b>dreptul la portabilitatea datelor</b> (art. 20);</li>
              <li><b>dreptul la opoziție</b> față de prelucrare (art. 21);</li>
              <li><b>dreptul de a vă retrage consimțământul</b> în orice moment, fără a afecta legalitatea prelucrării anterioare;</li>
              <li><b>dreptul de a depune o plângere</b> la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, București, <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>www.dataprotection.ro</a>.</li>
            </ul>
            <div style={{ marginTop: 14 }}>
              Pentru exercitarea drepturilor ne puteți contacta la <a href="mailto:contact@aicraiova.ro" style={{ color: '#a78bfa' }}>contact@aicraiova.ro</a> sau puteți folosi
              formularul dedicat de <Link href="/confidentialitate/stergere" style={{ color: '#a78bfa' }}>cerere de ștergere a datelor</Link>.
            </div>
          </Sectiune>

          <Sectiune titlu="9. Securitatea datelor">
            Implementăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor: transmiterea criptată (HTTPS),
            antete de securitate HTTP, autentificare cu parolă și autentificare în doi factori (2FA) pentru conturile de
            administrare, limitarea accesului la baza de date exclusiv pe partea de server și limitarea numărului de cereri.
          </Sectiune>

          <Sectiune titlu="10. Modificări ale prezentei politici">
            Ne rezervăm dreptul de a actualiza această politică. Versiunea în vigoare este cea publicată pe această pagină,
            cu data ultimei actualizări indicată în partea de sus.
          </Sectiune>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 8, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/confidentialitate/stergere" style={{ background: 'linear-gradient(135deg,#6d28d9,#8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 13.5, fontWeight: 700 }}>Cerere de ștergere a datelor →</Link>
            <a href="mailto:contact@aicraiova.ro" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', textDecoration: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 13.5, fontWeight: 600 }}>Contactează operatorul</a>
          </div>
        </div>
      </div>
    </div>
  )
}
