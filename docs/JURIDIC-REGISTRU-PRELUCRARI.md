# REGISTRUL ACTIVITĂȚILOR DE PRELUCRARE

**întocmit în temeiul art. 30 din Regulamentul (UE) 2016/679 (GDPR)**

---

**Întocmit de:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Operator:** ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar (autoritate publică) · CIF 18126924 · sediu: Str. Spiru Haret nr. 12, Sector 1, București, cod poștal 010176 · aracip@edu.gov.ro
**Data:** · **Versiune:** finală 1.0

> **Notă privind statutul.** Document finalizat. Registrul operatorului (art. 30 alin. 1) se menține de **ARACIP**; registrul împuternicitului (art. 30 alin. 2) se menține de **NEWTIME**. Termenele de retenție sunt coroborate cu `JURIDIC-POLITICA-RETENTIE.md`.

---

## A. Date de identificare (art. 30 alin. 1 lit. a)

| Element | Valoare |
|---|---|
| **Operator** | ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar · CIF 18126924 · sediu: Str. Spiru Haret nr. 12, Sector 1, București, cod poștal 010176 · aracip@edu.gov.ro |
| **Reprezentant legal operator** | `[nume, funcție — se completează la semnare]` |
| **Responsabil cu protecția datelor (DPO)** | `[nume / date contact — se completează la desemnare]` — vezi `JURIDIC-DPO-desemnare.md` |
| **Persoană împuternicită** | NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627 · contact@aicraiova.ro |
| **Sub-împuterniciți** | Supabase, Vercel/Blob, Groq, Resend (vezi secțiunea C) |

---

## B. Registrul activităților de prelucrare (art. 30 alin. 1 lit. b–g)

### Activitatea 1 — Formare (formabili A.2/A.3, evaluatori)
| Câmp (art. 30) | Conținut |
|---|---|
| **Scopul prelucrării** (b) | Înscriere, urmărirea progresului, emiterea certificatelor de formare |
| **Categorii de persoane vizate** (c) | Personal didactic în formare, evaluatori |
| **Categorii de date** (c) | Nume, e-mail, unitate, județ, progres, certificat |
| **Temei legal** | Art. 6(1)(c)/(e) GDPR — atribuție legală ARACIP |
| **Destinatari** (d) | Personal autorizat ARACIP; împuternicit NEWTIME; sub-împuterniciți Supabase, Vercel |
| **Transferuri extra-UE** (e) | Nu |
| **Termen de stocare** (f) | Durata de valabilitate a certificatului + 3 ani de arhivare |
| **Măsuri de securitate** (g) | RLS, TLS, acces pe roluri — Anexa 2 din DPA |

### Activitatea 2 — Autorizare unitate de învățământ nouă
| Câmp | Conținut |
|---|---|
| **Scop** | Depunerea și analiza dosarului de autorizare de funcționare provizorie |
| **Persoane vizate** | Reprezentanți legali ai unităților, persoane de contact |
| **Categorii de date** | E-mail, telefon, reprezentant legal, **documente de dosar (pot conține act de identitate / CNP — art. 4 Legea 190/2018)** |
| **Temei legal** | Art. 6(1)(e)/(b) GDPR |
| **Destinatari** | Decidenți ARACIP; împuternicit; sub-împuterniciți Supabase, Vercel (Blob privat) |
| **Transferuri extra-UE** | Nu (documentele NU se trimit către AI) |
| **Termen de stocare** | Durata procedurii + 10 ani de arhivare a actului administrativ (Legea nr. 16/1996 / nomenclator arhivistic ARACIP) |
| **Măsuri de securitate** | Blob privat + proxy anti-SSRF, criptare TLS, acces „need-to-know", instruire personal |

### Activitatea 3 — Acreditare / evaluare periodică
| Câmp | Conținut |
|---|---|
| **Scop** | Cereri și evaluare instituțională periodică |
| **Persoane vizate** | Directori / persoane de contact ale unităților |
| **Categorii de date** | E-mail contact director, denumire unitate, CUI |
| **Temei legal** | Art. 6(1)(e) GDPR |
| **Destinatari** | Personal ARACIP; împuternicit; Supabase, Vercel |
| **Transferuri extra-UE** | Nu |
| **Termen de stocare** | Durata acreditării + 10 ani de arhivare (nomenclator arhivistic ARACIP) |
| **Măsuri de securitate** | RLS, TLS, roluri |

### Activitatea 4 — Autoevaluare / RAEI
| Câmp | Conținut |
|---|---|
| **Scop** | Generarea rapoartelor de autoevaluare instituțională (RAEI) |
| **Persoane vizate** | Reprezentanți ai unităților (date de context) |
| **Categorii de date** | Date instituționale (denumire, județ) — fără date sensibile |
| **Temei legal** | Art. 6(1)(e) GDPR |
| **Destinatari** | ARACIP; împuternicit; Supabase, Vercel |
| **Transferuri extra-UE** | Nu |
| **Termen de stocare** | Durata ciclului de evaluare instituțională + 5 ani de arhivare |
| **Măsuri de securitate** | RLS, TLS |

### Activitatea 5 — Asistent conversațional ARA (AI)
| Câmp | Conținut |
|---|---|
| **Scop** | Sprijin informațional pe baza documentelor oficiale ARACIP |
| **Persoane vizate** | Utilizatorii care pun întrebări (personal, directori, vizitatori) |
| **Categorii de date** | Conținutul mesajelor introduse de utilizator |
| **Temei legal** | Art. 6(1)(e); pentru vizitatori care nu exercită o sarcină publică — art. 6(1)(f) (interes legitim) |
| **Destinatari** | Împuternicit; **sub-împuternicit Groq (SUA)** pentru procesarea AI |
| **Transferuri extra-UE** (e) | **DA — SUA (Groq).** Mecanism: SCC art. 46(2)(c) + eventual EU–US DPF art. 45 + **TIA** (vezi `JURIDIC-TRANSFER-GROQ-TIA.md`) |
| **Termen de stocare** | Fără stocare pe termen lung a conținutului; Groq nu antrenează pe datele API și șterge datele în maximum 180 de zile (per DPA Groq) |
| **Măsuri de securitate** | Minimizare (doar întrebări, fără documente/CNP), notă de avertizare în interfață, TLS |

### Activitatea 6 — Cereri de ștergere (drepturi persoane vizate)
| Câmp | Conținut |
|---|---|
| **Scop** | Înregistrarea și soluționarea cererilor de ștergere (art. 17) |
| **Persoane vizate** | Solicitanții |
| **Categorii de date** | E-mail, motivul cererii |
| **Temei legal** | Art. 6(1)(c) — obligație legală |
| **Destinatari** | ARACIP; împuternicit; Supabase |
| **Transferuri extra-UE** | Nu |
| **Termen de stocare** | Dovada soluționării — 3 ani (art. 5(2) responsabilizare) |
| **Măsuri de securitate** | RLS, TLS, acces restrâns |

### Activitatea 7 — Comunicări prin e-mail tranzacțional
| Câmp | Conținut |
|---|---|
| **Scop** | Notificări tranzacționale (confirmări, stadiu cereri) |
| **Persoane vizate** | Utilizatorii Platformei |
| **Categorii de date** | E-mail, conținutul notificării |
| **Temei legal** | Art. 6(1)(e)/(c) (accesoriu fluxului principal) |
| **Destinatari** | Sub-împuternicit **Resend** |
| **Transferuri extra-UE** | UE/SUA — DPA + SCC (art. 46(2)(c)) |
| **Termen de stocare** | Metadate la Resend — 30–90 zile |
| **Măsuri de securitate** | TLS, minimizare conținut |

---

## C. Transferuri către țări terțe (art. 30 alin. 1 lit. e)

| Sub-împuternicit | Țară | Transfer extra-UE | Mecanism / garanții |
|---|---|---|---|
| Supabase | UE (Irlanda) | Nu | Date în UE/SEE |
| Vercel / Blob | UE (execuție) / SUA (companie) | Nu (regiune de execuție UE configurată) | DPA + SCC (art. 46(2)(c)) |
| **Groq** | **SUA** | **DA** | SCC art. 46(2)(c) + eventual DPF art. 45 + **TIA** |
| Resend | UE / SUA | Da (posibil SUA) | DPA + SCC (art. 46(2)(c)) |

---

## D. Registrul împuternicitului (art. 30 alin. 2) — NEWTIME

| Câmp (art. 30 alin. 2) | Conținut |
|---|---|
| (a) **Împuternicit și operator** | NEWTIME CONCEPT SOLUTIONS S.R.L. (CUI 38803627), acționând pentru ARACIP |
| (b) **Categorii de prelucrări** | Operare tehnică Platformă: stocare, consultare, transmitere către sub-împuterniciți, stocare documente, ștergere |
| (c) **Transferuri extra-UE** | Groq (SUA) — SCC (art. 46(2)(c)) + eventual DPF + TIA; Resend (posibil SUA) — DPA + SCC; Vercel — regiune de execuție UE, DPA + SCC |
| (d) **Măsuri de securitate** | Anexa 2 din `JURIDIC-DPA-operator-imputernicit.md` |

---

## E. Măsuri de securitate — descriere generală (art. 30 alin. 1 lit. g)

Găzduire UE (Supabase), criptare TLS/HSTS, RLS pe toate tabelele, blob privat + proxy anti-SSRF, secrete server-side, 2FA administrativ, antete de securitate, rate limiting, anti-enumerare, acces pe roluri, logare server-side, instruire personal. Detaliat în Anexa 2 din DPA.

---

---

**NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627**

Rubricile administrative rămase (numele și funcția reprezentantului legal al operatorului, numele și datele de contact ale DPO) se completează la momentul semnării, respectiv al desemnării DPO.
