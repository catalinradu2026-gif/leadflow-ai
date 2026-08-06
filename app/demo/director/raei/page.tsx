'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { JUDETE } from '@/lib/judete'

const CEAC_CRITERII = ['Curriculum', 'Resurse umane', 'Resurse materiale', 'Rezultate', 'Management']

function anScolar(): string {
  const now = new Date()
  const y = now.getFullYear()
  // an școlar începe în septembrie
  if (now.getMonth() >= 8) return `${y}-${y + 1}`
  return `${y - 1}-${y}`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export default function RaeiGeneratorPage() {
  const router = useRouter()

  // 1. Date generale
  const [denumire, setDenumire] = useState('')
  const [judet, setJudet] = useState('')
  const [localitate, setLocalitate] = useState('')
  const [nivel, setNivel] = useState('Primar')
  const [nrElevi, setNrElevi] = useState('')

  // 2. Rezultate școlare
  const [promovabilitate, setPromovabilitate] = useState('')
  const [absenteism, setAbsenteism] = useState('')
  const [abandon, setAbandon] = useState('')

  // 3. Personal didactic
  const [nrTitular, setNrTitular] = useState('')
  const [nrSuplinitor, setNrSuplinitor] = useState('')
  const [pctCalificat, setPctCalificat] = useState('')

  // 4. Dotare
  const [nrSali, setNrSali] = useState('')
  const [nrLab, setNrLab] = useState('')
  const [conectivitate, setConectivitate] = useState('Wi-Fi tot')

  // 5. Activități
  const [activitati, setActivitati] = useState('')

  // 6. CEAC
  const [ceac, setCeac] = useState<Record<string, string>>({})

  // 7. Obiective
  const [obiective, setObiective] = useState<string[]>(['', '', '', '', ''])

  // 8. Dificultăți
  const [dificultati, setDificultati] = useState('')

  function setObiectiv(i: number, v: string) {
    setObiective(prev => prev.map((x, idx) => idx === i ? v : x))
  }

  function genereaza() {
    const an = anScolar()
    const ceacTabel = CEAC_CRITERII.map(c =>
      `<tr><td>${escapeHtml(c)}</td><td style="text-align:center">${escapeHtml(ceac[c] || '-')}</td></tr>`
    ).join('')
    const obiectiveLista = obiective.filter(o => o.trim()).map((o, i) =>
      `<li>${escapeHtml(o)}</li>`
    ).join('')

    const html = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><title>RAEI ${escapeHtml(denumire)} ${an}</title><style>
      body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px 30px; color: #111; line-height: 1.6; }
      h1 { text-align: center; font-size: 22px; margin-bottom: 6px; }
      h2 { text-align: center; font-size: 16px; color: #444; margin-top: 0; margin-bottom: 30px; font-weight: normal; }
      h3 { font-size: 15px; margin-top: 28px; border-bottom: 1px solid #888; padding-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0; }
      td, th { border: 1px solid #555; padding: 6px 10px; font-size: 13px; }
      th { background: #eee; }
      .meta { font-size: 13px; line-height: 1.8; }
      .meta strong { display: inline-block; min-width: 200px; }
      p { font-size: 13px; text-align: justify; }
      ol, ul { font-size: 13px; }
      .footer { margin-top: 50px; font-size: 12px; color: #555; text-align: center; border-top: 1px solid #ccc; padding-top: 10px; }
      @media print { body { padding: 20px; } }
    </style></head><body>
      <h1>RAPORT ANUAL DE EVALUARE INTERNĂ (RAEI)</h1>
      <h2>${escapeHtml(denumire || '[Denumire unitate]')} — Anul școlar ${an}</h2>

      <h3>1. Date generale</h3>
      <div class="meta">
        <div><strong>Denumire unitate:</strong> ${escapeHtml(denumire)}</div>
        <div><strong>Județ:</strong> ${escapeHtml(judet)}</div>
        <div><strong>Localitate:</strong> ${escapeHtml(localitate)}</div>
        <div><strong>Nivel:</strong> ${escapeHtml(nivel)}</div>
        <div><strong>Număr elevi:</strong> ${escapeHtml(nrElevi)}</div>
      </div>

      <h3>2. Rezultate școlare</h3>
      <div class="meta">
        <div><strong>Promovabilitate:</strong> ${escapeHtml(promovabilitate)}%</div>
        <div><strong>Absenteism:</strong> ${escapeHtml(absenteism)}%</div>
        <div><strong>Abandon:</strong> ${escapeHtml(abandon)}%</div>
      </div>

      <h3>3. Personal didactic</h3>
      <div class="meta">
        <div><strong>Cadre titulare:</strong> ${escapeHtml(nrTitular)}</div>
        <div><strong>Cadre suplinitoare:</strong> ${escapeHtml(nrSuplinitor)}</div>
        <div><strong>Procent calificat:</strong> ${escapeHtml(pctCalificat)}%</div>
      </div>

      <h3>4. Dotare</h3>
      <div class="meta">
        <div><strong>Săli de clasă:</strong> ${escapeHtml(nrSali)}</div>
        <div><strong>Laboratoare:</strong> ${escapeHtml(nrLab)}</div>
        <div><strong>Conectivitate:</strong> ${escapeHtml(conectivitate)}</div>
      </div>

      <h3>5. Activități curriculare și extracurriculare</h3>
      <p>${escapeHtml(activitati).replace(/\n/g, '<br>')}</p>

      <h3>6. Indicatori CEAC (autoevaluare 1-5)</h3>
      <table>
        <thead><tr><th>Criteriu</th><th>Notă</th></tr></thead>
        <tbody>${ceacTabel}</tbody>
      </table>

      <h3>7. Obiective an următor</h3>
      <ol>${obiectiveLista}</ol>

      <h3>8. Dificultăți și nevoi</h3>
      <p>${escapeHtml(dificultati).replace(/\n/g, '<br>')}</p>

      <div class="footer">Generat automat prin platforma ARACIP Digital — ${new Date().toLocaleDateString('ro-RO')}</div>
    </body></html>`

    // Conectare la tabloul central ARACIP — salvează RAEI-ul generat (fire-and-forget).
    try {
      fetch('/api/raei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume_unitate: denumire,
          judet, localitate, nivel, an_scolar: an,
          nr_elevi: nrElevi,
          details: { promovabilitate, absenteism, abandon, nrTitular, nrSuplinitor, pctCalificat, nrSali, nrLab, conectivitate, activitati, ceac, obiective: obiective.filter(o => o.trim()), dificultati },
        }),
        keepalive: true,
      }).catch(() => { /* fallback silent — documentul se generează oricum */ })
    } catch { /* noop */ }

    const w = window.open('', '_blank')
    if (!w) return
    w.document.open()
    w.document.write(html)
    w.document.close()
    setTimeout(() => { try { w.print() } catch (e) { console.error('[RAEI print]', e) } }, 500)
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }
  const sectionStyle: React.CSSProperties = { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '16px' }
  const h3Style: React.CSSProperties = { fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/demo/director')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Portal Director</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>📄 Generator RAEI — An școlar {anScolar()}</span>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '24px' }}>

        <div style={sectionStyle}>
          <h3 style={h3Style}>1. Date generale</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={labelStyle}>Denumire unitate</label><input style={inputStyle} value={denumire} onChange={e => setDenumire(e.target.value)} /></div>
            <div>
              <label style={labelStyle}>Județ</label>
              <select style={inputStyle} value={judet} onChange={e => setJudet(e.target.value)}>
                <option value="">— alege județul —</option>
                {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Localitate</label><input style={inputStyle} value={localitate} onChange={e => setLocalitate(e.target.value)} /></div>
            <div>
              <label style={labelStyle}>Nivel</label>
              <select style={inputStyle} value={nivel} onChange={e => setNivel(e.target.value)}>
                <option>Primar</option><option>Gimnazial</option><option>Liceal</option>
              </select>
            </div>
            <div><label style={labelStyle}>Număr elevi</label><input style={inputStyle} type="number" value={nrElevi} onChange={e => setNrElevi(e.target.value)} /></div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>2. Rezultate școlare</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div><label style={labelStyle}>Promovabilitate %</label><input style={inputStyle} type="number" value={promovabilitate} onChange={e => setPromovabilitate(e.target.value)} /></div>
            <div><label style={labelStyle}>Absenteism %</label><input style={inputStyle} type="number" value={absenteism} onChange={e => setAbsenteism(e.target.value)} /></div>
            <div><label style={labelStyle}>Abandon %</label><input style={inputStyle} type="number" value={abandon} onChange={e => setAbandon(e.target.value)} /></div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>3. Personal didactic</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div><label style={labelStyle}>Cadre titulare</label><input style={inputStyle} type="number" value={nrTitular} onChange={e => setNrTitular(e.target.value)} /></div>
            <div><label style={labelStyle}>Cadre suplinitoare</label><input style={inputStyle} type="number" value={nrSuplinitor} onChange={e => setNrSuplinitor(e.target.value)} /></div>
            <div><label style={labelStyle}>% Calificat</label><input style={inputStyle} type="number" value={pctCalificat} onChange={e => setPctCalificat(e.target.value)} /></div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>4. Dotare</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div><label style={labelStyle}>Săli de clasă</label><input style={inputStyle} type="number" value={nrSali} onChange={e => setNrSali(e.target.value)} /></div>
            <div><label style={labelStyle}>Laboratoare</label><input style={inputStyle} type="number" value={nrLab} onChange={e => setNrLab(e.target.value)} /></div>
            <div>
              <label style={labelStyle}>Conectivitate</label>
              <select style={inputStyle} value={conectivitate} onChange={e => setConectivitate(e.target.value)}>
                <option>Wi-Fi tot</option><option>Parțial</option><option>Inexistent</option>
              </select>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>5. Activități curriculare/extracurriculare</h3>
          <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={activitati} onChange={e => setActivitati(e.target.value)} placeholder="Descrieți activitățile..." />
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>6. Indicatori CEAC — autoevaluare 1-5</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CEAC_CRITERII.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px' }}>
                <span style={{ flex: 1, fontSize: '13px', color: '#f1f5f9' }}>{c}</span>
                <select value={ceac[c] || ''} onChange={e => setCeac(prev => ({ ...prev, [c]: e.target.value }))} style={{ ...inputStyle, width: 'auto', minWidth: '80px' }}>
                  <option value="">—</option>
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>7. Obiective an următor (5 câmpuri)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {obiective.map((o, i) => (
              <input key={i} style={inputStyle} value={o} onChange={e => setObiectiv(i, e.target.value)} placeholder={`Obiectiv ${i + 1}`} />
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={h3Style}>8. Dificultăți și nevoi</h3>
          <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={dificultati} onChange={e => setDificultati(e.target.value)} placeholder="Descrieți dificultățile întâmpinate și nevoile prioritare..." />
        </div>

        <button onClick={genereaza} style={{ width: '100%', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
          📄 Generează RAEI și deschide pentru printare/PDF
        </button>
      </div>
    </div>
  )
}
