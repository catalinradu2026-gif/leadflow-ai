# Ghid platformă ARACIP · Cum funcționează, ce este LIVE

> Ghid complet al platformei (aicraiova.ro) — fiecare portal, cum funcționează și ce e live.
> Găzduire: Vercel (aplicație) + Supabase UE/Irlanda (date, GDPR). AI prin Groq.

## Legendă status
- 🟢 **LIVE** — date reale, salvate în cloud (Supabase/Blob), partajate între portaluri.
- 🔵 **Funcțional** — merge complet, cu date de demonstrație / document generat pe loc.
- ⚪ **Prezentare** — pagină informativă / de navigare.

---

## 1. Prezentare generală

Platforma sprijină procesele ARACIP și formarea din proiect. Trei zone:
- **Calitate / Acreditare** — procesele ARACIP (autorizare, acreditare, evaluare periodică) + lanțul de date live Școală → ISJ → ARACIP.
- **Formare profesională** — e-learning și simulări pentru formabili (A.2) și evaluatori externi (A.3).
- **Portaluri instituționale** — comunicarea și monitorizarea ISJ ↔ directori ↔ inspector național (ARACIP).

Peste tot există **ARA**, asistentul AI cu voce, conștient de pagina pe care te afli.

**Cadrul legal reflectat:** Legea 198/2023 (art. 233 domenii, art. 234 CEAC+RAEI), O.M.E. 6.072/2023, H.G. 993/2020, H.G. 994/2020 mod. H.G. 631/2022 (24 indicatori), Instrucțiunile ARACIP 1–3/2022.

---

## 2. Arhitectura de date — ce e LIVE 🟢

| Ce | Unde se salvează |
|----|------------------|
| Progres formare, rapoarte simulări | Supabase (`formare_progress`, `autoevaluare_reports`, `evaluare_reports`) |
| Depuneri autoevaluare de la unități | Supabase (`unitati_calitate`) |
| RAEI generate de directori | Supabase (`raei_generate`) |
| Cereri de autorizare (unități noi) + documente | Supabase (`cereri_autorizare`) + fișiere pe Vercel Blob |
| Arhiva documente ARACIP | Supabase (`ara_archive`) |
| Cereri GDPR de ștergere | Supabase (`cereri_stergere`) |
| Documente ISJ ↔ directori | Vercel Blob (partajat, persistent) |

Ce se depune într-un loc apare imediat în celelalte tablouri (ISJ pe județ, ARACIP la nivel național).

---

## 3. Portalul central — `/aracip` 🔵
Punct de intrare. Hub cu 3 carduri, marcate după acces:
- 🟢 verde **Autorizare, Acreditare & Evaluare** (`/acreditare`) — public.
- 🔴 roșu **Portal Inspectorate & Directori** (`/demo`) — autentificare.
- 🔴 roșu **Formare Profesională** (`/formare`) — autentificare + rol.

Conține și secțiunea **„Cum folosești platforma"** — 4 pași pe roluri pentru vizitatori (vrei să deschizi o unitate / ești formabil-evaluator / director-ISJ-ARACIP / părinte-cetățean). Include un panou de administrare **ARA** (parolat) pentru cunoștințele chatbotului.

---

## 4. Zona Calitate / Acreditare — `/acreditare` (public)

- 🟢 **`/acreditare/autorizare`** — **dosar de autorizare COMPLET funcțional**, PUBLIC (persoane fizice noi + unități existente care vor un nivel nou — alegere „🆕 nouă / 🏫 existentă" la început). Wizard în 6 pași: date unitate + județ, structură, spații, cadre, **documente cu upload real** (proiect dezvoltare 3–5 ani, ofertă educațională, acte spații, dotări, aviz ISU, aviz DSP, regulament intern — conform HG 994/2020) și trimitere. La depunere → **număr de înregistrare real** + apare la ISJ și ARACIP → **ARACIP acceptă/respinge** → la acceptare se generează **Autorizația de funcționare provizorie (PDF)**.
- 🔒 **Acreditare** și **Evaluare periodică** — pe /acreditare sunt **info publică** („Vezi cum funcționează"), dar **depunerea efectivă se face din Portalul Director** (unități deja autorizate). Autoevaluarea/RAEI nu apare pe /acreditare (e la Director).
- ⚪ `/acreditare/acreditare-scolara` — acreditarea instituțională (criterii, vizită, dosar).
- ⚪ `/acreditare/evaluare-periodica` — evaluarea externă la 5 ani.
- 🟢 `/acreditare/depunere` — **formularul prin care o școală depune autoevaluarea** (calificative A/B/C) → apare la ISJ + ARACIP.
- 🟢 `/acreditare/dashboard` — unitățile depuse real apar cu badge „LIVE".
- 🟢 `/acreditare/registre` — registrele naționale; unitățile reale apar cu badge „LIVE".
- ⚪ `/acreditare/legislatie`, `/acreditare/faq` — informativ.

---

## 5. Portalul de Formare — `/formare` (autentificare + rol) 🟢

Pentru FORMABILI (A.2) și EVALUATORI EXTERNI (A.3). După login (nume+email+rol) vezi modulele potrivite rolului. La finalizare apare butonul **certificat PDF nominal**.

- 🟢 **E-Learning** (`/formare/elearning`) — 6 cursuri (cadru legal, 24 indicatori, CEAC, RAEI, evaluare externă, calitate.aracip.eu), lecții + quiz, progres salvat în cloud.
- 🟢 **Simulare Autoevaluare / RAEI** (`/formare/simulare-autoevaluare`, A.2) — completarea RAEI pe 24 indicatori, cu feedback și scor.
- 🟢 **Simulare Evaluare Externă** (`/formare/simulare-evaluare-externa`, A.3) — procesul evaluatorului: documente, vizită, interviuri, raport.
- 🟢 **Panou administrare** (`/formare/admin`) — coordonatorul (ADMIN) vede toți participanții, progres, certificate, export Excel/PDF. Apare și ca tab în Inspector Național.

Toate datele de formare se **conectează la tabloul central ARACIP** (vezi 6.3).

*(Pași detaliați: secțiunea 10.)*

---

## 6. Portaluri instituționale — `/demo`

### 6.1. Director — `/demo/director` 🟢/🔵
Vede documentele/circularele de la ISJ și ARACIP (🟢 partajate), cu **Calendar de termene**, **Checklist de conformitate**, asistent AI, chat cu inspectorul. Include:
- 🟢 **Generator RAEI** (`/demo/director/raei`) — completează secțiunile și **generează un RAEI printabil/PDF**; totodată datele se salvează și apar la ISJ + ARACIP.

### 6.2. ISJ — `/demo/isj` 🟢 — MONITORIZARE JUDEȚEANĂ
Inspectoratul județean (demo Dolj). Vede documentele/comunicarea + un bloc **„📊 Asigurarea calității în județ — LIVE"** cu, filtrat pe județ:
- **Autoevaluările depuse** de unitățile din județ
- **RAEI-urile** generate de directori
- **Cererile de autorizare** (unități noi)

*(Rolul de monitorizare al ISJ e conform procedurii oficiale — RAEI se transmite și inspectoratului școlar județean.)*

### 6.3. Inspector Național (ARACIP) — `/demo/inspector` 🟢 — TABLOUL CENTRAL
Nivelul ARACIP. Pe tabloul central vede LIVE:
- 🟢 **Rezumat Formare** — total participanți, formabili (A.2), evaluatori (A.3), progres mediu, finalizați, certificate
- 🟢 **Cereri de autorizare** (unități noi) — nr. înregistrare, unitate, județ, nivel, status. ARACIP **deblochează deciziile** (parolă) → **Acceptă / Respinge** fiecare cerere → la „autorizat" generează **📄 Autorizația (PDF)**.
- 🟢 **RAEI generate** de unități
- 🟢 **Depuneri autoevaluare** pe județe (tab „Situație Județe")
- Tab-uri: Documente Publicate, **Arhiva ARACIP**, **Formare** (panoul complet de administrare)

---

## 7. ARA — asistentul AI (transversal) 🔵
Chatbot cu voce, pe toate paginile. Știe pe ce pagină ești și adaptează salutul, întrebările și răspunsurile. Cunoaște procesele ARACIP, harta portalului și documentele din arhivă (RAG). AI prin Groq.

---

## 8. Lanțul calității LIVE 🟢 (fluxurile-cheie)

Trei fluxuri reale, toate ajung la ISJ (județ) și ARACIP (național):

1. **Autoevaluare** — o școală intră la `/acreditare/depunere`, trimite calificativele pe domeniile A/B/C.
2. **RAEI** — un director generează RAEI-ul la `/demo/director/raei`.
3. **Autorizare** — un fondator/firmă depune dosarul (cu documente) la `/acreditare/autorizare` → număr de înregistrare → apare la ISJ + ARACIP → **ARACIP acceptă/respinge** → la acceptare iese **Autorizația de funcționare provizorie (PDF)**. Conform procedurii oficiale (ordin ministru la propunerea Consiliului ARACIP).

În toate cazurile: datele se salvează instant în Supabase și apar **live** la **ISJ** (filtrat pe județul lui) și la **ARACIP Național** (agregat). Model „date live partajate", fără conturi individuale pe instituție.

---

## 9. Confidențialitate & GDPR — `/confidentialitate` 🟢
- ⚪ `/confidentialitate` — politica de confidențialitate completă.
- 🟢 `/confidentialitate/stergere` — dreptul la ștergere (cererile se salvează în Supabase).
- Casetă de **consimțământ obligatorie** la înscriere și depunere.
- Securitate: antete HTTP (CSP, HSTS etc.), 2FA pregătit pe admin, endpoint de sănătate `/api/health` pentru monitorizare uptime.

---

## 10. Cum funcționează pas cu pas (formare)

### E-Learning (comun A.2 + A.3)
1. Vezi 6 cursuri cu bară „Progres X/6". Se deblochează în lanț.
2. Deschizi un curs → 4–6 lecții de text.
3. La ultima lecție → Quiz (4 întrebări). Prag de promovare 75%.
4. Reușit → curs finalizat + se deblochează următorul. La 6/6 → butonul de certificat.

### Simulare Autoevaluare — RAEI (A.2)
1. Partea I: date unitate. Partea a III-a: parcurgi cei 24 de indicatori, calificativ + dovezi.
2. Un „Nesatisfăcător" → general „Nesatisfăcător". Se generează Raportul RAEI (+ plan de îmbunătățire).

### Simulare Evaluare Externă (A.3)
1. Alegi o unitate fictivă → analizezi documentele → vizita (calificative pe 24 indicatori) → interviuri → raport de evaluare externă (cu cele 5 întrebări fundamentale).

---

## 11. PENTRU ARACIP — ce văd și ce pot face

### Ce VĂD (tabloul central, Inspector Național)
- Rezumatul LIVE al **formării** (formabili/evaluatori, progres, certificate)
- **Cererile de autorizare** ale unităților noi (cu documentele atașate)
- **RAEI-urile** generate și **autoevaluările** depuse, agregate pe județe
- Situația completă a participanților (parolat), arhiva documentelor

### Ce POT FACE
- Monitoriza formarea celor 1.000 de unități, emite/descărca certificate nominale, exporta rapoarte (Excel/PDF)
- Urmări live autoevaluările, RAEI-urile și cererile de autorizare
- Gestiona documente și comunica cu ISJ-urile și unitățile

### Fluxul complet
Fondator/școală/director **depune** (autorizare / autoevaluare / RAEI) → **ISJ vede** (județ) → **ARACIP vede** (național). Formabil/evaluator **se formează** → primește **certificat** → ARACIP vede în tabloul central.

---

## 12. Acces (parole demo)
| Zonă | Cine | Acces |
|------|------|-------|
| `/acreditare` și sub-pagini | Public | Fără parolă |
| `/formare` | Formabil / Evaluator | Login pe `/aracip` (nume+email+rol) |
| `/formare/admin` și tab Formare | Admin | Parolă ADMIN |
| `/demo/*` | Instituții | Parolă demo |

*(Parolele demo sunt comune pentru prezentare.)*
