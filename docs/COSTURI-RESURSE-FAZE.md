# Estimare costuri și resurse pe faze — Platforma ARACIP

**Furnizor:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Scop:** estimarea resurselor umane și a costurilor pentru implementarea post-contract

> IMPORTANT: cifrele sunt **estimări orientative de piață**, pentru planificare — se confirmă cu oferte scrise de la furnizori și cu politica internă a operatorului. Platforma fiind deja dezvoltată, efortul principal este de **configurare, migrare, validare și instruire**, nu de construcție de la zero.

---

## 1. Roluri (resurse umane)

| Rol | Cine | Implicare |
|-----|------|-----------|
| Dezvoltare/configurare/migrare | NEWTIME (furnizor) | Fazele 2, 3, 4, 6 |
| Jurist / DPO | ARACIP (intern) sau serviciu extern | Faza 1, avize |
| Expert evaluator ARACIP | ARACIP | Faza 4 (conținut) |
| Administrator IT / recepție | ARACIP | Fazele 2, 5 |
| Formator | NEWTIME / ARACIP | Faza 6 |

---

## 2. Costuri recurente — infrastructură (estimări orientative)

| Serviciu | Rol | Estimare lunară | Estimare anuală |
|----------|-----|-----------------|-----------------|
| Bază de date (Supabase, plan plătit) | date + backup | ~120–500 lei | ~1.500–6.000 lei |
| Găzduire aplicație (Vercel Pro / echivalent) | aplicație + CDN | ~100–450 lei | ~1.200–5.400 lei |
| AI — Groq (pay-as-you-go) | asistent ARA | ~50–300 lei | ~600–3.600 lei |
| E-mail (Resend, plan plătit) | notificări | ~0–100 lei | ~0–1.200 lei |
| Monitorizare (UptimeRobot etc.) | disponibilitate | ~0–100 lei | ~0–1.200 lei |
| Domeniu `*.aracip.ro` | identitate | 0 (subdomeniu propriu) | 0 |
| **Total infrastructură (orientativ)** | | **~270–1.450 lei/lună** | **~3.300–17.400 lei/an** |

*Costurile cresc cu volumul (utilizatori activi, trafic AI, stocare documente). La operare integral în cloud guvernamental, valorile pot diferi.*

---

## 3. Costuri unice (one-time) — estimări orientative

| Element | Fază | Estimare | Observație |
|---------|------|----------|------------|
| Configurare producție + migrare date + import bulk 1.000 unități | 2–3 | efort NEWTIME (inclus în contract) | conturi individuale, import, deploy |
| Finalizare conținut (24 indicatori din MO + calificative) | 4 | efort expert ARACIP | validare de conținut |
| **Test de securitate (pentest) oficial** | 5 | ~10.000–30.000 lei | furnizor specializat, în funcție de amploare |
| Setup juridic (DPA-uri, DPIA, DPO) | 1 | efort jurist/DPO (drafturile există) | doar completare + semnare |
| Manuale cu capturi + sesiuni de instruire | 6 | efort NEWTIME/formator | per rol |
| Helpdesk / suport (setup) | 6 | efort NEWTIME | canal + procedură |

---

## 4. Sinteză pe faze

| Fază | Durată orientativă | Cost dominant | Cine plătește/execută |
|------|--------------------|---------------|-----------------------|
| 1 — Juridic | 1–3 săpt. | efort intern jurist/DPO | ARACIP |
| 2 — Infrastructură | 2–5 săpt. | recurent (abonamente) | NEWTIME config / ARACIP abonamente |
| 3 — Conturi + date | 3–7 săpt. | efort NEWTIME | NEWTIME |
| 4 — Conținut | paralel | efort expert | ARACIP |
| 5 — Securitate/recepție | 5–8 săpt. | **pentest (one-time)** | ARACIP |
| 6 — Instruire/lansare | 6–9 săpt. | efort formator | NEWTIME/ARACIP |
| 7 — Operare | continuu | recurent + mentenanță (SLA) | conform contract |

---

## 5. Observații pentru bugetare

- **Cel mai mare cost unic** este de regulă **pentestul** (~10–30 mii lei), cerut frecvent la sisteme publice.
- **Costul recurent de infrastructură este mic** raportat la valoarea proiectului (ordinul câtorva mii–zeci de mii lei/an), pentru că soluția folosește servicii cloud eficiente.
- **Efortul de dezvoltare este deja consumat** (platforma e construită) — post-contract rămâne configurare + migrare + validare + instruire.
- **DPO**: dacă e externalizat, adaugă un cost recurent (serviciu specializat); dacă e intern, e o atribuție.
- Mentenanța și SLA se stabilesc prin contract (procent anual din valoare sau tarif fix).

---

*Estimare pregătită de NEWTIME CONCEPT SOLUTIONS S.R.L.. Cifre orientative, de confirmat cu oferte reale.*
