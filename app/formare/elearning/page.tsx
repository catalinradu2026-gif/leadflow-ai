'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { pushElearningProgress } from '@/lib/formareClient'

/**
 * MODUL 1 — E-Learning. Curriculum fundamentat pe cadrul normativ REAL, în vigoare:
 *  - Legea învățământului preuniversitar nr. 198/2023, cu modificările ulterioare —
 *    Titlul IV „Asigurarea calității" (domeniile și criteriile — art. 233; CEAC și
 *    raportul anual de evaluare internă — art. 234); a abrogat O.U.G. nr. 75/2005;
 *  - O.M.E. nr. 6.072/2023 — măsuri tranzitorii: până la elaborarea noilor metodologii
 *    de aplicare a Legii nr. 198/2023, se aplică reglementările în vigoare la 1 septembrie
 *    2023 (inclusiv metodologia și standardele de mai jos);
 *  - H.G. nr. 993/2020 — Metodologia de evaluare instituțională în vederea autorizării,
 *    acreditării și evaluării periodice a organizațiilor furnizoare de educație;
 *  - H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022 — standardele și cei 24 de
 *    indicatori de performanță (aplicabili din anul școlar 2022–2023);
 *  - Instrucțiunile ARACIP nr. 1–3/2022 — documentele din platforma calitate.aracip.eu.
 */

const CURSURI = [
  {
    id: 'c1',
    nr: '01',
    titlu: 'Cadrul legal al asigurării calității în educație',
    desc: 'ARACIP, actele normative în vigoare (O.U.G. nr. 75/2005, H.G. nr. 993/2020, H.G. nr. 994/2020), tipurile de evaluare externă și efectele lor.',
    durata: '45 min',
    lectii: 5,
    dificultate: 'Începător',
    culoare: '#3b82f6',
    lectiiContinut: [
      { titlu: 'Ce este ARACIP', continut: 'ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar — este instituția publică de interes național, în coordonarea Ministerului Educației, înființată inițial prin O.U.G. nr. 75/2005 privind asigurarea calității educației (aprobată cu modificări prin Legea nr. 87/2006). ARACIP realizează evaluarea externă a calității educației oferite de unitățile de învățământ preuniversitar: autorizarea de funcționare provizorie, acreditarea și evaluarea externă periodică. Legea învățământului preuniversitar nr. 198/2023 (în vigoare de la 3 septembrie 2023) a abrogat O.U.G. nr. 75/2005 și prevede reorganizarea agenției în ARACIIP (Agenția Română pentru Asigurarea Calității și Inspecție în Învățământul Preuniversitar), care preia și inspecția școlară. Până la finalizarea tranziției (amânată până la anul școlar 2026–2027), activitatea continuă sub denumirea ARACIP, în baza măsurilor tranzitorii aprobate prin O.M.E. nr. 6.072/2023 — care mențin în aplicare metodologia și standardele existente.' },
      { titlu: 'Actele normative în vigoare', continut: 'Cadrul normativ al evaluării: (1) Legea învățământului preuniversitar nr. 198/2023, cu modificările ulterioare — legea-cadru actuală, al cărei Titlu IV „Asigurarea calității" reglementează domeniile, indicatorii, CEAC și evaluarea externă (a abrogat O.U.G. nr. 75/2005, aprobată prin Legea nr. 87/2006, fostul act-cadru); (2) O.M.E. nr. 6.072/2023 — măsuri tranzitorii care mențin în aplicare metodologia și standardele de mai jos până la elaborarea noilor acte de aplicare a Legii nr. 198/2023; (3) H.G. nr. 993/2020 — Metodologia de evaluare instituțională în vederea autorizării, acreditării și evaluării periodice a organizațiilor furnizoare de educație; (4) H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022 — standardele de autorizare de funcționare provizorie, standardele de acreditare și de evaluare externă periodică, cu cei 24 de indicatori de performanță, aplicabile evaluării interne și externe începând cu anul școlar 2022–2023; (5) Instrucțiunile ARACIP nr. 1–3/2022 privind documentele postate în platforma calitate.aracip.eu.' },
      { titlu: 'Concepte-cheie: standarde, descriptori și logica cumulativă', continut: 'Legea definește trei tipuri de standarde: standardul de AUTORIZARE de funcționare provizorie (cerințele minime pentru înființarea unei unități noi), standardul de ACREDITARE (nivelul minim obligatoriu de calitate) și standardul de REFERINȚĂ (nivelul optimal, „de calitate"). Element esențial, adesea greșit înțeles: în anexa la H.G. nr. 994/2020 cerințele celor trei niveluri sunt CUMULATIVE — standardul de acreditare presupune îndeplinirea integrală a celui de autorizare, iar standardul de referință presupune îndeplinirea integrală a celui de acreditare. Fiecare indicator este descris prin DESCRIPTORI (cerințe concrete, verificabile) grupați pe cele trei niveluri; evaluatorul nu apreciază „impresia generală", ci bifează descriptor cu descriptor. Indicatorul de performanță este instrumentul de măsurare a gradului de realizare a unei activități, prin raportare la standarde, respectiv la standarde de referință. Calificativele „Bine", „Foarte bine" și „Excelent" se acordă exclusiv în funcție de câți descriptori din standardul de referință sunt îndepliniți suplimentar față de acreditare — nu se pot „compensa" între indicatori.' },
      { titlu: 'Tipurile de evaluare externă', continut: 'ARACIP realizează trei tipuri de evaluare externă: (1) AUTORIZAREA de funcționare provizorie — acordă dreptul de a funcționa și de a organiza admiterea; (2) ACREDITAREA — parcursă după autorizare, acordă unității toate drepturile, inclusiv organizarea examenelor și emiterea actelor de studii; la evaluarea în vederea acreditării, fiecare dintre cei 24 de indicatori se apreciază prin „Respectă standardele: DA/NU"; (3) EVALUAREA EXTERNĂ PERIODICĂ — realizată la interval de 5 ani pentru unitățile acreditate; se finalizează cu atestatul privind nivelul calității educației furnizate, indicatorii primind calificative de la „Nesatisfăcător" la „Excelent".' },
      { titlu: 'Publicitatea și efectele evaluării', continut: 'Raportul de evaluare externă se face public în conformitate cu prevederile art. 12 alin. (8) din H.G. nr. 993/2020 — rapoartele pot fi consultate pe site-ul aracip.eu. Autorizarea și acreditarea se acordă prin ordin al ministrului educației, la propunerea ARACIP. Responsabilitatea pentru calitatea educației furnizate revine conducătorului organizației furnizoare de educație, iar evaluarea internă este realizată de Comisia pentru Evaluarea și Asigurarea Calității (CEAC), reglementată de art. 234 din Legea nr. 198/2023.' },
    ],
    quiz: [
      { intrebare: 'Prin ce act normativ a fost înființată ARACIP?', variante: ['Legea educației naționale nr. 1/2011', 'O.U.G. nr. 75/2005, aprobată cu modificări prin Legea nr. 87/2006', 'H.G. nr. 994/2020', 'Legea nr. 198/2023'], corecta: 1 },
      { intrebare: 'Ce hotărâre de Guvern aprobă Metodologia de evaluare instituțională?', variante: ['H.G. nr. 994/2020', 'H.G. nr. 631/2022', 'H.G. nr. 993/2020', 'H.G. nr. 1258/2005'], corecta: 2 },
      { intrebare: 'La ce interval se realizează evaluarea externă periodică a unităților acreditate?', variante: ['La 3 ani', 'La 5 ani', 'La 10 ani', 'Anual'], corecta: 1 },
      { intrebare: 'Cum se apreciază fiecare indicator la evaluarea în vederea ACREDITĂRII?', variante: ['Cu note de la 1 la 10', 'Respectă standardele: DA/NU', 'Cu punctaje de la 1 la 100', 'Exclusiv descriptiv, fără apreciere'], corecta: 1 },
    ],
  },
  {
    id: 'c2',
    nr: '02',
    titlu: 'Standardele și cei 24 de indicatori de performanță',
    desc: 'Domeniile și criteriile din art. 233 al Legii nr. 198/2023, cei 24 de indicatori din H.G. nr. 994/2020 (modificată prin H.G. nr. 631/2022) și scala calificativelor.',
    durata: '60 min',
    lectii: 6,
    dificultate: 'Intermediar',
    culoare: '#a855f7',
    lectiiContinut: [
      { titlu: 'Domeniile și criteriile legale', continut: 'Domeniile și criteriile asigurării calității — operaționalizate în anexa la H.G. nr. 994/2020, în aplicarea art. 233 din Legea nr. 198/2023 (structură preluată din fostul act-cadru O.U.G. nr. 75/2005) — se referă la trei domenii: A. CAPACITATEA INSTITUȚIONALĂ — criteriile: a) structurile instituționale, administrative și manageriale; b) baza materială și optimizarea utilizării bazei materiale; c) resursele umane; B. EFICACITATEA EDUCAȚIONALĂ — criteriile: a) conținutul programelor de studiu; b) rezultatele învățării; c) angajabilitate; d) activitatea financiară a organizației; C. MANAGEMENTUL CALITĂȚII — nouă criterii, de la a) strategii și proceduri pentru asigurarea calității, până la i) acuratețea raportărilor prevăzute de legislația în vigoare. Standardele din H.G. nr. 994/2020 (modificată prin H.G. nr. 631/2022) detaliază aceste domenii și criterii în 24 de indicatori de performanță.' },
      { titlu: 'Domeniul A: Capacitatea instituțională (I1–I8)', continut: 'Indicatorii domeniului A: I1 — Existența, structura și conținutul documentelor proiective: planul de dezvoltare și planul managerial; I2 — Organizarea internă și funcționarea curentă a unității de învățământ; I3 — Existența și funcționarea sistemului de comunicare internă și externă și de gestionare a informației; I4 — Asigurarea sănătății și securității tuturor celor implicați în activitatea școlară; I5 — Asigurarea serviciilor de orientare și consiliere pentru elevi; I6 — Caracteristicile, dotarea și utilizarea spațiilor școlare, administrative și auxiliare; I7 — Accesibilitatea spațiilor școlare, administrative și auxiliare și a echipamentelor, materialelor, mijloacelor de învățământ și auxiliarelor curriculare; I8 — Managementul personalului didactic, de conducere, didactic auxiliar și nedidactic.' },
      { titlu: 'Domeniul B: Eficacitate educațională (I9–I14)', continut: 'Indicatorii domeniului B: I9 — Definirea și promovarea ofertei educaționale; I10 — Proiectarea curriculumului și planificarea activităților de învățare; I11 — Realizarea activităților de învățare, asigurarea participării și obținerea stării de bine; I12 — Rezultatele obținute (participare școlară, rezultatele învățării și starea de bine); I13 — Urmărirea traiectului școlar și/sau profesional ulterior al absolvenților; I14 — Constituirea bugetului unității de învățământ și execuția bugetară. Noutatea standardelor din 2022 este integrarea explicită a STĂRII DE BINE a participanților la educație în indicatorii I11 și I12.' },
      { titlu: 'Domeniul C: Managementul calității (I15–I24)', continut: 'Indicatorii domeniului C: I15 — Realizarea autoevaluării instituționale și asigurarea internă a calității conform prevederilor legale; I16 — Dezvoltarea profesională a personalului; I17 — Revizuirea ofertei educaționale și a PDI/PAS; I18 — Optimizarea evaluării rezultatelor învățării; I19 — Evaluarea calității activității corpului profesoral; I20 — Optimizarea accesului la resursele educaționale; I21 — Constituirea bazei de date a unității de învățământ; I22 — Asigurarea accesului la oferta educațională a școlii; I23 — Constituirea și funcționarea structurilor responsabile cu evaluarea internă a calității; I24 — Acuratețea raportărilor prevăzute de legislația în vigoare.' },
      { titlu: 'Calificativele: praguri exacte, de la „Nesatisfăcător" la „Excelent"', continut: 'La evaluarea internă (RAEI) și la evaluarea externă periodică, nivelul de realizare al fiecărui indicator se exprimă printr-un calificativ, cu praguri definite prin descriptori: NESATISFĂCĂTOR — NU sunt îndeplinite toate cerințele (descriptorii) standardelor de acreditare; chiar și un singur descriptor de acreditare neîndeplinit coboară indicatorul sub nivelul minim acceptabil. SATISFĂCĂTOR — sunt îndeplinite TOATE cerințele standardelor de acreditare, dar niciuna din standardele de referință (nivelul minim obligatoriu). BINE — peste acreditare, este îndeplinită suplimentar cel puțin o cerință din standardele de referință. FOARTE BINE — sunt îndeplinite TOATE cerințele standardelor de referință. EXCELENT — unitatea depășește cerințele standardelor de referință, dovedind creativitate și inovație (bune practici transferabile, cu impact demonstrat). Consecință procedurală: la ACREDITARE nu se acordă calificative pe scală, ci se stabilește „Respectă standardele: DA/NU" pentru fiecare indicator — un singur „NU" la standardul de acreditare blochează acreditarea. Scala Nesatisfăcător–Excelent se aplică la evaluarea internă (RAEI) și la evaluarea externă PERIODICĂ.' },
      { titlu: 'Demonstrarea progresului elevilor', continut: 'Anexa Instrucțiunii ARACIP nr. 3/2022 stabilește modul real de demonstrare a progresului, pe un exemplu de clasă/formațiune: la grădiniță — fișele de progres; la primar — progresul constatat între evaluarea de la clasa a II-a și cea de la clasa a IV-a; la gimnaziu — între evaluarea de la clasa a IV-a și cea de la clasa a V-a, respectiv între evaluarea de la clasa a VI-a și rezultatele Evaluării Naționale; la liceul teoretic și vocațional — între media de admitere și media de la bacalaureat; la liceul tehnologic — se adaugă procentul de promovare a examenului de certificare a competențelor profesionale; la postliceal — procentul de promovare a examenului de certificare.' },
    ],
    quiz: [
      { intrebare: 'Câți indicatori de performanță conțin standardele în vigoare (H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022)?', variante: ['20', '24', '43', '30'], corecta: 1 },
      { intrebare: 'Indicatorul I11 se referă la:', variante: ['Execuția bugetară', 'Realizarea activităților de învățare, asigurarea participării și obținerea stării de bine', 'Constituirea bazei de date a unității', 'Definirea ofertei educaționale'], corecta: 1 },
      { intrebare: 'Care este nivelul minim obligatoriu de calitate (standardele de acreditare)?', variante: ['Bine', 'Foarte bine', 'Satisfăcător', 'Excelent'], corecta: 2 },
      { intrebare: 'Calificativul „Excelent" înseamnă:', variante: ['Îndeplinirea cerințelor standardelor de acreditare', 'Depășirea cerințelor standardelor de referință, cu creativitate și inovație', 'Îndeplinirea unei singure cerințe din standardele de referință', 'Media calificativelor din anii anteriori'], corecta: 1 },
    ],
  },
  {
    id: 'c3',
    nr: '03',
    titlu: 'Evaluarea internă: CEAC și RAEI',
    desc: 'Comisia pentru Evaluarea și Asigurarea Calității (art. 234 din Legea nr. 198/2023) și Raportul Anual de Evaluare Internă în platforma calitate.aracip.eu.',
    durata: '50 min',
    lectii: 5,
    dificultate: 'Intermediar',
    culoare: '#14b8a6',
    lectiiContinut: [
      { titlu: 'CEAC — baza legală și componența', continut: 'La nivelul fiecărei unități de învățământ preuniversitar funcționează Comisia pentru Evaluarea și Asigurarea Calității (CEAC) — art. 234 din Legea nr. 198/2023 (fostul art. 11–12 din O.U.G. nr. 75/2005, abrogată). Conform art. 234 alin. (5), componența cuprinde: a) 1–3 reprezentanți ai corpului profesoral, aleși prin vot secret de consiliul profesoral; b) un reprezentant al sindicatului reprezentativ, desemnat de acesta; c) un reprezentant al părinților (la învățământul preșcolar, primar, gimnazial sau liceal); d) un reprezentant al elevilor (la învățământul liceal și postliceal); e) un reprezentant al consiliului local; f) un reprezentant al minorităților naționale, după caz — din rândul cadrelor didactice, al părinților sau al elevilor. Potrivit art. 234 alin. (1), directorul și consiliul de administrație sunt direct responsabili de calitatea educației furnizate; conform alin. (4), conducerea operativă a comisiei este asigurată de conducătorul organizației sau de un coordonator desemnat de acesta, iar regulamentul de organizare și funcționare și strategia CEAC se elaborează și se aprobă de consiliul de administrație, după consultarea consiliului profesoral, a consiliului elevilor și a structurilor asociative ale părinților (alin. (3)).' },
      { titlu: 'Atribuțiile CEAC', continut: 'Conform art. 234 alin. (7) din Legea nr. 198/2023, CEAC: a) coordonează aplicarea procedurilor și activităților de evaluare și asigurare a calității, aprobate de conducerea unității, pe domeniile și criteriile prevăzute la art. 233; b) elaborează ANUAL un raport de evaluare internă (RAEI) privind calitatea educației, adus la cunoștința tuturor beneficiarilor prin afișare sau publicare; c) formulează propuneri de îmbunătățire a calității educației. RAEI se depune la ARACIIP odată cu cererea de declanșare a evaluării externe. Dovezile funcționării reale a CEAC — decizia de înființare, regulamentul de funcționare și planul operațional/managerial al CEAC — sunt documente obligatorii pentru indicatorul I23. Greșeală tipică la vizită: comisie constituită doar „pe hârtie", fără procese-verbale de ședință, fără proceduri aplicate și fără urme ale monitorizării planului de îmbunătățire — situație care atrage calificativ „Nesatisfăcător" la I23, chiar dacă decizia de înființare există.' },
      { titlu: 'RAEI în platforma calitate.aracip.eu', continut: 'Raportul Anual de Evaluare Internă (RAEI) se inițializează, se completează și se finalizează în fiecare an școlar în aplicația https://calitate.aracip.eu. Structura RAEI cuprinde patru părți: PARTEA I — Informații generale (datele de identificare a unității și indicatorii de structură și context: mediul de rezidență, niveluri de învățământ, efective, buget); PARTEA a II-a — Descrierea activităților de îmbunătățire a calității realizate în anul școlar analizat; PARTEA a III-a — Nivelul de realizare a indicatorilor de performanță, conform standardelor; PARTEA a IV-a — Planul de îmbunătățire a calității educației pentru anul școlar următor.' },
      { titlu: 'Autoevaluarea pe indicatori — realistă și bazată pe dovezi', continut: 'În Partea a III-a a RAEI, unitatea acordă fiecăruia dintre cei 24 de indicatori un calificativ de la „Nesatisfăcător" la „Excelent" — aceeași scală folosită și de evaluatorii externi. Raportul de evaluare externă periodică prezintă, pentru fiecare indicator, ambele calificative în paralel: cel de AUTOEVALUARE (din RAEI) și cel constatat la EVALUAREA EXTERNĂ. Dovadă BUNĂ vs. dovadă SLABĂ: pentru I19 (evaluarea corpului profesoral), o dovadă slabă = „fișe de evaluare completate formal, cu punctaj maxim la toți"; o dovadă bună = fișe individuale care identifică puncte slabe concrete (ex. „strategii de evaluare la clasă"), corelate cu un plan individual de remediere și cu interasistențe ulterioare care confirmă corectarea. Greșeală tipică: unitatea își acordă „Foarte bine"/„Excelent" fără a putea proba niciun descriptor din standardul de REFERINȚĂ — supraevaluare pe care comisia o corectează la vizită. Diferențele mari și sistematice între autoevaluare și constatări indică o cultură a calității deficitară (autoevaluare necalibrată), ceea ce afectează direct indicatorul I15.' },
      { titlu: 'Dovezile pe fiecare indicator', continut: 'Instrucțiunile ARACIP nr. 1–3/2022 stabilesc documentele corelate pe fiecare indicator, postate în platformă (max. 30 MB/document). Exemple reale: I1 — PDI/PAS, planul managerial, RAEI pe ultimii 3 ani, raportul anual privind starea și calitatea învățământului; I8 — deciziile de titularizare, actele de studii ale cadrelor didactice, extrasul Revisal, fișele de evaluare; I23 — decizia de înființare, regulamentul și planul managerial CEAC. Pentru indicatorii I7, I11, I21 și I22 nu se cere niciun document — îndeplinirea lor se demonstrează direct, la vizita de evaluare (accesibilitatea spațiilor, activitățile de la clasă, baza de date, accesul la oferta educațională).' },
    ],
    quiz: [
      { intrebare: 'Cine elaborează anual raportul de evaluare internă (RAEI)?', variante: ['Directorul, individual', 'CEAC — Comisia pentru Evaluarea și Asigurarea Calității', 'Inspectoratul școlar', 'ARACIP'], corecta: 1 },
      { intrebare: 'Reprezentanții corpului profesoral în CEAC sunt aleși:', variante: ['De către director', 'Prin vot secret de consiliul profesoral', 'De consiliul de administrație', 'De reprezentanții părinților'], corecta: 1 },
      { intrebare: 'Partea a IV-a a RAEI conține:', variante: ['Datele de identificare a unității', 'Planul de îmbunătățire a calității pentru anul școlar următor', 'Execuția bugetară', 'Nivelul de realizare a indicatorilor'], corecta: 1 },
      { intrebare: 'RAEI se completează și se finalizează în:', variante: ['SIIIR', 'Platforma calitate.aracip.eu', 'EduSAL', 'Revisal'], corecta: 1 },
    ],
  },
  {
    id: 'c4',
    nr: '04',
    titlu: 'Procesul de evaluare externă',
    desc: 'Etapele reale conform H.G. nr. 993/2020: comisia de evaluare, analiza documentelor, vizita, cele 5 întrebări fundamentale și raportul de evaluare externă.',
    durata: '55 min',
    lectii: 5,
    dificultate: 'Avansat',
    culoare: '#f59e0b',
    lectiiContinut: [
      { titlu: 'Declanșarea evaluării și comisia', continut: 'Evaluarea externă se declanșează pe baza cererii depuse de unitate în platforma calitate.aracip.eu, conform calendarului anual publicat de ARACIP. Comisia de evaluare este desemnată prin hotărâre de evaluare ARACIP și este formată dintr-un coordonator și membri — experți înscriși în Registrul ARACIP al experților în evaluare și acreditare. La vizită participă, ca observatori, un inspector școlar desemnat de ISJ/ISMB și, după caz, un observator desemnat de federațiile naționale ale părinților. Raportul redactat de coordonator este validat de un expert ARACIP.' },
      { titlu: 'Analiza documentelor (pre-vizită)', continut: 'Înaintea vizitei, comisia analizează documentele postate de unitate în platforma calitate.aracip.eu, conform Instrucțiunilor ARACIP nr. 1–3/2022: documentele proiective (PDI/PAS, plan managerial), RAEI pe ultimii 3 ani, raportul anual privind starea și calitatea învățământului, organigrama, statul de funcții, extrasul Revisal, regulamentul intern, documentele CEAC, planul de școlarizare aprobat, execuția bugetară și schema orară. Analiza documentelor orientează verificările din teren: comisia identifică din birou aspectele care trebuie confirmate la fața locului.' },
      { titlu: 'Vizita de evaluare — tehnica triangulării dovezilor', continut: 'În timpul vizitei, comisia verifică în teren concordanța dintre documente și realitate prin TRIANGULARE: fiecare constatare se confirmă din minimum trei surse independente — documentul din platformă, observarea directă și declarațiile din interviuri/chestionare. Se vizitează spațiile școlare, administrative și auxiliare (inclusiv verificarea autorizației sanitare de funcționare și a autorizației/avizului de securitate la incendiu — I4; accesibilitatea — I7), se realizează interviuri cu directorul, președintele consiliului de administrație, coordonatorul CEAC, cadre didactice, părinți și elevi, și se efectuează asistențe la activitățile de învățare (I11). Întrebări-tip de interviu, corelate cu indicatorii: pentru director — „Cum ați fundamentat țintele din PDI și cum le corelați cu bugetul?" (I1, I14); pentru coordonatorul CEAC — „Cum ați ajuns la calificativul din RAEI la indicatorul X și ce dovadă îl susține?" (I15, I23); pentru cadre didactice — „Cum urmăriți progresul fiecărui elev și ce faceți pentru cei rămași în urmă?" (I12); pentru părinți/elevi — „Vă simțiți în siguranță și consultați în deciziile școlii?" (I4, I3, starea de bine). Constatările se consemnează pe fiecare indicator; la evaluarea periodică se compară calificativul de autoevaluare din RAEI cu cel constatat, iar diferențele se justifică în raport.' },
      { titlu: 'Cele 5 întrebări fundamentale', continut: 'Concluziile evaluării externe se formulează prin raportare la cinci întrebări fundamentale, fiecare apreciată de la „nesatisfăcător" la „excelent" prin corelarea constatărilor pe indicatori (tabelul de corelare — anexă la raport): 1. În ce măsură școala servește nevoile și interesele membrilor individuali ai comunității școlare, ale comunității în ansamblu și ale societății în general? 2. În ce măsură școala funcționează și este guvernată în mod eficient? 3. În ce măsură școala obține rezultatele scontate ale învățării? 4. În ce măsură școala asigură starea de bine a participanților la educație? 5. În ce măsură este școala o instituție de succes, care învață și se îmbunătățește continuu?' },
      { titlu: 'Raportul de evaluare externă', continut: 'Raportul de evaluare externă are structura reală: PARTEA I — Scopul și concluziile vizitei de evaluare externă (concluziile la cele 5 întrebări fundamentale, nivelul de realizare al indicatorilor, punctele tari și ariile de îmbunătățire identificate pe fiecare domeniu, capacitatea maximă de școlarizare); PARTEA a II-a — Informații generale privind unitatea de învățământ (personal, spații, autorizații, rezultate: participare, abandon, promovabilitate pe ultimii 3 ani școlari încheiați); PARTEA a III-a — Surse informaționale; PARTEA a IV-a — Activitățile întreprinse în timpul vizitei. Raportul se face public conform art. 12 alin. (8) din H.G. nr. 993/2020, iar evaluarea periodică se finalizează cu atestatul privind nivelul calității educației furnizate.' },
    ],
    quiz: [
      { intrebare: 'Cine desemnează comisia de evaluare externă?', variante: ['Inspectoratul școlar județean', 'ARACIP, prin hotărâre de evaluare', 'Ministerul Educației, prin ordin', 'Unitatea de învățământ evaluată'], corecta: 1 },
      { intrebare: 'Câte întrebări fundamentale structurează concluziile raportului de evaluare externă?', variante: ['3', '5', '7', '10'], corecta: 1 },
      { intrebare: 'Ce conține PARTEA I a raportului de evaluare externă?', variante: ['Doar date despre personal', 'Scopul și concluziile vizitei de evaluare externă', 'Execuția bugetară', 'Schema orară a unității'], corecta: 1 },
      { intrebare: 'În raportul evaluării externe periodice, calificativul fiecărui indicator apare:', variante: ['Doar calificativul evaluării externe', 'Comparativ: calificativul de autoevaluare (RAEI) și cel de evaluare externă', 'Doar calificativul de autoevaluare', 'Ca punctaj procentual'], corecta: 1 },
    ],
  },
  {
    id: 'c5',
    nr: '05',
    titlu: 'Platforma calitate.aracip.eu și gestionarea dovezilor',
    desc: 'Utilizarea reală a platformei ARACIP: categoriile de documente, corelarea dovezilor cu indicatorii (Instrucțiunile nr. 1–3/2022) și demonstrarea progresului.',
    durata: '40 min',
    lectii: 4,
    dificultate: 'Intermediar',
    culoare: '#ec4899',
    lectiiContinut: [
      { titlu: 'Rolul platformei calitate.aracip.eu', continut: 'Platforma https://calitate.aracip.eu este instrumentul de lucru real al relației dintre unitățile de învățământ și ARACIP: aici se depun cererile de evaluare (autorizare, acreditare, evaluare periodică), se încarcă documentele-dovadă corelate pe indicatori, se inițializează și se finalizează anual RAEI și se arhivează rapoartele. Documentele postate nu trebuie să depășească 30 MB, iar denumirea documentului încărcat este cea stabilită prin Instrucțiunile ARACIP (pentru identificare unitară la nivel național).' },
      { titlu: 'Categoriile reale de documente', continut: 'Platforma organizează documentele pe categorii standard: DOCUMENTELE ȘCOLII / PLANIFICARE INTERNĂ (PDI/PAS și revizuirile, planul managerial — denumit „plan operațional"); DOCUMENTELE ȘCOLII / RESURSE UMANE (organigrama, statul de funcții, extrasul Revisal, situația cursurilor de formare); DOCUMENTELE ȘCOLII / DOCUMENTE DE FUNCȚIONARE ȘI RESURSE MATERIALE (regulamentul intern); DOCUMENTELE ȘCOLII / SISTEMUL DE MANAGEMENT AL CALITĂȚII (decizia de înființare CEAC, regulamentul CEAC, planul managerial CEAC); DOCUMENTELE ȘCOLII / OFERTĂ EDUCAȚIONALĂ ȘI REZULTATE EDUCAȚIONALE (planul de școlarizare aprobat); restul documentelor se postează la DOCUMENTE DE ÎNFIINȚARE / ALTELE.' },
      { titlu: 'Corelarea documentelor cu indicatorii', continut: 'Instrucțiunea ARACIP nr. 3/2022 corelează explicit documentele cu fiecare indicator. Exemple reale: I1 — PDI/PAS, plan managerial, RAEI pe ultimii 3 ani, raportul anual privind starea și calitatea învățământului; I3 — organigrama, procedura de comunicare internă și externă, registrul de intrări/ieșiri, evidența absolvenților; I12 — planificările evaluării, planificarea activităților remediale pentru fiecare elev, analiza progresului fiecărui elev (pentru o clasă); I13 — procedura de urmărire ulterioară a absolvenților și analiza chestionarelor de feedback ale absolvenților; I14 — execuția bugetară. Pentru I7, I11, I21 și I22 instrucțiunea prevede „NICIUN DOCUMENT" — verificarea se face exclusiv la vizită.' },
      { titlu: 'Demonstrarea progresului elevilor', continut: 'Conform anexei la Instrucțiunea nr. 3/2022, progresul se demonstrează pe un exemplu de clasă/formațiune: grădiniță — fișele de progres ale preșcolarilor; primar — progresul constatat între evaluarea de la clasa a II-a și evaluarea de la clasa a IV-a; gimnaziu — progresul între evaluarea de la clasa a IV-a și cea de la clasa a V-a, respectiv între evaluarea de la clasa a VI-a și rezultatele Evaluării Naționale; liceu teoretic și vocațional — între media de admitere și media de la bacalaureat (pe o clasă); liceu tehnologic — se adaugă procentul de promovare a examenului de certificare a competențelor profesionale dintr-o clasă terminală; postliceal/școală de maiștri — procentul de promovare a examenului de certificare. Unitățile cu mai multe niveluri evidențiază progresul pentru fiecare nivel.' },
    ],
    quiz: [
      { intrebare: 'Care este dimensiunea maximă a unui document postat în platformă?', variante: ['10 MB', '30 MB', '100 MB', 'Nelimitată'], corecta: 1 },
      { intrebare: 'Decizia de înființare a CEAC se încarcă la categoria:', variante: ['PLANIFICARE INTERNĂ', 'SISTEMUL DE MANAGEMENT AL CALITĂȚII', 'RESURSE UMANE', 'OFERTĂ EDUCAȚIONALĂ ȘI REZULTATE'], corecta: 1 },
      { intrebare: 'La liceul teoretic, progresul elevilor se demonstrează prin:', variante: ['Media generală din clasa a V-a', 'Compararea mediei de admitere cu media de la bacalaureat (pe o clasă)', 'Numărul de premii la concursuri', 'Rata absenteismului'], corecta: 1 },
      { intrebare: 'Pentru indicatorii I7, I11, I21 și I22, Instrucțiunea nr. 3/2022 prevede:', variante: ['Câte 5 documente obligatorii', 'Niciun document obligatoriu — verificarea se face direct la vizită', 'Numai fotografii', 'Rapoarte lunare către ISJ'], corecta: 1 },
    ],
  },
  {
    id: 'c6',
    nr: '06',
    titlu: 'Îmbunătățirea continuă a calității și starea de bine',
    desc: 'Planul de îmbunătățire (RAEI — Partea a IV-a), revizuirea PDI/PAS, starea de bine a participanților la educație și bucla internă a calității.',
    durata: '45 min',
    lectii: 4,
    dificultate: 'Avansat',
    culoare: '#22c55e',
    lectiiContinut: [
      { titlu: 'De la evaluare la îmbunătățire', continut: 'Scopul evaluării — internă sau externă — este îmbunătățirea calității, nu sancționarea. Rezultatele autoevaluării (RAEI, Partea a III-a) și recomandările din rapoartele de evaluare externă se preiau în PLANUL DE ÎMBUNĂTĂȚIRE A CALITĂȚII (RAEI, Partea a IV-a), cu activități, responsabili, termene și resurse. Pentru indicatorii evaluați „Nesatisfăcător", măsurile de remediere sunt obligatorii, deoarece calificativul semnifică neîndeplinirea standardelor de acreditare — nivelul minim acceptabil de calitate. Implementarea planului este monitorizată de CEAC, iar rezultatele se raportează în RAEI-ul anului următor (Partea a II-a).' },
      { titlu: 'Revizuirea PDI/PAS și a ofertei educaționale (I17)', continut: 'Indicatorul I17 — „Revizuirea ofertei educaționale și a PDI/PAS" — cere ca documentele proiective și oferta să fie revizuite periodic pe baza concluziilor autoevaluării și a feedbackului beneficiarilor. Dovezile reale, conform Instrucțiunii nr. 3/2022: oferta educațională revizuită, analiza chestionarelor de feedback și corespondența scrisă/electronică privind propunerile pentru PDI/PAS. Revizuirea se corelează cu fundamentarea bugetului (I14): țintele strategice din PDI trebuie susținute financiar prin execuția bugetară.' },
      { titlu: 'Starea de bine a participanților la educație', continut: 'Starea de bine este un concept central al standardelor în vigoare (H.G. nr. 631/2022): apare explicit în denumirea indicatorilor I11 — „Realizarea activităților de învățare, asigurarea participării și obținerea stării de bine" — și I12 — „Rezultatele obținute (participare școlară, rezultatele învățării și starea de bine)". Ea este și obiectul întrebării fundamentale nr. 4 din raportul de evaluare externă: „În ce măsură școala asigură starea de bine a participanților la educație?". În evaluare, starea de bine se apreciază prin observarea directă a climatului din clase, prin interviuri cu elevii și părinții și prin analiza măsurilor unității privind siguranța, incluziunea și sprijinul acordat elevilor.' },
      { titlu: 'Bucla internă a calității: formare și evaluarea personalului', continut: 'Îmbunătățirea continuă se susține prin doi indicatori-cheie ai domeniului C: I16 — „Dezvoltarea profesională a personalului" (dovezi: situația cursurilor de formare profesională, planificarea interasistențelor) și I19 — „Evaluarea calității activității corpului profesoral" (dovezi: fișele anuale de evaluare și planurile individuale de remediere a punctelor slabe ale cadrelor didactice). Mecanismul real funcționează ca o buclă: evaluarea personalului identifică punctele slabe → planurile individuale de remediere și formarea continuă le corectează → interasistențele și asistențele la ore verifică efectul la clasă → rezultatele se reflectă în RAEI și în progresul elevilor.' },
    ],
    quiz: [
      { intrebare: 'Măsurile de remediere sunt OBLIGATORII pentru indicatorii evaluați:', variante: ['Bine', 'Nesatisfăcător', 'Foarte bine', 'Satisfăcător'], corecta: 1 },
      { intrebare: 'Întrebarea fundamentală nr. 4 din raportul de evaluare externă vizează:', variante: ['Bugetul unității', 'Starea de bine a participanților la educație', 'Transportul elevilor', 'Schema orară'], corecta: 1 },
      { intrebare: '„Revizuirea ofertei educaționale și a PDI/PAS" este indicatorul:', variante: ['I3', 'I17', 'I24', 'I9'], corecta: 1 },
      { intrebare: 'Planurile individuale de remediere a punctelor slabe ale cadrelor didactice sunt dovadă pentru:', variante: ['I19 — Evaluarea calității activității corpului profesoral', 'I14 — Constituirea bugetului', 'I22 — Accesul la oferta educațională', 'I4 — Sănătatea și securitatea'], corecta: 0 },
    ],
  },
]

const DIFF_COLOR: Record<string, string> = {
  'Începător': '#22c55e',
  'Intermediar': '#f59e0b',
  'Avansat': '#ef4444',
}

function loadProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('aracip_elearning_progress') || '{}') } catch { return {} }
}

function saveProgress(p: Record<string, boolean>) {
  try { localStorage.setItem('aracip_elearning_progress', JSON.stringify(p)) } catch { /* noop */ }
  // Persistență cloud non-blocantă (fallback localStorage dacă Supabase lipsește).
  try {
    const done = Object.values(p).filter(Boolean).length
    const pct = Math.round((done / CURSURI.length) * 100)
    pushElearningProgress(pct, p)
  } catch { /* noop */ }
}

export default function ELearningPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [cursActiv, setCursActiv] = useState<string | null>(null)
  const [lectieActiva, setLectieActiva] = useState(0)
  const [fazaCurs, setFazaCurs] = useState<'lectii' | 'quiz' | 'rezultat'>('lectii')
  const [raspunsuri, setRaspunsuri] = useState<Record<number, number>>({})
  const [scoreQuiz, setScoreQuiz] = useState(0)

  useEffect(() => { setProgress(loadProgress()) }, [])

  const curs = CURSURI.find(c => c.id === cursActiv)
  const totalFinate = Object.values(progress).filter(Boolean).length

  function deschideCurs(id: string) {
    setCursActiv(id)
    setLectieActiva(0)
    setFazaCurs('lectii')
    setRaspunsuri({})
    setScoreQuiz(0)
  }

  function lectieUrmatoare() {
    if (!curs) return
    if (lectieActiva < curs.lectiiContinut.length - 1) {
      setLectieActiva(l => l + 1)
    } else {
      setFazaCurs('quiz')
      setRaspunsuri({})
    }
  }

  function submitQuiz() {
    if (!curs) return
    let score = 0
    curs.quiz.forEach((q, i) => { if (raspunsuri[i] === q.corecta) score++ })
    setScoreQuiz(score)
    setFazaCurs('rezultat')
    if (score >= Math.ceil(curs.quiz.length * 0.75)) {
      const np = { ...progress, [curs.id]: true }
      setProgress(np)
      saveProgress(np)
    }
  }

  function inchideCurs() {
    setCursActiv(null)
    setFazaCurs('lectii')
  }

  const bg = '#0f172a'
  const card = 'rgba(255,255,255,0.04)'
  const border = 'rgba(255,255,255,0.08)'

  if (cursActiv && curs) {
    return (
      <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px 16px' }}>
        {/* Header curs */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={inchideCurs} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Lista cursuri</button>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
              {fazaCurs === 'lectii' && (
                <div style={{ height: 4, borderRadius: 4, background: curs.culoare, width: `${((lectieActiva + 1) / (curs.lectiiContinut.length + 1)) * 100}%`, transition: 'width 0.4s' }} />
              )}
              {fazaCurs === 'quiz' && <div style={{ height: 4, borderRadius: 4, background: curs.culoare, width: '95%' }} />}
              {fazaCurs === 'rezultat' && <div style={{ height: 4, borderRadius: 4, background: '#22c55e', width: '100%' }} />}
            </div>
            <span style={{ fontSize: 12, color: '#475569', whiteSpace: 'nowrap' }}>
              {fazaCurs === 'lectii' ? `${lectieActiva + 1}/${curs.lectiiContinut.length}` : fazaCurs === 'quiz' ? 'Quiz' : 'Finalizat'}
            </span>
          </div>

          {/* Titlu curs */}
          <div style={{ background: `${curs.culoare}14`, border: `1px solid ${curs.culoare}44`, borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Cursul {curs.nr}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{curs.titlu}</div>
          </div>

          {/* Conținut */}
          {fazaCurs === 'lectii' && (
            <div>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '28px 32px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: curs.culoare, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Lecția {lectieActiva + 1} din {curs.lectiiContinut.length}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
                  {curs.lectiiContinut[lectieActiva].titlu}
                </h2>
                <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.8 }}>
                  {curs.lectiiContinut[lectieActiva].continut}
                </p>
              </div>
              <button
                onClick={lectieUrmatoare}
                style={{ background: curs.culoare, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}
              >
                {lectieActiva < curs.lectiiContinut.length - 1 ? 'Lecția următoare →' : 'Mergi la Quiz →'}
              </button>
            </div>
          )}

          {fazaCurs === 'quiz' && (
            <div>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '28px 32px', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Quiz — {curs.titlu}</h2>
                {curs.quiz.map((q, qi) => (
                  <div key={qi} style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 12 }}>{qi + 1}. {q.intrebare}</div>
                    {q.variante.map((v, vi) => (
                      <button
                        key={vi}
                        onClick={() => setRaspunsuri(r => ({ ...r, [qi]: vi }))}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '12px 16px', marginBottom: 8, borderRadius: 10, cursor: 'pointer', fontSize: 14,
                          background: raspunsuri[qi] === vi ? `${curs.culoare}22` : 'rgba(255,255,255,0.04)',
                          border: `2px solid ${raspunsuri[qi] === vi ? curs.culoare : 'rgba(255,255,255,0.08)'}`,
                          color: raspunsuri[qi] === vi ? '#fff' : '#94a3b8',
                          fontWeight: raspunsuri[qi] === vi ? 700 : 400,
                          transition: 'all 0.15s',
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <button
                onClick={submitQuiz}
                disabled={Object.keys(raspunsuri).length < curs.quiz.length}
                style={{
                  background: Object.keys(raspunsuri).length < curs.quiz.length ? '#334155' : curs.culoare,
                  color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px',
                  fontSize: 15, fontWeight: 700, cursor: Object.keys(raspunsuri).length < curs.quiz.length ? 'not-allowed' : 'pointer',
                  width: '100%', opacity: Object.keys(raspunsuri).length < curs.quiz.length ? 0.5 : 1,
                }}
              >
                Trimite răspunsurile ({Object.keys(raspunsuri).length}/{curs.quiz.length} completate)
              </button>
            </div>
          )}

          {fazaCurs === 'rezultat' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '48px 32px', marginBottom: 20 }}>
                {scoreQuiz >= Math.ceil(curs.quiz.length * 0.75) ? (
                  <>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>Felicitări!</div>
                    <div style={{ fontSize: 16, color: '#94a3b8', marginBottom: 24 }}>
                      Ai obținut <strong style={{ color: '#fff' }}>{scoreQuiz}/{curs.quiz.length}</strong> răspunsuri corecte.
                    </div>
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e44', borderRadius: 12, padding: '16px 24px', marginBottom: 24, color: '#86efac', fontSize: 14 }}>
                      Cursul a fost marcat ca <strong>finalizat</strong>. Progresul tău a fost salvat.
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📖</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', marginBottom: 8 }}>Mai încearcă!</div>
                    <div style={{ fontSize: 16, color: '#94a3b8', marginBottom: 24 }}>
                      Ai obținut <strong style={{ color: '#fff' }}>{scoreQuiz}/{curs.quiz.length}</strong> răspunsuri corecte. Sunt necesare minimum 75%.
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {scoreQuiz < Math.ceil(curs.quiz.length * 0.75) && (
                    <button onClick={() => { setFazaCurs('quiz'); setRaspunsuri({}) }} style={{ background: curs.culoare, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                      Repetă quiz-ul
                    </button>
                  )}
                  <button onClick={inchideCurs} style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Înapoi la cursuri
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Lista cursuri
  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/formare')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Platformă</button>
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Modul 1</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>E-Learning ARACIP</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#475569' }}>Progres general</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: totalFinate === 6 ? '#22c55e' : '#a78bfa' }}>
              {totalFinate}/6 cursuri
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Bară progres */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>Progres program de formare</span>
            <span style={{ color: '#a78bfa', fontWeight: 700 }}>{Math.round((totalFinate / 6) * 100)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 8 }}>
            <div style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: 6, height: 8, width: `${Math.round((totalFinate / 6) * 100)}%`, transition: 'width 0.5s' }} />
          </div>
          {totalFinate === 6 && (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e44', borderRadius: 12, padding: '12px 16px' }}>
              <span style={{ fontSize: 24 }}>🎓</span>
              <div>
                <div style={{ fontWeight: 700, color: '#22c55e' }}>Program complet finalizat!</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Ai absolvit toate cele 6 cursuri ale programului de formare ARACIP.</div>
              </div>
            </div>
          )}
        </div>

        {/* Grid cursuri */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {CURSURI.map((c, idx) => {
            const done = !!progress[c.id]
            const anterior = idx === 0 || !!progress[CURSURI[idx - 1].id]
            return (
              <div
                key={c.id}
                onClick={() => anterior && deschideCurs(c.id)}
                style={{
                  background: done ? `${c.culoare}0d` : card,
                  border: `2px solid ${done ? c.culoare : anterior ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
                  borderRadius: 16,
                  padding: '24px',
                  cursor: anterior ? 'pointer' : 'not-allowed',
                  opacity: anterior ? 1 : 0.4,
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (anterior) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ background: `${c.culoare}22`, borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 800, color: c.culoare }}>
                    {c.nr}
                  </div>
                  {done ? (
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>✓ Finalizat</span>
                  ) : !anterior ? (
                    <span style={{ background: 'rgba(255,255,255,0.06)', color: '#475569', fontSize: 12, padding: '4px 12px', borderRadius: 20 }}>🔒 Blocat</span>
                  ) : null}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{c.titlu}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>{c.desc}</p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12 }}>
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '3px 10px', borderRadius: 20 }}>⏱ {c.durata}</span>
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '3px 10px', borderRadius: 20 }}>{c.lectii} lecții</span>
                  <span style={{ background: `${DIFF_COLOR[c.dificultate]}15`, color: DIFF_COLOR[c.dificultate], padding: '3px 10px', borderRadius: 20 }}>{c.dificultate}</span>
                </div>

                {anterior && !done && (
                  <button style={{ marginTop: 16, width: '100%', background: c.culoare, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Începe cursul →
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
