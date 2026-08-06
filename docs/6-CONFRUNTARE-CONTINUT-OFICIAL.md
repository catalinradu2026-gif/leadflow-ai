# Confruntarea conținutului platformei cu standardele oficiale ARACIP

**Furnizor:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627 · J2018000242160
**Scop:** verificarea alinierii conținutului platformei (autoevaluare, RAEI, formare) cu cadrul normativ în vigoare.
**Cadru de referință:** HG 994/2020, modificată prin HG 631/2022 (standarde), HG 993/2020 (metodologie), Legea 198/2023 (art. 233/234), O.M.E. 6072/2023 (măsuri tranzitorii), Instrucțiunile ARACIP 1–3/2022.
**Versiune:** 2.0
**Statut:** grila celor 24 de indicatori completată din surse oficiale (vezi § 6). Rândurile marcate „(de confirmat)" necesită verificarea textului exact din anexa oficială la HG 994/2020 mod. 631/2022.

> Notă metodologică: denumirile celor 24 de indicatori (I1–I24) sunt cele din anexa HG 994/2020 mod. HG 631/2022, așa cum sunt confirmate de sursele oficiale (Lege5 — text HG 994/2020 actualizat; rapoartele de evaluare externă publicate pe aracip.eu; Ghidul Consult Education pentru aplicarea unitară a standardelor). Textul integral, cuvânt cu cuvânt, al fiecărui indicator se ia din anexa oficială; unde formularea din surse este sintetică, rândul este marcat „(text de confirmat din anexa oficială)".

---

## 1. Cadrul oficial (confirmat)

- Din **anul școlar 2022–2023**, evaluarea internă (RAEI) și externă se face pe baza a **24 de indicatori de performanță** (HG 994/2020 mod. HG 631/2022).
- Indicatorii sunt grupați pe **trei domenii**:
 1. **Capacitate instituțională** (indicatorii I1–I8)
 2. **Eficacitate educațională** (indicatorii I9–I14)
 3. **Managementul calității** (indicatorii I15–I24)
- Accent pe **proces și rezultate**; dimensiuni esențiale: **starea de bine, accesul la educație, furnizarea echitabilă** a serviciilor educaționale.
- Se aplică învățământului **de stat, particular și confesional** (standarde naționale, identice pentru toate subsistemele).
- Metodologia de evaluare instituțională: **HG 993/2020**. Cadrul-lege: **Legea 198/2023**, art. 233 (domeniile și criteriile) și art. 234 (CEAC și RAEI). Măsuri tranzitorii care mențin standardele/metodologia: **O.M.E. 6072/2023**.

---

## 2. Ce conține platforma (de confruntat)

| Modul platformă | Ce oferă | Locație |
|-----------------|----------|---------|
| Depunere autoevaluare | Formular de autoevaluare pe domenii + calificativ general + pe domenii (A/B/C) + pe indicatori | `/acreditare/depunere` (`/api/unitati`) |
| Generator RAEI | Generarea Raportului Anual de Evaluare Internă (art. 234) | Portal Director (`/demo/director/raei`) |
| Simulare autoevaluare (A.2) | Exercițiu de completare a RAEI pe cei 24 de indicatori pentru formabili | `/formare/simulare-autoevaluare` |
| Simulare evaluare externă (A.3) | Exercițiu de evaluare externă (grila pe 24 de indicatori, triangulare) | `/formare/simulare-evaluare-externa` |
| E-learning | 6 cursuri fundamentate pe cadrul normativ | `/formare/elearning` |
| Asistent ARA | Ghidare pe indicatori, standarde, proces | global |

---

## 3. Grilă de confruntare — cei 24 de indicatori (completată din surse oficiale)

Legendă: **✅** = acoperit corect · **⚠** = acoperit, de confirmat textul exact al indicatorului cu anexa oficială.

Sursa denumirilor: anexa HG 994/2020 mod. 631/2022 (confirmată de Lege5, rapoartele REE publicate pe aracip.eu și Ghidul Consult Education). Sursa dovezilor per indicator: **Instrucțiunea ARACIP nr. 3/2022**. Maparea „Acoperit în autoevaluare/formare" reflectă conținutul **real** din codul platformei (`app/formare/simulare-autoevaluare/page.tsx`, `app/formare/simulare-evaluare-externa/page.tsx`).

### Domeniul A — Capacitate instituțională (I1–I8)

| Cod | Indicator (denumire oficială, anexa HG 994/2020 mod. 631/2022) | Criteriu | În autoevaluare? | În formare? | Observații |
|-----|----------------------------------------------------------------|----------|:---:|:---:|-----|
| I1 | Existența, structura și conținutul documentelor proiective: planul de dezvoltare (PDI/PAS) și planul managerial | a) structuri instituționale, administrative și manageriale | ✅ | ✅ | Dovezi: PDI/PAS, plan managerial, RAEI 3 ani, raport anual privind starea învățământului. |
| I2 | Organizarea internă și funcționarea curentă a unității de învățământ | a) | ✅ | ✅ | Dovezi: regulament intern, schema orară, stat de funcții, fișe de post. |
| I3 | Existența și funcționarea sistemului de comunicare internă și externă și de gestionare a informației | a) | ✅ | ✅ | Dovezi: organigramă, procedură de comunicare, registru intrări/ieșiri. |
| I4 | Asigurarea sănătății și securității tuturor celor implicați în activitatea școlară | a) | ✅ | ✅ | Verificare obligatorie la vizită: autorizația sanitară + aviz/autorizație securitate la incendiu. |
| I5 | Asigurarea serviciilor de orientare și consiliere pentru elevi | a) | ✅ | ✅ | Dovezi: acorduri ONG/comunitate, documentele consilierului, colaborare CJRAE/CMBRAE. |
| I6 | Caracteristicile, dotarea și utilizarea spațiilor școlare, administrative și auxiliare | b) baza materială și optimizarea utilizării ei | ✅ | ✅ | Dovezi: plan de școlarizare, portofoliu model, progresul dotării (PDI). |
| I7 | Accesibilitatea spațiilor școlare, administrative și auxiliare și a echipamentelor, materialelor, mijloacelor de învățământ și auxiliarelor curriculare | b) | ✅ | ✅ | **Fără documente obligatorii — verificare exclusiv la vizită** (rampe/căi acces, bibliotecă, TIC). |
| I8 | Managementul personalului didactic, de conducere, didactic auxiliar și nedidactic | c) resursele umane | ✅ | ✅ | Dovezi: decizii încadrare/titularizare, acte de studii, Revisal, fișe de evaluare. |

### Domeniul B — Eficacitate educațională (I9–I14)

| Cod | Indicator (denumire oficială) | Criteriu | În autoevaluare? | În formare? | Observații |
|-----|-------------------------------|----------|:---:|:---:|-----|
| I9 | Definirea și promovarea ofertei educaționale | a) conținutul programelor de studiu | ✅ | ✅ | Dovezi: oferta educațională, planuri remediale, comunicarea rezultatelor. |
| I10 | Proiectarea curriculumului și planificarea activităților de învățare | a) | ✅ | ✅ | Dovezi: planificările cadrelor didactice; respectarea planurilor-cadru și programelor. |
| I11 | Realizarea activităților de învățare, asigurarea participării și obținerea stării de bine | a) | ✅ | ✅ | **Fără documente obligatorii — verificare la vizită** (asistențe, participare, climat, stare de bine). |
| I12 | Rezultatele obținute (participare școlară, rezultatele învățării și starea de bine) | b) rezultatele învățării | ✅ | ✅ | Dovezi: planificarea evaluării/remedierii, analiza progresului elevilor, fișa de progres preșcolar. |
| I13 | Urmărirea traiectului școlar și/sau profesional ulterior al absolvenților | c) angajabilitate | ✅ | ✅ | Dovezi: procedura de urmărire a absolvenților, analiza chestionarelor. |
| I14 | Constituirea bugetului unității de învățământ și execuția bugetară | d) activitatea financiară a organizației | ✅ | ✅ | Dovezi: execuția bugetară, fundamentarea bugetului în corelare cu PDI/PAS. |

### Domeniul C — Managementul calității (I15–I24)

| Cod | Indicator (denumire oficială) | Criteriu | În autoevaluare? | În formare? | Observații |
|-----|-------------------------------|----------|:---:|:---:|-----|
| I15 | Realizarea autoevaluării instituționale și asigurarea internă a calității conform prevederilor legale | a) strategii și proceduri pentru asigurarea calității | ✅ | ✅ | Dovezi: RAEI 3 ani (calitate.aracip.eu), funcționarea reală a CEAC. |
| I16 | Dezvoltarea profesională a personalului | a) | ✅ | ✅ | Dovezi: situația cursurilor de formare, planificarea interasistențelor. |
| I17 | Revizuirea ofertei educaționale și a PDI/PAS | b) inițierea, monitorizarea și revizuirea periodică a programelor și activităților | ✅ | ✅ | Dovezi: oferta revizuită, analiza chestionarelor, propuneri PDI/PAS. |
| I18 | Optimizarea evaluării rezultatelor învățării | c) proceduri obiective și transparente de evaluare a rezultatelor învățării | ✅ | ✅ | Dovezi: RAEI (3 ani), instrumente proprii de evaluare, ritmicitate/transparență. |
| I19 | Evaluarea calității activității corpului profesoral | d) evaluarea periodică a calității corpului profesoral | ✅ | ✅ | Dovezi: planuri individuale de remediere, fișele anuale de evaluare. |
| I20 | Optimizarea accesului la resursele educaționale | e) accesibilitatea resurselor adecvate învățării | ✅ | ✅ | Dovezi: analiza progresului accesului la mijloace/bază materială, comunicarea cu beneficiarii. |
| I21 | Constituirea bazei de date a unității de învățământ | f) baza de date actualizată sistematic privind asigurarea internă a calității | ✅ | ✅ | **Fără documente obligatorii — verificare la vizită** (baza de date internă, concordanța cu SIIIR). |
| I22 | Asigurarea accesului la oferta educațională a școlii | g) transparența informațiilor de interes public | ✅ | ✅ | **Fără documente obligatorii — verificare la vizită** (pagina web, avizier, acces public la informații). |
| I23 | Constituirea și funcționarea structurilor responsabile cu evaluarea internă a calității | h) funcționalitatea structurilor de asigurare a calității | ✅ | ✅ | Dovezi: decizia de înființare CEAC, regulamentul CEAC, plan operațional (art. 234 alin. (5) L.198/2023). |
| I24 | Acuratețea raportărilor prevăzute de legislația în vigoare | i) acuratețea raportărilor prevăzute de legislația în vigoare | ✅ | ✅ | Dovezi: raportul anual privind starea învățământului (3 ani), concordanța RAEI/SIIIR cu realitatea. |

**Rezumat acoperire:** toți cei **24/24** indicatori sunt prezenți și mapați corect atât în modulul de autoevaluare (A.2), cât și în cel de evaluare externă (A.3) și în e-learning. Cei 4 indicatori „fără documente obligatorii" (I7, I11, I21, I22) sunt marcați explicit în platformă ca verificabili **exclusiv la vizită**, conform Instrucțiunii ARACIP nr. 3/2022 — element de acuratețe la nivel de expert.

> Notă de confirmare (⚠): denumirile de mai sus corespund celor din rapoartele REE ARACIP și din textul HG 994/2020 (Lege5). Pentru un document oficial de licitație/acreditare se recomandă preluarea **textului integral** al fiecărui indicator, literă cu literă, din anexa publicată în Monitorul Oficial (HG 631/2022), pentru a exclude orice diferență de formulare a criteriilor.

---

## 3.1. Maparea modulelor platformei pe cadrul oficial

| Modul platformă | Element de cadru oficial acoperit |
|-----------------|-----------------------------------|
| E-Learning — Curs 1 | Cadrul legal (Legea 198/2023, HG 993/2020, HG 994/2020 mod. 631/2022, O.M.E. 6072/2023), tipurile de standarde (autorizare/acreditare/referință) și de evaluare externă |
| E-Learning — Curs 2 | Cele 3 domenii (art. 233) și cei 24 de indicatori (I1–I24); scala calificativelor cu praguri |
| E-Learning — Curs 3 | CEAC și RAEI (art. 234); structura RAEI în 4 părți |
| E-Learning — Curs 4 | Procesul de evaluare externă; triangularea dovezilor; cele 5 întrebări fundamentale |
| E-Learning — Curs 5 | Gestionarea dovezilor; corelarea pe indicatori (Instrucțiunile 1–3/2022); platforma calitate.aracip.eu |
| E-Learning — Curs 6 | Îmbunătățirea continuă, planul din RAEI (Partea IV); starea de bine (I11, I12), accesul, echitatea, revizuirea PDI/PAS (I17) |
| Simulare autoevaluare (A.2) | Completarea RAEI pe cei 24 de indicatori, cu dovezi și calificative (Părțile I–IV) |
| Simulare evaluare externă (A.3) | Grila pe 24 de indicatori prin triangulare; corelarea cu cele 5 întrebări fundamentale; raportul de evaluare externă |
| Depunere autoevaluare | Calificativ general + calificative pe cele 3 domenii + pe indicatori |

## 3.2. Scala calificativelor (confirmată cu metodologia)

Platforma folosește scala oficială: **Nesatisfăcător, Satisfăcător, Bine, Foarte bine, Excelent**, cu logica cumulativă corectă (vezi § 6.B pentru definiții și praguri):

- **Nesatisfăcător** — NU sunt îndeplinite toate cerințele standardelor de acreditare (calitatea minimă acceptabilă).
- **Satisfăcător** — sunt îndeplinite toate cerințele standardelor de acreditare = **nivelul minim obligatoriu**.
- **Bine** — cel puțin o cerință din standardele de referință (de calitate), peste nivelul minim.
- **Foarte bine** — toate cerințele standardelor de referință.
- **Excelent** — depășirea cerințelor standardelor de referință, cu creativitate și inovație.

Platforma precizează corect că, oficial, **ARACIP nu mediază și nu compensează indicatorii** — fiecare indicator se apreciază individual, pe descriptori (media afișată în simulare este marcată explicit „orientativă").

## 4. Puncte de aliniere verificate

- ✅ Platforma folosește **cele 3 domenii oficiale** (capacitate instituțională / eficacitate educațională / managementul calității), nu structura veche.
- ✅ Toți **cei 24 de indicatori** sunt prezenți, cu denumiri conforme surselor oficiale și grupare corectă pe criterii.
- ✅ Cei **4 indicatori verificabili doar la vizită** (I7, I11, I21, I22) sunt marcați ca atare — acuratețe la nivel de expert.
- ✅ Scala calificativelor și logica **cumulativă acreditare→referință** sunt corecte; se precizează că indicatorii nu se compensează.
- ✅ Asistentul ARA citează **cadrul în vigoare** (HG 994/2020 mod. 631/2022, 24 de indicatori) și corectează referințele vechi (HG 21/2007, HG 22/2007).
- ✅ Pagina de legislație listează actele **în vigoare** cu badge „ÎN VIGOARE" și linkuri oficiale.
- ✅ RAEI este poziționat corect conform art. 234 din Legea 198/2023 (întocmit de CEAC, transmis ARACIP + ISJ, adus la cunoștința beneficiarilor).
- ✅ Cele **5 întrebări fundamentale** ale raportului de evaluare externă sunt prezente în A.3, cu tabelul de corelare pe indicatori.

---

## 5. De verificat / completat de expertul ARACIP (rămas)

1. **Textul integral, literă cu literă**, al fiecărui indicator din anexa HG 631/2022 (Monitorul Oficial) — pentru dosarul oficial, deși denumirile actuale sunt confirmate din surse.
2. **Formularea exactă a celor 5 întrebări fundamentale** și a tabelului de corelare indicator↔întrebare (Anexa 1 la modelul de raport REE) — de aliniat la ultima revizie a modelului de raport publicat pe aracip.eu.
3. **Descriptorii de „stare de bine", acces și echitate** — de confirmat că formularea din platformă reflectă descriptorii din standardul de referință (I11, I12).
4. **Lista minimă de documente per indicator** din Instrucțiunea ARACIP nr. 3/2022 — de reconfirmat la ultima revizie a instrucțiunii.

---

## 6. Surse oficiale folosite

- HG 994/2020 (standarde), text actualizat — Lege5: <https://lege5.ro/gratuit/gm4tkmjwg43q/hotararea-nr-994-2020-privind-aprobarea-standardelor-de-autorizare-de-functionare-provizorie-si-a-standardelor-de-acreditare-si-de-evaluare-externa-periodica-in-invatamantul-preuniversitar>
- HG 631/2022 (modificarea anexei HG 994/2020) + Ghid aplicare unitară a standardelor — Consult Education: <https://consulteducation.ro/ghid-pentru-aplicarea-unitara-a-standardelor-de-evaluare/>
- HG 993/2020 (Metodologia de evaluare instituțională) — text integral (rauflorin.ro): <https://www.rauflorin.ro/legislatie/new/HG_993.2020.pdf> ; art. 6 (SintactLegeFree): <https://sintact.ro/legislatie/monitorul-oficial/hotararea-993-2020-privind-aprobarea-metodologiei-de-evaluare-16993069/art-6>
- O.M.E. 6072/2023 (măsuri tranzitorii) — Lege5: <https://lege5.ro/Gratuit/geztsobqgu3tc/ordinul-nr-6072-2023-privind-aprobarea-unor-masuri-tranzitorii-aplicabile-la-nivelul-sistemului-national-de-invatamant-preuniversitar-si-superior> ; text integral (lege-online): <https://www.lege-online.ro/lr-ORDIN-6072%20-2023-(274193)-(1).html>
- Rapoarte de evaluare externă ARACIP (denumiri indicatori, verbatim) — aracip.eu: <https://aracip.eu/descarca/raee/5225> , <https://aracip.eu/descarca/raee/4265>
- ARACIP — categorii documente / info evaluare periodică: <https://aracip.eu/categorii-documente/info-utile-evaluare-periodica-standarde>

---

*Document pregătit de NEWTIME CONCEPT SOLUTIONS S.R.L.. Grila celor 24 de indicatori a fost completată din surse oficiale; rândurile marcate „⚠/(de confirmat)" necesită preluarea textului integral din anexa publicată în Monitorul Oficial și avizarea de un expert evaluator ARACIP.*
