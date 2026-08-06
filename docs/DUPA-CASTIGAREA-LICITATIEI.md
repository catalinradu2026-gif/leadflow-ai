# De făcut după câștigarea licitației — Platforma ARACIP

**Furnizor:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Scop:** planul de acțiune de la semnarea contractului până la operarea națională

> Nota: platforma este deja funcțională și demonstrabilă. Elementele de mai jos duc soluția de la „pilot/demo" la „producție națională operată de ARACIP". Sunt grupate pe faze; multe se pot derula în paralel.

---

## FAZA 1 — Formalizări juridice și administrative (săptămânile 1–3)

- [ ] Semnarea **DPA** operator–împuternicit (draftul e gata — de completat rubricile și semnat).
- [ ] Semnarea DPA-urilor cu **sub-furnizorii** (Supabase, Vercel, Resend) + **SCC + TIA pentru Groq**.
- [ ] **Desemnarea formală a DPO** (decizia e pregătită) + comunicarea/publicarea datelor la ANSPDCP.
- [ ] Finalizarea **DPIA** și, dacă riscul rezidual rămâne ridicat, consultarea ANSPDCP (art. 36).
- [ ] Validarea **politicii de confidențialitate** și fixarea **termenelor de retenție** (nomenclator arhivistic + Legea 16/1996).
- [ ] Clarificarea denumirii operatorului (**ARACIP / ARACIIP**) în toate actele.

## FAZA 2 — Infrastructură de producție (săptămânile 2–5)

- [ ] **Domeniu oficial** — configurarea unui subdomeniu `*.aracip.ro` (DNS, certificat TLS) + schimbarea expeditorului de e-mail pe `noreply@aracip.ro`.
- [ ] **Decizia de găzduire** — Vercel + Supabase (UE) la start / eventual migrare pe VPS UE sau cloud guvernamental.
- [ ] **Bază de date pe plan plătit** (Supabase) — backup automat, disponibilitate garantată.
- [ ] **Cont Groq pe firmă (tarif plătit)** → creșterea limitei + **reactivarea arhivei verbatim** a asistentului ARA.
- [ ] **Backup automat** + procedură de recuperare (export periodic date + fișiere).
- [ ] **Monitorizare disponibilitate** (ex. UptimeRobot pe `/api/health`) + alerte.

## FAZA 3 — Conturi reale și date (săptămânile 3–7)

- [ ] Trecerea de la parolele demo comune la **conturi individuale** per utilizator (director, ISJ, inspector, formabil, evaluator), cu parolă proprie.
- [ ] **2FA obligatoriu** pentru conturile administrative.
- [ ] **Import în masă** al celor ~1.000 de unități + al datelor ISJ + al evaluatorilor externi.
- [ ] Migrarea/încărcarea datelor inițiale (registre, calendar termene, documente oficiale în arhiva ARA).

## FAZA 4 — Finalizarea conținutului (în paralel, săptămânile 2–6)

- [ ] Preluarea textului **literă-cu-literă** al celor 24 de indicatori din anexa oficială (Monitorul Oficial, HG 631/2022).
- [ ] Confirmarea **calificativelor și pragurilor** (HG 993/2020) de un expert evaluator ARACIP.
- [ ] Actualizarea cunoștințelor și a arhivei ARA cu documentele oficiale finale.

## FAZA 5 — Securitate și recepție (săptămânile 5–8)

- [ ] **Test de securitate (pentest)** oficial + remedierea eventualelor constatări.
- [ ] Revizuirea finală a măsurilor tehnice (art. 32) de către DPO.
- [ ] **Recepția tehnică** cu ARACIP (verificarea funcțională pe fiecare rol).

## FAZA 6 — Instruire și lansare (săptămânile 6–9)

- [ ] Finalizarea **manualelor cu capturi de ecran** pe fiecare rol.
- [ ] **Sesiuni de instruire** per rol (director, ISJ, inspector, formabil, evaluator).
- [ ] Canal de **suport/helpdesk** + procedură de raportare a problemelor.
- [ ] **Go-live** național + comunicarea către unități/ISJ.

## FAZA 7 — Operare și mentenanță (continuu)

- [ ] **SLA** (disponibilitate, timp de răspuns la incidente).
- [ ] Mentenanță, actualizări, backup verificat periodic.
- [ ] Rapoarte periodice de utilizare pentru ARACIP.
- [ ] Evoluții funcționale la cererea autorității.

---

## Rezumat — ce e deja gata (nu se reface)

- Platforma funcțională (toate fluxurile: autorizare, acreditare, evaluare, RAEI, formare, ARA, API).
- Toate documentele de dosar (prezentare, descriere, GDPR + acte juridice gata de semnat, confruntare conținut, manuale, opis).
- Conținutul aliniat la cadrul oficial (24 de indicatori confirmați).

*Plan pregătit de NEWTIME CONCEPT SOLUTIONS S.R.L.*
