# Conformitate GDPR — Platforma ARACIP (aicraiova.ro)

**Întocmit de:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Operator:** Agenția Română de Asigurare a Calității în Învățământul Preuniversitar (ARACIP) · CIF 18126924 · sediu: Strada Spiru Haret nr. 12, Sector 1, București, cod poștal 010176
**Aplicație:** Platformă digitală de asigurare a calității în învățământul preuniversitar
**Versiune document:** 1.0

> Acest document descrie măsurile tehnice și organizatorice implementate în platformă și structura documentației GDPR aferente. Fundamentează suita de documente juridice conexe: Acordul de prelucrare (`JURIDIC-DPA-operator-imputernicit.md`), Registrul activităților de prelucrare (`JURIDIC-REGISTRU-PRELUCRARI.md`), DPIA (`JURIDIC-DPIA.md`), Politica de retenție (`JURIDIC-POLITICA-RETENTIE.md`), Evaluarea transferului către Groq/SUA (`JURIDIC-TRANSFER-GROQ-TIA.md`) și Desemnarea DPO (`JURIDIC-DPO-desemnare.md`).

---

## 1. Roluri privind prelucrarea datelor

| Rol GDPR | Entitate |
|----------|----------|
| **Operator** | ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar (stabilește scopurile și mijloacele) |
| **Persoană împuternicită** | NEWTIME CONCEPT SOLUTIONS S.R.L. (dezvoltare și operare tehnică) |
| **Sub-împuterniciți** | Furnizorii de infrastructură (secțiunea 6) |

Relația Operator ↔ Împuternicit se reglementează printr-un **Acord de prelucrare a datelor (DPA)** conform art. 28 GDPR (model în secțiunea 8).

---

## 2. Categorii de date prelucrate și temei legal

| Flux / scop | Date cu caracter personal | Temei legal (art. 6 GDPR) |
|-------------|---------------------------|---------------------------|
| Formare (formabili A.2 / evaluatori A.3) | Nume, email, unitate, județ, progres, certificat | Obligație legală / interes public (art. 6(1)(c)/(e)) — atribuția ARACIP |
| Autorizare unitate nouă | Email, telefon, reprezentant legal, documente dosar (pot conține date de identificare) | Interes public / demers precontractual (art. 6(1)(e)/(b)) |
| Acreditare / evaluare periodică | Email contact director, denumire unitate, CUI | Interes public (art. 6(1)(e)) |
| Autoevaluare / RAEI | Date instituționale (fără date personale sensibile) | Interes public |
| Asistent ARA (chat) | Conținutul mesajelor introduse de utilizator | Sarcină de interes public (art. 6(1)(e)) — sprijin la procesele ARACIP; pentru vizitatori care nu exercită o sarcină publică, temeiul este interesul legitim (art. 6(1)(f)) |
| Cereri de ștergere (GDPR) | Email, motivul cererii | Obligație legală (art. 17 GDPR) |

**Categorii speciale (art. 9):** platforma NU solicită și NU prelucrează intenționat date sensibile. Documentele încărcate la autorizare (ex. copie act de identitate al reprezentantului) pot conține date de identificare — acestea sunt stocate privat, criptat în tranzit, accesibile doar decidenților ARACIP (secțiunea 5).

**Temeiul legal pentru o autoritate publică — regulă importantă:** ARACIP este autoritate/organism public. Pentru sarcinile sale (formare, autorizare, acreditare, evaluare, RAEI) prelucrarea se întemeiază pe **art. 6(1)(c) — obligație legală** (Legea nr. 198/2023, HG 993/2020, HG 994/2020 mod. HG 631/2022) și/sau **art. 6(1)(e) — sarcină de interes public / exercitarea autorității publice**, NU pe consimțământ. Consimțământul (art. 6(1)(a)) rămâne valabil doar pentru **prelucrări accesorii** (ex. comunicări opționale, cookie-uri non-esențiale). O autoritate publică nu se poate baza pe consimțământ pentru sarcinile sale, din cauza dezechilibrului de putere (considerentul 43 GDPR).

**Legea nr. 190/2018, art. 4 — numărul de identificare național (inclusiv CNP, seria și numărul actului de identitate):** întrucât documentele de dosar pot conține copia actului de identitate al reprezentantului legal, se aplică art. 4 din Legea nr. 190/2018. Aceasta impune: temei valabil din art. 6(1) GDPR (aici (c)/(e)), măsuri tehnice și organizatorice adecvate (art. 32), **desemnarea unui DPO** (art. 10 Legea 190/2018), **termene clare de stocare** și **instruirea periodică** a persoanelor care prelucrează efectiv aceste date. Toate aceste cerințe sunt implementate procedural prin suita de documente conexe (Politica de retenție, Desemnarea DPO, măsurile din secțiunea 5).

### 2.1. Inventar detaliat pe tabele (registru tehnic)

| Tabelă / stocare | Date cu caracter personal | Scop |
|------------------|---------------------------|------|
| `formare_progress` | Nume, e-mail, unitate, județ (în `details`) | Evidența parcursului de formare |
| `autoevaluare_reports` / `evaluare_reports` | Identificator participant, date de context | Rezultatele simulărilor |
| `cereri_autorizare` | E-mail, telefon, reprezentant legal + **documentele dosarului** (pot conține act de identitate) | Procedura de autorizare |
| `cereri_evaluare` | E-mail contact director | Acreditare / evaluare periodică |
| `unitati_calitate`, `raei_generate` | Date instituționale (denumire, județ) — fără date personale sensibile | Lanțul calității |
| `cereri_stergere` | E-mail, motivul cererii | Exercitarea dreptului la ștergere |
| Documente (Vercel Blob privat) | Fișierele atașate dosarelor (pot conține date personale) | Probatoriu |
| `ara_archive` | Documente oficiale ARACIP (fără date personale) | Baza de cunoaștere a asistentului ARA |

Datele transmise asistentului AI (Groq) sunt exclusiv întrebările utilizatorului; NU se transmit documente cu date personale către modelul AI.

---

## 3. Principii aplicate (art. 5 GDPR)

- **Minimizare:** se colectează doar câmpurile necesare fluxului (ex. la verificarea stadiului: doar nr. cerere + email).
- **Limitarea scopului:** datele de formare nu se folosesc în scop de marketing.
- **Exactitate:** utilizatorul își introduce și corectează propriile date.
- **Limitarea stocării:** politică de retenție (secțiunea 7).
- **Integritate și confidențialitate:** măsuri tehnice (secțiunea 5).
- **Responsabilitate:** prezentul registru + logare server-side a deciziilor.

---

## 4. Drepturile persoanelor vizate (art. 12–22)

Platforma pune la dispoziție:
- **Dreptul la informare** — pagina `/confidentialitate` (politică de confidențialitate completă).
- **Dreptul la ștergere („dreptul de a fi uitat")** — formular `/confidentialitate/stergere` → se înregistrează în baza de date și se soluționează.
- **Dreptul de acces / rectificare / restricționare / portabilitate / opoziție** — prin cererea transmisă la datele de contact ale operatorului (contact@aicraiova.ro).
- **Informare (art. 13/14) și acord** — caseta de acord la înscriere și la depunerea dosarelor funcționează ca **confirmare a informării** și trimitere la politica de confidențialitate; ea NU constituie temeiul juridic al prelucrării principale (care este art. 6(1)(c)/(e) — vezi secțiunea 2). Consimțământul propriu-zis se folosește doar pentru prelucrări accesorii/opționale.

Termen de răspuns: **o lună** de la primirea cererii, extensibil cu **încă două luni** în cazuri complexe sau numeroase, cu informarea persoanei vizate în prima lună (art. 12(3)).

---

## 5. Măsuri tehnice și organizatorice (art. 32)

**Implementate în platformă:**
- **Găzduire în UE** — baza de date Supabase Postgres, regiune `eu-west-1` (Irlanda, UE/SEE).
- **Criptare în tranzit** — HTTPS/TLS obligatoriu (HSTS activat).
- **Row Level Security (RLS)** activat pe toate tabelele; scriere doar server-side cu cheie de serviciu (niciodată din browser).
- **Documente cu date personale** — stocate în blob **privat**; descărcarea doar printr-un proxy server-side protejat cu parola ARACIP (anti-SSRF, fără expunere de linkuri directe).
- **Parole și secrete** — exclusiv pe server (variabile de mediu), niciodată în cod client.
- **Autentificare 2FA (TOTP)** disponibilă pentru conturile administrative.
- **Antет de securitate** — CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy.
- **Rate limiting** pe API-uri publice (anti-abuz).
- **Anti-enumerare** — verificarea stadiului nu confirmă existența unei cereri fără potrivirea email-ului.

**Organizatorice:**
- Acces pe roluri (director / ISJ / inspector național / administrator).
- Logare server-side a deciziilor (autorizare/acreditare) cu marcaj temporal.
- Principiul „need-to-know" — fiecare rol vede doar datele relevante.

---

## 6. Sub-împuterniciți (furnizori de infrastructură)

| Furnizor | Rol | Localizare date | Garanții |
|----------|-----|-----------------|----------|
| Supabase | Bază de date | UE (Irlanda) | GDPR, DPA disponibil |
| Vercel | Găzduire aplicație + stocare fișiere (Blob) | UE (regiuni configurabile), companie SUA | DPA + SCC (art. 46(2)(c)); regiune de execuție UE configurată pentru funcțiile serverless și Blob |
| **Groq** | Procesare AI (asistent ARA) | **SUA — transfer extra-UE (cap. V GDPR)** | **RISC DE TRANSFER:** mecanism valid cap. V — SCC (art. 46(2)(c)) încorporat în DPA-ul Groq, cu eventuală adecvare EU–US Data Privacy Framework (art. 45), plus evaluarea impactului transferului (TIA — vezi `JURIDIC-TRANSFER-GROQ-TIA.md`). Conținutul întrebărilor poate include date personale, deci transferul intră sub cap. V chiar dacă nu se trimit documente/date sensibile. |
| Resend | Trimitere email tranzacțional | UE/SUA | DPA + SCC (art. 46(2)(c)) pentru transferul SUA |

> **Semnalare de risc (transfer extra-UE):** singura componentă care generează un transfer de date către o țară terță (SUA) este **Groq**. Fără un mecanism valid de transfer (SCC sau adecvare DPF) + TIA, transferul este neconform (cap. V GDPR, art. 44–49).
> **Recomandare:** pentru o autoritate publică, migrarea către găzduire integral UE (inclusiv componenta AI — furnizor cu opțiune UE sau model găzduit UE) elimină acest transfer — vezi documentul de găzduire (pct. 7).

---

## 7. Politică de retenție

| Date | Perioadă de păstrare |
|------|----------------------|
| Dosare de autorizare/acreditare | Pe durata procedurii + termen legal de arhivare al actelor administrative |
| Date de formare + certificate | Pe durata de valabilitate a certificatului + arhivare |
| Cereri de ştergere | Se soluţionează, apoi se păstrează dovada soluţionării |
| Loguri tehnice | Perioadă limitată, strict pentru securitate |

La expirarea termenului, datele se șterg sau se anonimizează.

---

## 8. Suita de documente juridice a conformității

Conformitatea GDPR a Platformei este asigurată prin următoarea suită de documente, finalizate și pregătite pentru semnare:

1. **Acord de prelucrare a datelor (DPA)** Operator–Împuternicit (art. 28) — `JURIDIC-DPA-operator-imputernicit.md`, cu toate clauzele obligatorii ale **art. 28(3)(a)–(h)**: (a) prelucrare doar pe instrucțiuni documentate; (b) confidențialitatea persoanelor autorizate; (c) măsuri de securitate art. 32; (d) condiții pentru sub-împuterniciți; (e) asistență la drepturile persoanelor vizate (art. 12–23); (f) asistență la art. 32–36; (g) ștergerea/returnarea datelor la finalul prelucrării; (h) informații pentru audit/inspecții.
2. **Politica de confidențialitate** — textul publicat pe `/confidentialitate` (art. 13/14: operator, DPO, temeiuri, destinatari, transfer extra-UE + mecanism, retenție, drepturi + dreptul de plângere la ANSPDCP).
3. **Registrul activităților de prelucrare** (art. 30) — `JURIDIC-REGISTRU-PRELUCRARI.md`.
4. **Desemnare DPO — OBLIGATORIE** pentru autoritate publică conform **art. 37(1)(a) GDPR** și **art. 10(1) Legea nr. 190/2018** — `JURIDIC-DPO-desemnare.md`; datele de contact ale DPO se publică și se comunică ANSPDCP (art. 37(7)).
5. **DPA-uri cu sub-împuterniciții** (Supabase, Vercel, Groq, Resend) + **mecanism de transfer valid pentru extra-UE** — pentru **Groq (SUA)**: SCC (art. 46(2)(c)) încorporat în DPA-ul Groq, cu eventuală adecvare EU–US DPF (art. 45), plus **TIA** — `JURIDIC-TRANSFER-GROQ-TIA.md`.
6. **Procedură de notificare a breșelor** (art. 33/34) — 72h către ANSPDCP; registru intern al breșelor (art. 33(5)) — mecanism reglementat în DPA (Art. 9) și în fișa de atribuții a DPO.
7. **Evaluare de impact (DPIA)** (art. 35) — `JURIDIC-DPIA.md`, justificată de: prelucrare la scară largă (≈11.500 unități + inspectori + formabili), date de identificare în documentele de dosar (art. 4 Legea 190/2018), monitorizare sistematică națională și componentă AI. La risc rezidual ridicat → **consultarea prealabilă a ANSPDCP** (art. 36).
8. **Aplicarea art. 4 Legea 190/2018** pentru actele de identitate încărcate: măsuri, termene de stocare concrete și instruirea periodică a personalului — reflectată în Politica de retenție și în măsurile din secțiunea 5.
9. **Termene concrete de retenție** — `JURIDIC-POLITICA-RETENTIE.md`, corelate cu nomenclatorul arhivistic al ARACIP și Legea nr. 16/1996 (detaliază secțiunea 7).

---

**NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627**
