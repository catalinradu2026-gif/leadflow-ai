# Descriere funcțională completă — Platforma ARACIP
## Catalog exhaustiv de capabilități (inventar pentru evaluator)

**Furnizor:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627 · J2018000242160
**Contact:** contact@aicraiova.ro
**Aplicație:** platformă digitală de asigurare a calității în învățământul preuniversitar
**Acces demonstrativ:** https://aicraiova.ro/aracip
**Versiune document:** 1.0

---

## Cuprins

1. Scop și structură generală
2. Cadrul legal aplicat
3. Portalul central de calitate (`/aracip`)
4. Zona Calitate și Acreditare (`/acreditare`) — procese B2G
5. Modulul Formare Profesională (A.2 / A.3)
6. Portaluri instituționale (director / ISJ / inspector național)
7. Documente și comunicare instituțională (confirmări de citire)
8. Asistentul virtual ARA
9. Arhiva de documente oficiale (RAG)
10. Registre, legislație, calendar, listă de verificare
11. Interfața de programare (API public v1)
12. Protecția datelor și mecanisme de securitate
13. Accesibilitate, voce și utilizare pe mobil
14. Notificări prin e-mail
15. Module opționale, separate de oferta ARACIP curentă

---

## 1. Scop și structură generală

Platforma este o aplicație web (Next.js, App Router, TypeScript) care digitalizează integral procesele de asigurare a calității coordonate de ARACIP și programele de formare aferente. Structura de acces se organizează în trei mari zone, prezentate ca trei carduri pe pagina principală `/aracip`:

- **Portal Inspectorate & Directori** (securizat) — portalurile instituționale (director, ISJ, inspector național).
- **Autorizare, Acreditare & Evaluare** (acces public) — procesele ARACIP propriu-zise.
- **Formare Profesională** (securizat) — e-learning și simulările pentru formabili (A.2) și evaluatori externi (A.3).

Pagina principală mai conține: statistici sintetice (≈11.500 unități, 42 de județe, 100% digital, disponibil 24/7), o secțiune „Cum folosești platforma" cu pași diferențiați pe roluri (fondator, formabil/evaluator, director/ISJ/inspector, părinte/cetățean) și un **panou ascuns de administrare a documentelor ARACIP** (deblocat cu parola de administrator), descris la punctul 7.

---

## 2. Cadrul legal aplicat

Conținutul juridic al platformei (e-learning, simulări, asistentul ARA, pagina de legislație, documentele PDF generate) reflectă cadrul normativ în vigoare:

- **Legea învățământului preuniversitar nr. 198/2023**, Titlul IV „Asigurarea calității" — art. 233 (domeniile și criteriile) și art. 234 (Comisia pentru Evaluarea și Asigurarea Calității — CEAC — și raportul anual de evaluare internă); a abrogat O.U.G. nr. 75/2005.
- **O.M.E. nr. 6.072/2023** — măsuri tranzitorii care mențin în aplicare metodologia și standardele existente până la elaborarea noilor acte de aplicare a Legii nr. 198/2023.
- **H.G. nr. 993/2020** — Metodologia de evaluare instituțională (autorizare, acreditare, evaluare periodică).
- **H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022** — standardele și cei 24 de indicatori de performanță, aplicabili din anul școlar 2022–2023, pe trei domenii (capacitate instituțională, eficacitate educațională, managementul calității), cu accent pe proces, rezultate, starea de bine, acces și echitate.
- **Instrucțiunile ARACIP nr. 1–3/2022** — documentele probatorii corelate pe indicatori (platforma oficială calitate.aracip.eu).

Notă privind denumirea agenției: în conținutul de formare se explică faptul că Legea nr. 198/2023 prevede reorganizarea ARACIP în ARACIIP (cu preluarea inspecției școlare), tranziție amânată până la anul școlar 2026–2027; până atunci activitatea continuă sub denumirea ARACIP.

---

## 3. Portalul central de calitate (`/aracip`)

**Capabilități:**
- Hub de navigare cu trei carduri (secțiunea 1), fiecare marcat vizual „Securizat" / „Nesecurizat".
- Autentificare la cardurile securizate: pentru Formare se cer numele complet, e-mailul și bifa de consimțământ GDPR + alegerea rolului (formabil A.2 / evaluator A.3); pentru Portal Inspectorate & Directori se cere parola dedicată. Verificarea parolei se face **server-side** (`/api/auth/check`), niciodată în browser; la succes se emite un token de sesiune semnat criptografic (HMAC) prin `/api/auth/session`.
- Secțiune „Despre noi", secțiune de caracteristici (GDPR, timp real, zero hârtii, AI integrat) și ghid de utilizare pe roluri.
- Link către politica de confidențialitate.

**Panou ascuns de administrare documente ARACIP** (deblocat cu parola de administrator): vezi punctul 7 — gestionează documentele naționale ARACIP și afișează un tablou de bord cu numărul de documente, documentele urgente, numărul de confirmări de citire și defalcarea confirmărilor pe tip de unitate.

---

## 4. Zona Calitate și Acreditare (`/acreditare`) — procese B2G

Pagina `/acreditare` este hub-ul proceselor ARACIP, cu subpaginile: autorizare, acreditare instituțională, evaluare externă periodică, tablou de bord, registre, legislație și întrebări frecvente. Toate sunt cu **acces public** (fără cont).

### 4.1. Autorizarea de funcționare provizorie — flux complet online

- **Depunere dosar** printr-un formular ghidat în mai mulți pași: date de identificare (denumire, CUI, județ, adresă, reprezentant legal, **e-mail și telefon**), tipul solicitantului (unitate nouă / unitate existentă care solicită un nivel nou), structura unității (nivel, profil, capacitate, număr de săli, suprafață), și **încărcarea documentelor anexe** (proiect de dezvoltare instituțională, ofertă educațională, acte privind spațiile, avize ISU și DSP, regulament intern).
- Documentele se încarcă printr-un endpoint public rate-limited (`/api/autorizare-upload`); tipuri acceptate: PDF, Word, Excel, imagini; limită 10 MB/fișier; stocare în spațiu **privat** (folderul `autorizare/`).
- La depunere (`/api/autorizare`), aplicația **generează automat numărul de înregistrare** (format `AUT-2026-XXXX`) și, dacă a fost furnizat e-mailul, transmite un **e-mail de confirmare** cu link către pagina de stadiu.
- Datele dosarului se persistă în tabela `cereri_autorizare`. Dacă baza de date nu este configurată, fluxul UI funcționează identic, generând numărul, fără persistență (degradare grațioasă).

### 4.2. Urmărirea stadiului fără cont

- Pagina publică de stadiu (`/acreditare/autorizare/stadiu`) permite verificarea unei cereri cu **numărul de înregistrare + adresa de e-mail** folosită la depunere.
- Endpoint-ul `/api/autorizare/status` este protejat **anti-enumerare**: nu confirmă existența unei cereri dacă adresa de e-mail nu se potrivește exact; este de asemenea rate-limited.
- Solicitantul vede parcursul (Depusă → În analiză → Autorizat / Respinsă, cu motiv). La aprobare, **descarcă Autorizația de Funcționare Provizorie în format PDF** direct din pagină.

### 4.3. Autorizația de Funcționare Provizorie (PDF)

Document A4 generat de aplicație, cu antet „Ministerul Educației / ARACIP", denumirea unității, CUI, județ, nivel, numărul de înregistrare, temeiul legal (H.G. nr. 994/2020 mod. 631/2022; H.G. nr. 993/2020), data emiterii și rubrică de semnătură (Ministrul Educației). Suportă complet diacriticele românești (font încorporat). Marcaj explicit că este model orientativ, documentul oficial fiind emis prin ordin al ministrului educației.

### 4.4. Acreditarea instituțională și evaluarea externă periodică

- Directorul unei unități autorizate depune solicitarea din portalul dedicat (`/api/evaluari`): tip (acreditare / evaluare periodică), denumire, CUI, județ, nivel, e-mail de contact și — la evaluarea periodică — calificativul.
- Se generează numărul de înregistrare (`ACR-2026-XXXX` / `EVP-2026-XXXX`) și un e-mail de confirmare; datele se persistă în tabela `cereri_evaluare`.
- La decizia ARACIP (acceptare/respingere motivată), solicitantul este notificat automat prin e-mail, iar la aprobare se pune la dispoziție documentul oficial generat de aplicație:
 - **Decizia de acreditare instituțională** (PDF) — pentru acreditare;
 - **Atestatul privind nivelul calității educației furnizate** (PDF) — pentru evaluarea periodică (cu rubrică de calificativ).

### 4.5. Depunerea autoevaluării (lanțul calității LIVE)

- Unitatea depune autoevaluarea (`/api/unitati`, tabela `unitati_calitate`) cu: denumire, județ, tip de unitate, localitate, status, **calificativ general**, **calificative pe cele 3 domenii (A/B/C)**, **calificative pe indicatori** și rezumat.
- Statusuri valide: autoevaluare depusă / în evaluare / acreditat / periodică. Calificative valide: Nesatisfăcător, Satisfăcător, Bine, Foarte bine, Excelent.
- Datele devin imediat disponibile, filtrate pe județ la nivelul ISJ și agregate la nivel național (pe județ, status, calificativ și pe domenii) în tabloul central.

### 4.6. Generatorul RAEI (Raportul Anual de Evaluare Internă)

Directorul generează RAEI din portal; datele se salvează în tabela `raei_generate` (denumire unitate, județ, localitate, nivel, an școlar, număr de elevi, detalii) și se agregă pentru tabloul central ARACIP și pentru ISJ (pe județ). Poziționat corect conform art. 234 din Legea nr. 198/2023 (întocmit de CEAC, transmis ARACIP + ISJ).

### 4.7. Legislație, registre, tablou de bord, FAQ

- **Legislație** (`/acreditare/legislatie`): listă de acte normative, fiecare cu tip, an, descriere, articolele-cheie și link oficial. Actele în vigoare sunt marcate cu badge „● ÎN VIGOARE" (Legea 198/2023, H.G. 993/2020, H.G. 994/2020, H.G. 631/2022, O.M.E. 6072/2023, Instrucțiunile ARACIP 1–3/2022), separate de actele istorice/abrogate (O.U.G. 75/2005, H.G. 21/2007, H.G. 22/2007 etc.).
- **Registre naționale** (`/acreditare/registre`): situația unităților (≈11.500 la nivel național).
- **Tablou de bord** (`/acreditare/dashboard`): situația acreditărilor.
- **FAQ** (`/acreditare/faq`): întrebări frecvente pe autorizare, acreditare, evaluare periodică, documente, termene și taxe.

---

## 5. Modulul Formare Profesională (A.2 / A.3)

Accesibil la `/formare`, după autentificare pe pagina `/aracip`. Trei module, filtrate pe rol (formabil A.2 → e-learning + simulare autoevaluare; evaluator A.3 → e-learning + simulare evaluare externă). Progresul se salvează local și, când baza de date e configurată, în cloud (`/api/formare-progress`, tabela `formare_progress`).

### 5.1. Programul E-Learning (`/formare/elearning`)

Șase cursuri structurate, fundamentate pe cadrul normativ real, fiecare cu lecții și test de verificare (quiz cu prag de promovare):

1. **Cadrul legal al asigurării calității în educație** — ARACIP, actele în vigoare, tipurile de standarde (autorizare / acreditare / referință) și logica cumulativă a descriptorilor, tipurile de evaluare externă, publicitatea și efectele evaluării.
2. **Standardele și cei 24 de indicatori de performanță** — domeniile și criteriile din art. 233, cei 24 de indicatori (I1–I24) grupați pe cele trei domenii, scala calificativelor cu praguri exacte (Nesatisfăcător → Excelent) și demonstrarea progresului elevilor.
3. **Evaluarea internă: CEAC și RAEI** — componența CEAC (art. 234), atribuțiile, structura RAEI în patru părți și autoevaluarea realistă bazată pe dovezi.
4. **Procesul de evaluare externă** — declanșarea și comisia de evaluare, analiza documentelor pre-vizită, vizita cu tehnica triangulării dovezilor, cele 5 întrebări fundamentale și structura raportului de evaluare externă.
5. **Platforma calitate.aracip.eu și gestionarea dovezilor** — categoriile reale de documente, corelarea dovezilor cu indicatorii (Instrucțiunile 1–3/2022), demonstrarea progresului.
6. **Îmbunătățirea continuă a calității și starea de bine** — planul de îmbunătățire (RAEI Partea a IV-a), revizuirea PDI/PAS (I17), starea de bine (I11, I12, întrebarea fundamentală nr. 4) și bucla internă a calității (formare + evaluarea personalului).

### 5.2. Simularea autoevaluării instituționale — A.2 (`/formare/simulare-autoevaluare`)

Replică completarea RAEI așa cum se face în platforma oficială: parcurgerea celor **24 de indicatori** grupați pe domenii și criterii, cu ghidul dovezilor pe fiecare indicator (din Instrucțiunea ARACIP nr. 3/2022), acordarea calificativelor pe scala reală (Nesatisfăcător → Excelent) și generarea unui raport de sinteză cu scor de pregătire. Rapoartele se salvează în tabela `autoevaluare_reports`.

### 5.3. Simularea evaluării externe periodice — A.3 (`/formare/simulare-evaluare-externa`)

Reproduce integral parcursul evaluatorului: (1) analiza documentelor pre-vizită, (2) vizita cu completarea grilei pe cei 24 de indicatori prin triangulare (calificativ autoevaluare vs. evaluare externă), (3) interviuri și asistențe, (4) redactarea raportului de evaluare externă cu cele 5 întrebări fundamentale și concluziile pe domenii. Indicatorii care se verifică exclusiv la vizită (I7, I11, I21, I22) sunt marcați ca atare. Rapoartele se salvează în tabela `evaluare_reports`.

### 5.4. Certificarea

La finalizarea programului, aplicația generează **automat** un certificat nominal PDF (A4 landscape, cu diacritice), care conține: numele participantului, activitatea parcursă (A.2 — formarea formabililor sau A.3 — formarea experților evaluatori externi), unitatea și județul (dacă au fost furnizate), data emiterii, un **cod unic de certificat** și referința la cadrul legal (H.G. nr. 994/2020 mod. 631/2022 + metodologia ARACIP). Participantul își descarcă propriul certificat; administratorul ARACIP poate genera și descărca certificatul oricărui participant care a finalizat.

### 5.5. Administrare și raportare formare (`/formare/admin`, `/api/formare-admin`)

Panou protejat cu parolă (și, opțional, 2FA/TOTP). Agregă per participant datele din `formare_progress`, `autoevaluare_reports` și `evaluare_reports`: nume, e-mail, unitate, județ, rol (formabil/evaluator), progres, module terminate, număr de simulări, ultima activitate. Afișează un sumar (total formabili, total evaluatori, medie progres, finalizați, cu rapoarte). Permite export (Excel/PDF) al situației formării, filtrat pe rol și pe județ.

---

## 6. Portaluri instituționale

### 6.1. Portalul directorului (`/demo/director`)

- Autentificare cu e-mail + parolă; se emite un token de sesiune HMAC.
- Vizualizarea documentelor și circularelor primite de la ISJ și ARACIP, cu **marcarea „citit"** (confirmarea de citire ajunge la ISJ/ARACIP — vezi punctul 7).
- **Asistentul ARA** proactiv pe termenele reale (semnalează cel mai urgent termen cu acțiunea concretă) — cu **răspuns vocal în limba română** (sinteză vocală care transformă cifrele și abrevierile în cuvinte rostite corect).
- **Calendarul termenelor** (componentă dedicată) și **lista de verificare a conformității** (checklist).
- **Generatorul RAEI** (`/demo/director/raei`).
- **Depunerea solicitărilor** de acreditare / evaluare periodică (`/demo/director/solicitari`) — cu confirmare pe e-mail și notificare la decizie.
- Directorul poate **transmite documente** către ISJ sau ARACIP cu autentificarea proprie (submisii `director-isj` / `director-aracip`, validate pe sesiune).

### 6.2. Portalul inspectoratului școlar județean (`/demo/isj`)

- Autentificare + **alegerea județului** la login.
- Monitorizare în timp real, filtrată pe județul ales: autoevaluări depuse, RAEI generate, cereri de autorizare.
- Încărcarea documentelor (circulare, proceduri, adrese) către directorii din județ, cu **număr de înregistrare generat automat** (format `ISJ-<COD_JUDET>-2026-NNNN`).
- Vizualizarea confirmărilor de citire ale directorilor și comunicarea cu aceștia.

### 6.3. Portalul inspectorului național ARACIP (`/demo/inspector`)

Tabloul central, cu situația la nivel național:
- Rezumatul în timp real al formării (via panoul de administrare formare integrat).
- Depunerile unităților agregate pe județe (autoevaluări, RAEI), cererile de autorizare și de acreditare/evaluare, situația pe toate cele 42 de județe (număr de școli, active, documente, alerte).
- **Deblocarea deciziilor** cu parola ARACIP → **Acceptă / Respinge** cereri (cu motiv la respingere), pentru autorizare și pentru acreditare/evaluare periodică.
- **Consultarea și descărcarea documentelor dosarului** depus (buton „Dosar"), prin proxy server-side securizat (documentele cu date personale rămân private — vezi punctul 12).
- La aprobare, **generarea documentului oficial în PDF** (Autorizație / Decizie de acreditare / Atestat). Solicitantul/directorul este notificat automat prin e-mail.
- Acces la **arhiva de documente oficiale** (upload/consultare — vezi punctul 9) și generarea numerelor de înregistrare naționale (format `INSP-NAT-2026-NNNN`).

---

## 7. Documente și comunicare instituțională (confirmări de citire)

Sistemul de documente (`/api/documents`, index în Vercel Blob privat) susține fluxul **Inspector național → ISJ → Director**:

- **Tipuri de document:** Circular, Procedură, Adresă, Metodologie, Ordin, Altele.
- **Surse:** ISJ, Inspector național, ARACIP și submisii ale directorului (`director-isj`, `director-aracip`).
- **Câmpuri:** titlu, tip, sursă, județ, termen, marcaj „urgent", conținut, destinatari, număr de înregistrare generat automat, PDF atașat (opțional).
- **Fișier atașat:** încărcat prin `/api/upload-pdf` cu extragere automată a textului (PDF prin `unpdf`, Word prin `mammoth`, text/CSV direct); textul extras poate pre-completa conținutul documentului, astfel încât asistentul ARA îl poate cita.
- **Confirmări de citire:** la marcarea „citit" (acțiune care necesită sesiune validă), se înregistrează cine a citit (nume, rol, tip de unitate, unitate) și când. Panoul de administrare ARACIP afișează pentru fiecare document numărul de vizualizări și lista „cine a văzut", plus un tablou de bord agregat (documente, urgente, confirmări totale, confirmări pe tip de unitate).
- **Termene active:** documentele cu termen sunt calculate automat (zile rămase), prioritizate și semnalate proactiv de asistentul ARA directorului (EXPIRAT / ASTĂZI / MÂINE / în N zile).
- **Descărcare:** documentele publicate se descarcă prin `/api/documents/[id]/download` (proxy server-side, cu nume de fișier corect, inclusiv diacritice).

---

## 8. Asistentul virtual ARA

Asistent conversațional (Groq, model `llama-3.3-70b-versatile`) disponibil în întreaga aplicație (`/api/acreditare-chat`, componenta `AraChatbot`). Caracteristici cheie:

- **Adaptare la pagină și rol.** ARA construiește un „profil al persoanei din față" în funcție de pagina curentă: vizitator nou pe portal, fondator (autorizare), director care pregătește acreditarea, director înainte de evaluarea periodică, inspector național, inspector ISJ, director (portal), diriginte, elev, profesor. Pe fiecare pagină anticipează întrebările tipice și oferă informația înainte de a fi cerută.
- **Patru surse de cunoaștere, combinate la fiecare răspuns:**
 1. **Promptul de bază** — identitatea ARA, misiunea ARACIP, structura completă a portalului, procesele (autorizare / acreditare / evaluare periodică), cadrul legal actual (24 de indicatori, H.G. 994/2020 mod. 631/2022, H.G. 993/2020), documentele frecvente, greșelile comune și un set amplu de întrebări frecvente cu răspunsuri.
 2. **Cunoștințele administrabile din `/admin/ara`** — documente ISJ, module ale platformei, anunțuri active și informații generale (editabile fără atingerea codului — vezi punctul 9).
 3. **Documentele reale publicate pe platformă + termenele active** — cele mai recente documente ISJ/ARACIP și termenele calculate, cu semnalarea proactivă a celui mai urgent.
 4. **Arhiva de documente oficiale (RAG)** — extrase din documentele oficiale încărcate în arhivă, citate cu referință la titlul documentului.
- **Regula politeții** (obligatorie): adresare cu „Dumneavoastră" pentru adulți (director, profesor, inspector, ISJ, diriginte); „tu" exclusiv pentru elevi; dacă se cunoaște numele, adresare nominală („Dl/Dna [Rol] [Nume]").
- **Context de pagină.** ARA primește ce vede efectiv utilizatorul (ex. numărul de documente necitite, filtrele active) și răspunde concret, fără a menționa mecanismul intern.
- **Voce.** Pe portalul director, ARA poate răspunde vocal (sinteză vocală în română, cu pronunțarea corectă a numerelor și abrevierilor).
- **Limitare pe tariful Groq gratuit.** Cererile sunt rate-limited (60/minut per IP); pentru cererile cu prompt personalizat există și o limită zilnică. Răspunsurile sunt limitate ca lungime (max_tokens 600) și temperatura este scăzută (0,4) pentru consistență. Contextul folosit (documente, arhivă) este plafonat în dimensiune pentru a rămâne în limitele modelului gratuit.

---

## 9. Arhiva de documente oficiale (RAG) și administrarea cunoștințelor ARA

### 9.1. Arhiva de documente oficiale (`/api/ara-archive`, componenta `AraArchive`)

- **Upload** (protejat cu parolă): titlu, descriere, județ/național; fișiere PDF / Word / text, max 10 MB.
- **Extragere automată de text** din PDF (`unpdf`), Word (`mammoth`) și text simplu; textul curățat (max 100.000 caractere) se stochează pentru a fi folosit de ARA.
- **Stocare:** principal în Supabase (tabela `ara_archive`, coloana `text_content`), cu fallback pe Vercel Blob privat.
- **Folosire ca RAG:** cele mai recente documente din arhivă sunt injectate în contextul asistentului ARA; când utilizatorul întreabă despre un subiect prezent în ele, ARA răspunde exclusiv pe baza conținutului lor, cu referință la titlu.
- Accesibilă din panoul `/admin/ara` (tab „Arhiva Documente") și din portalul inspectorului național.

### 9.2. Panoul de administrare a cunoștințelor ARA (`/admin/ara`, `/api/ara-knowledge`)

Panou parolat cu cinci tab-uri, prin care se actualizează ce știe ARA, **fără modificarea codului**:
- **Documente ISJ** — circulare/proceduri/adrese active (titlu, conținut, termen, marcaj urgent).
- **Module** — modulele disponibile pe platformă (titlu, URL, descriere) pe care ARA le recomandă.
- **Anunțuri** — anunțuri active pe care ARA le menționează proactiv.
- **General** — informații generale despre platformă, mereu cunoscute de ARA.
- **Arhiva Documente** — arhiva oficială (punctul 9.1).

Cunoștințele se salvează în Vercel Blob privat (`ara-knowledge.json`), cu cache de câteva minute; ARA le folosește imediat după salvare.

---

## 10. Registre, legislație, calendar, listă de verificare

- **Registre naționale** — situația unităților la nivel național.
- **Legislație** — actele normative cu marcarea celor în vigoare (punctul 4.7).
- **Calendarul termenelor** (componenta `CalendarTermene`) — pe portalul director și pe cel al inspectorului național.
- **Lista de verificare a conformității** (componenta `ChecklistConformitate`) — pe portalul director, pentru pregătirea documentelor.

---

## 11. Interfața de programare (API public v1)

API REST read-only, autentificat cu cheie API (header `x-api-key` sau `?api_key=`), documentat public la `/api-docs`. Nu expune date cu caracter personal — doar date instituționale și agregate.

**Resurse disponibile** (`/api/v1/{resource}`):

| Resursă | Conținut | Parametri |
|---------|----------|-----------|
| `unitati` | Unități care și-au depus autoevaluarea (calificative A/B/C) | `judet`, `limit` |
| `autorizari` | Cereri de autorizare de funcționare provizorie | `judet`, `limit` |
| `evaluari` | Cereri de acreditare și evaluare periodică | `judet`, `tip`, `limit` |
| `raei` | RAEI generate | `judet`, `limit` |
| `formare` | Statistici agregate de formare (formabili/evaluatori, finalizați, certificate) | — |

Rate-limited (120 cereri/minut per IP), limită de rezultate configurabilă (max 500). Răspuns JSON standardizat.

---

## 12. Protecția datelor și mecanisme de securitate

- **Găzduire în UE** — baza de date Supabase (Postgres, Irlanda).
- **Criptare în tranzit** — HTTPS/TLS (HSTS).
- **Row Level Security** pe tabele; scriere doar server-side cu cheia de serviciu (niciodată din browser).
- **Sesiuni semnate criptografic (HMAC-SHA256)** cu expirare (12 ore), verificate cu comparație în timp constant.
- **Documente cu date personale** — stocate în spațiu privat; descărcarea se face doar printr-un **proxy server-side** protejat cu parola ARACIP, cu **restricție anti-SSRF** (se acceptă doar URL-uri de blob din folderul propriu `autorizare/`), fără expunerea de legături directe.
- **Verificarea stadiului anti-enumerare** — nu confirmă o cerere fără potrivirea e-mailului.
- **2FA (TOTP)** opțional pentru conturile administrative (compatibil Google Authenticator), verificat server-side.
- **Rate limiting** pe toate endpoint-urile publice.
- **Parole și secrete** exclusiv în variabile de mediu.
- **Degradare grațioasă** — dacă lipsesc cheile (bază de date, e-mail, AI), platforma continuă să funcționeze fără a expune erori tehnice utilizatorului.

Detalii complete în documentele „Conformitate GDPR" și „Manuale și documentație tehnică".

---

## 13. Accesibilitate, voce și utilizare pe mobil

- Interfață adaptată dispozitivelor mobile (layout responsiv detectat prin hook dedicat).
- Asistentul ARA cu **răspuns vocal în română** pe portalul director.
- Bune practici de accesibilitate (contrast, navigare, reducerea animațiilor la preferința utilizatorului).

---

## 14. Notificări prin e-mail

Prin Resend (e-mail tranzacțional, domeniu verificat), cu șabloane HTML cu antetul ARACIP:
- confirmarea depunerii dosarului de autorizare (cu numărul de înregistrare + link de stadiu);
- confirmarea solicitării de acreditare / evaluare periodică;
- decizia ARACIP (aprobat / respins, cu motiv) pentru autorizare și pentru acreditare/evaluare.

Dacă serviciul de e-mail nu este configurat, funcțiile nu blochează fluxul (pagina de stadiu rămâne canalul principal).

---

## 15. Module opționale, separate de oferta ARACIP curentă

Codul mai conține un modul „EDU Digital" (pregătire pentru examene, formare a profesorilor, ora de dirigenție digitală) care este **ascuns** și constituie un **produs separat**, în afara ofertei ARACIP curente. Este menționat aici doar pentru completitudine; nu face parte din prezentul dosar.

---

*Document pregătit de NEWTIME CONCEPT SOLUTIONS S.R.L. Descrierea reflectă funcționalitatea reală a aplicației la data redactării.*
