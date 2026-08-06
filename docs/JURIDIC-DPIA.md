# EVALUAREA IMPACTULUI ASUPRA PROTECȚIEI DATELOR (DPIA)

**întocmită în temeiul art. 35 din Regulamentul (UE) 2016/679 (GDPR)**

---

**Întocmit de:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Operator:** ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar (autoritate publică) · CIF 18126924 · sediu: Str. Spiru Haret nr. 12, Sector 1, București, cod poștal 010176 · aracip@edu.gov.ro
**Obiect:** Platforma digitală de asigurare a calității în învățământul preuniversitar (aicraiova.ro/aracip)
**Data:** · **Versiune:** finală 1.0

> **Notă privind statutul.** Document finalizat. Avizul DPO (art. 35 alin. 2) și, dacă rezultă risc rezidual ridicat, consultarea prealabilă a ANSPDCP (art. 36) sunt acte proprii ale operatorului (ARACIP) prin DPO desemnat; rubricile administrative aferente (aviz DPO, dată) se completează la momentul asumării.

---

## 1. Necesitatea efectuării DPIA

Conform **art. 35 alin. (1) GDPR**, DPIA este obligatorie când un tip de prelucrare este susceptibil să genereze **un risc ridicat** pentru drepturile și libertățile persoanelor fizice. Art. 35 alin. (3) enumeră cazurile în care DPIA este **în special** necesară:
(a) evaluare sistematică și cuprinzătoare a aspectelor personale bazată pe prelucrare automată (inclusiv profiling) cu efecte juridice;
(b) prelucrarea pe scară largă a categoriilor speciale de date (art. 9) sau a datelor privind condamnări penale;
(c) monitorizarea sistematică pe scară largă a unei zone accesibile publicului.

**Aplicare la Platformă:** deși prelucrarea nu se încadrează automat într-unul dintre cazurile art. 35(3), Ghidul WP248 (EDPB) recomandă DPIA la întrunirea a **cel puțin două criterii de risc**. În cazul de față se întrunesc:
- **prelucrare pe scară largă** (~11.500 unități de învățământ + formabili + inspectori la nivel național);
- **date de identificare cu risc ridicat** (acte de identitate / CNP în documentele de dosar — art. 4 Legea 190/2018);
- **monitorizare sistematică** a proceselor de calitate la nivel național;
- **utilizarea unei tehnologii noi** (componentă AI — asistentul ARA).

**Concluzie:** efectuarea DPIA este **justificată și necesară**.

---

## 2. Descrierea sistematică a prelucrărilor (art. 35 alin. 7 lit. a)

### 2.1. Prezentare generală
Platforma sprijină atribuțiile legale ale ARACIP (Legea nr. 198/2023 și actele de aplicare) în asigurarea calității în învățământul preuniversitar. Componente / fluxuri:

| Flux | Descrierea prelucrării | Date personale | Temei (art. 6 GDPR) |
|---|---|---|---|
| **Formare** (formabili A.2/A.3, evaluatori) | Înscriere, urmărire progres, emitere certificat | Nume, e-mail, unitate, județ, progres, certificat | Art. 6(1)(c)/(e) |
| **Autorizare unitate nouă** | Depunere și analiză dosar cu documente | E-mail, telefon, reprezentant legal, **documente dosar (pot conține act identitate/CNP)** | Art. 6(1)(e)/(b) |
| **Acreditare / evaluare periodică** | Cereri și evaluare instituțională | E-mail contact director, denumire unitate, CUI | Art. 6(1)(e) |
| **Autoevaluare / RAEI** | Generare rapoarte instituționale | Date instituționale (fără date sensibile) | Art. 6(1)(e) |
| **Asistent ARA (chat AI)** | Răspunsuri la întrebări pe baza documentelor oficiale | Conținutul mesajelor introduse de utilizator | Art. 6(1)(e); pentru vizitatori care nu exercită o sarcină publică — art. 6(1)(f) (interes legitim) |
| **API** | Interogări tehnice între componente | Idem fluxurilor deservite | Idem |
| **Cereri de ștergere** | Înregistrare și soluționare | E-mail, motivul cererii | Art. 6(1)(c) — obligație legală (art. 17) |

### 2.2. Fluxul datelor și destinatari
- **Colectare:** direct de la persoana vizată (autoservire) prin formularele Platformei.
- **Stocare:** bază de date Supabase Postgres, UE (Irlanda); documentele de dosar în stocare privată (Vercel Blob).
- **Împuternicit:** NEWTIME CONCEPT SOLUTIONS S.R.L. (operare tehnică).
- **Sub-împuterniciți:** Supabase (UE), Vercel/Blob (UE, companie SUA), **Groq (SUA — AI)**, Resend (e-mail). Vezi `JURIDIC-REGISTRU-PRELUCRARI.md`.
- **Transfer extra-UE:** doar către **Groq (SUA)**, limitat la conținutul întrebărilor din asistentul ARA — vezi `JURIDIC-TRANSFER-GROQ-TIA.md`.

### 2.3. Categorii speciale (art. 9)
Nu se prelucrează intenționat. Documentele de dosar pot conține date de identificare (art. 4 Legea 190/2018), tratate cu măsuri specifice.

---

## 3. Necesitate și proporționalitate (art. 35 alin. 7 lit. b)

- **Temeiul legal:** art. 6(1)(c)/(e) — atribuțiile legale ale ARACIP; **nu** se folosește consimțământul pentru sarcinile publice (dezechilibru de putere — considerentul 43).
- **Minimizarea datelor (art. 5(1)(c)):** se colectează doar câmpurile necesare fiecărui flux (ex. la verificarea stadiului: doar nr. cerere + e-mail). Către AI se trimit doar întrebările, fără documente/CNP.
- **Limitarea scopului (art. 5(1)(b)):** datele de formare nu se folosesc în scop de marketing.
- **Exactitate (art. 5(1)(d)):** persoana vizată își introduce și corectează propriile date.
- **Limitarea stocării (art. 5(1)(e)):** termene în `JURIDIC-POLITICA-RETENTIE.md`.
- **Informarea (art. 13/14):** politica de confidențialitate `/confidentialitate` + casete de informare.
- **Drepturile persoanelor (art. 12–22):** informare, acces, rectificare, ștergere (formular `/confidentialitate/stergere`), restricționare, portabilitate, opoziție.

**Concluzie proporționalitate:** prelucrarea este necesară și proporțională cu scopul de interes public urmărit; măsurile de minimizare reduc impactul.

---

## 4. Evaluarea riscurilor pentru drepturile persoanelor (art. 35 alin. 7 lit. c)

Scală: probabilitate × impact (Scăzut / Mediu / Ridicat).

| # | Risc | Sursa | Probabilitate | Impact | Nivel inițial |
|---|---|---|---|---|---|
| R1 | **Acces neautorizat** la documente de dosar (act identitate/CNP) | Atac / configurare greșită | Medie | Ridicat | **Ridicat** |
| R2 | **Divulgare prin transfer extra-UE** (Groq/SUA) — acces autorități SUA | Cadrul juridic SUA | Scăzută–Medie | Mediu | **Mediu** |
| R3 | **Confirmarea existenței** unei cereri (enumerare) | Flux public | Scăzută | Mediu | Scăzut–Mediu |
| R4 | **Pierderea/alterarea** datelor | Incident tehnic la sub-împuternicit | Scăzută | Mediu | Scăzut–Mediu |
| R5 | **Prelucrare peste scop** / retenție excesivă | Lipsa termenelor clare | Medie | Mediu | Mediu |
| R6 | **Introducerea de date personale în chatul AI** de către utilizator | Comportament utilizator | Medie | Mediu | Mediu |
| R7 | **Breșă nenotificată în termen** | Lipsă procedură | Scăzută | Ridicat | Mediu |
| R8 | **Acces intern excesiv** (rol prea larg) | Configurare roluri | Scăzută | Mediu | Scăzut–Mediu |

---

## 5. Măsuri de atenuare (art. 35 alin. 7 lit. d)

| Risc | Măsuri de atenuare | Nivel rezidual |
|---|---|---|
| R1 | Blob privat + proxy server-side anti-SSRF; RLS; scriere doar server-side; criptare TLS; acces pe roluri „need-to-know"; instruire personal (art. 4 L.190/2018) | **Scăzut–Mediu** |
| R2 | Minimizare (fără CNP/documente către AI); DPA + **SCC** cu Groq; verificarea EU–US DPF; **TIA** dedicat; recomandare migrare AI în UE | **Scăzut–Mediu** |
| R3 | Anti-enumerare (nu confirmă existența fără potrivire e-mail); rate limiting | Scăzut |
| R4 | Sub-împuterniciți cu DPA + backup; monitorizare; măsuri art. 32 | Scăzut |
| R5 | Politica de retenție cu termene per categorie + ștergere/anonimizare la expirare | Scăzut |
| R6 | Notă de informare în interfața ARA („nu introduceți date personale"); minimizare; fără antrenare pe date (DPA Groq confirmă neutilizarea pentru antrenare) | Scăzut |
| R7 | Procedură de notificare a breșelor (72h ANSPDCP), registru intern art. 33(5); notificare împuternicit → operator ≤24h | Scăzut |
| R8 | Roluri stricte, principiul minimului privilegiu, logare server-side, revizuire periodică acces | Scăzut |

---

## 6. Consultarea DPO și a persoanelor vizate

- **Avizul DPO (art. 35 alin. 2):** se solicită DPO desemnat al ARACIP înainte de asumarea DPIA. Rubrică administrativă: `[aviz DPO — se completează la asumare]`.
- **Punctul de vedere al persoanelor vizate (art. 35 alin. 9):** dat fiind că prelucrarea se întemeiază pe atribuțiile legale ale ARACIP și că persoanele vizate sunt informate prin politica de confidențialitate și casetele de informare, consultarea directă nu este necesară; rămâne la aprecierea operatorului activarea unui mecanism de consultare (ex. sesiuni cu unitățile de învățământ) dacă apreciază oportun.

---

## 7. Concluzie

Cu măsurile de atenuare implementate și menținute, **riscul rezidual global este redus la nivel Scăzut–Mediu**, acceptabil pentru operarea Platformei. Punctul de atenție rămas este **transferul către Groq (SUA)** (R2), pentru care se impun SCC + TIA și, ca soluție de eliminare a riscului, migrarea componentei AI către un furnizor cu opțiune UE.

**Recomandare:** cu măsurile de atenuare implementate, riscul rezidual rămâne sub pragul „ridicat", astfel încât DPIA se finalizează **fără** consultare prealabilă a ANSPDCP (art. 36). Consultarea prealabilă devine necesară numai dacă, la o reevaluare ulterioară, riscul rezidual R1/R2 revine la nivel ridicat.

**Revizuire:** DPIA se reevaluează la orice modificare semnificativă a prelucrării (art. 35 alin. 11) și cel puțin **anual**.

---

**NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627**

Rubricile administrative rămase (avizul DPO și data asumării) se completează la momentul asumării de către operator.
