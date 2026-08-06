# Soluție informatică pentru asigurarea calității în învățământul preuniversitar
## Document de prezentare funcțională

**Sprijin pentru Activitatea A.2 — formarea formabililor și Activitatea A.3 — formarea experților evaluatori externi**

Furnizor: NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627 · J2018000242160
Contact: contact@aicraiova.ro

---

## 1. Scopul soluției

Aplicația informatică sprijină programele de formare din proiect și procesele de asigurare a calității coordonate de ARACIP. Soluția oferă un mediu integrat pentru:

- formarea și evaluarea competențelor formabililor (Activitatea A.2) și ale experților evaluatori externi (Activitatea A.3);
- exersarea, în condiții realiste, a autoevaluării instituționale și a evaluării externe periodice;
- monitorizarea centralizată, la nivel național, a parcursului de formare pentru cele aproximativ 1.000 de unități de învățământ beneficiare;
- comunicarea instituțională între unități, inspectoratele școlare județene și ARACIP.

## 2. Cadrul legal aplicat

Conținutul și procesele reflectă cadrul normativ în vigoare:

- Legea învățământului preuniversitar nr. 198/2023 — Titlul IV „Asigurarea calității" (art. 233 — domenii și criterii; art. 234 — Comisia pentru Evaluarea și Asigurarea Calității și raportul anual de evaluare internă);
- Ordinul ministrului educației nr. 6.072/2023 — măsuri tranzitorii;
- Hotărârea Guvernului nr. 993/2020 — metodologia de evaluare instituțională;
- Hotărârea Guvernului nr. 994/2020, modificată prin Hotărârea Guvernului nr. 631/2022 — standardele și cei 24 de indicatori de performanță;
- Instrucțiunile ARACIP nr. 1–3/2022 — documentele probatorii.

## 3. Arhitectura și securitatea soluției

- **Găzduire în Uniunea Europeană.** Aplicația și baza de date sunt găzduite pe infrastructură din spațiul Uniunii Europene, cu respectarea Regulamentului (UE) 2016/679 (GDPR) și a Legii nr. 190/2018.
- **Comunicații securizate.** Transmiterea datelor se realizează criptat (HTTPS), cu politici de securitate a conținutului și protecții împotriva atacurilor uzuale.
- **Persistență centralizată.** Datele de formare, rapoartele și depunerile unităților sunt stocate într-o bază de date relațională securizată, accesibilă controlat.
- **Autentificare pe roluri.** Accesul este diferențiat pe roluri (formabil, evaluator extern, administrator, inspector), cu posibilitatea autentificării în doi pași pentru conturile administrative.
- **Protecția documentelor cu date personale.** Documentele încărcate în dosare (care pot conține date de identificare) sunt stocate în spațiu **privat**; descărcarea se face exclusiv printr-un canal securizat pe server, protejat cu parolă, fără expunerea de legături directe. Verificarea stadiului cererilor este protejată împotriva enumerării (nu confirmă existența unei cereri fără potrivirea adresei de e-mail).
- **Protecția datelor personale.** Politica de confidențialitate, colectarea consimțământului și exercitarea dreptului la ștergere sunt integrate în aplicație.
- **Accesibilitate și utilizare pe mobil.** Interfața este adaptată dispozitivelor mobile și respectă bunele practici de accesibilitate (navigare la tastatură, contrast, reducerea animațiilor la preferința utilizatorului).
- **Notificări prin e-mail.** Confirmările și deciziile se transmit prin e-mail tranzacțional, de pe un domeniu verificat.

## 4. Module funcționale

### 4.1. Modulul Formare Profesională

Destinat formabililor (A.2) și experților evaluatori externi (A.3). Cuprinde:

- **Program E-Learning** — șase cursuri structurate privind cadrul legal, cei 24 de indicatori de performanță, Comisia pentru Evaluarea și Asigurarea Calității, raportul anual de evaluare internă și procesul de evaluare externă. Fiecare curs include lecții și test de verificare a cunoștințelor, cu prag de promovare și evidența progresului.
- **Simulare a autoevaluării instituționale (A.2)** — reproduce completarea raportului anual de evaluare internă pe cei 24 de indicatori, cu îndrumare privind dovezile și generarea unui raport de sinteză și a unui plan de îmbunătățire.
- **Simulare a evaluării externe periodice (A.3)** — reproduce integral parcursul evaluatorului: analiza documentelor, vizita, interviurile și redactarea raportului de evaluare externă, cu aplicarea corelării pe cele cinci întrebări fundamentale.
- **Certificare** — la finalizarea programului, participantul obține un certificat nominal de participare (vezi procesul de mai jos).
- **Administrare și raportare** — modul de administrare pentru monitorizarea participanților, a progresului și a rezultatelor, cu export în format Excel și PDF.

**Procesul de certificare.** Certificatul de participare se generează **automat** de aplicație, la finalizarea programului de către participant (parcurgerea integrală a cursurilor E-Learning și/sau a simulării corespunzătoare rolului). Documentul este **nominal și personalizat** și conține: numele participantului, activitatea parcursă (A.2 — formarea formabililor sau A.3 — formarea experților evaluatori externi), unitatea de învățământ și județul (dacă au fost furnizate), data emiterii, un **cod unic de certificat** și referința la cadrul legal aplicabil (H.G. nr. 994/2020, modificată prin H.G. nr. 631/2022). Certificatul se obține în **format PDF, gata de tipărire**. Participantul își poate descărca propriul certificat, iar din modulul de administrare ARACIP poate genera și descărca certificatele pentru oricare dintre participanții care au finalizat programul. Emiterea nu presupune operațiuni manuale.

[[MODEL-CERTIFICAT]]

*Model orientativ de certificat (datele sunt exemplificative).*

### 4.2. Modulul Calitate și Acreditare

Destinat unităților de învățământ, fondatorilor de unități noi și publicului interesat. Cuprinde procese complet funcționale, nu doar informative:

- **Autorizarea de funcționare provizorie — flux complet online (acces public).** Fondatorul unei unități noi (sau o unitate existentă care solicită un nivel nou) depune dosarul printr-un formular ghidat în șase pași: date de identificare (inclusiv e-mail și telefon de contact), structura unității, spații și dotări, cadre didactice, **încărcarea documentelor anexe** (proiect de dezvoltare instituțională, ofertă educațională, acte privind spațiile, avize ISU și DSP, regulament intern) și confirmarea. La depunere, aplicația generează automat **numărul de înregistrare** și transmite un **e-mail de confirmare**.
- **Urmărirea stadiului dosarului fără cont.** Solicitantul verifică oricând stadiul într-o pagină dedicată, autentificându-se simplu cu **numărul cererii și adresa de e-mail** folosită la depunere. Vede parcursul (Depusă → În analiză → Autorizat / Respinsă, cu motiv) și, în caz de aprobare, **descarcă Autorizația de Funcționare Provizorie în format PDF** direct din pagină.
- **Notificare automată prin e-mail** la fiecare etapă: confirmarea depunerii și decizia ARACIP (admis/respins).
- **Acreditarea instituțională și evaluarea externă periodică.** Directorul unei unități autorizate depune solicitarea din portalul dedicat; primește număr de înregistrare și confirmare pe e-mail, iar la decizia ARACIP este notificat automat, cu punerea la dispoziție a documentului oficial (decizie de acreditare / atestat).
- **Depunerea autoevaluării** de către unitatea de învățământ, cu transmiterea automată către inspectoratul județean și către ARACIP;
- registrele naționale ale unităților și tabloul de bord cu situația depunerilor, cu filtrare pe județ și pe stadiu;
- secțiuni informative privind **legislația în vigoare** (cu marcarea actelor aplicabile și trimiteri către textul oficial) și întrebările frecvente.

### 4.3. Portaluri instituționale

- **Portalul directorului** — vizualizarea documentelor și circularelor primite, cu confirmarea citirii, calendar al termenelor și listă de verificare a conformității, generarea raportului anual de evaluare internă (RAEI), depunerea solicitărilor de acreditare/evaluare periodică și comunicarea cu inspectoratul.
- **Portalul inspectoratului școlar județean** — inspectorul își **selectează județul la autentificare**, iar monitorizarea în timp real (autoevaluări depuse, RAEI generate, cereri de autorizare) se filtrează pe județul respectiv. Permite transmiterea documentelor și comunicarea cu directorii.
- **Portalul inspectorului național (ARACIP)** — tabloul central, cu situația la nivel național: rezumatul în timp real al formării, depunerile unităților agregate pe județe, cererile de autorizare și de acreditare/evaluare, arhiva documentelor oficiale și situația completă a participanților. Inspectorul **ia decizia** asupra cererilor (acceptare/respingere, cu motivarea respingerii), **consultă și descarcă documentele dosarului** depus, iar la aprobare **generează documentul oficial în PDF** (autorizație, decizie de acreditare sau atestat). Solicitantul este notificat automat prin e-mail.

### 4.4. Asistent virtual inteligent (ARA)

Un asistent conversațional disponibil în întreaga aplicație, care **se adaptează contextului fiecărei pagini și rolului utilizatorului** (director, inspector, formabil, părinte, elev), oferind îndrumare privind procesele ARACIP, cadrul legal în vigoare (cei 24 de indicatori, standardele H.G. nr. 994/2020 modificată prin H.G. nr. 631/2022, metodologia H.G. nr. 993/2020) și documentele oficiale.

### 4.5. Interfață de programare (API public)

Aplicația expune o **interfață REST securizată** (autentificată prin cheie de acces) care permite integrarea datelor instituționale și agregate (unități, autorizări, acreditări/evaluări, RAEI, statistici de formare) în alte sisteme ale autorității, fără date cu caracter personal. Documentația este disponibilă online.

## 5. Fluxuri operaționale

**Parcursul de formare și certificare.** Participantul se înscrie cu date de identificare, parcurge programul E-Learning și simulările corespunzătoare rolului, iar la finalizare obține certificatul de participare. Întreaga activitate este vizibilă, în timp real, în tabloul central ARACIP.

**Lanțul asigurării calității.** Unitatea de învățământ depune autoevaluarea; datele devin imediat disponibile la nivelul inspectoratului județean și la nivel național, agregate în tabloul central și în registre.

**Ciclul de autorizare / acreditare / evaluare, cap-coadă.** Solicitantul depune dosarul online (cu documentele anexe) și primește numărul de înregistrare și confirmarea pe e-mail → cererea apare în timp real la inspectoratul județean și la ARACIP → inspectorul național consultă documentele și ia decizia (acceptare/respingere motivată) → aplicația generează documentul oficial în PDF (autorizație / decizie de acreditare / atestat) → solicitantul este notificat prin e-mail și își poate descărca documentul, verificând stadiul cu numărul cererii și e-mailul.

## 6. Facilități pentru ARACIP

Prin tabloul central, ARACIP poate:

- monitoriza formarea celor aproximativ 1.000 de unități — parcurgerea cursurilor și exersarea autoevaluării (A.2) și a evaluării externe (A.3);
- vizualiza situația completă a participanților și emite/descărca certificatele nominale;
- genera și exporta rapoarte (Excel, PDF) privind situația formării, filtrate pe rol și pe județ;
- urmări, în timp real, autoevaluările depuse de unități, agregate la nivel județean și național;
- primi și soluționa cererile de autorizare, acreditare și evaluare periodică — cu consultarea documentelor dosarului, decizie de acceptare/respingere motivată și **generarea automată a documentului oficial** (autorizație / decizie / atestat), solicitantul fiind notificat prin e-mail;
- pune datele instituționale și agregate la dispoziția altor sisteme prin interfața de programare (API), fără date cu caracter personal;
- gestiona documentele oficiale și comunicarea cu inspectoratele și unitățile.

## 7. Conformitate și protecția datelor

Soluția respectă Regulamentul (UE) 2016/679 (GDPR) și Legea nr. 190/2018: informarea persoanelor vizate, colectarea consimțământului pentru prelucrarea datelor, definirea perioadei de păstrare și exercitarea drepturilor (acces, rectificare, ștergere). Datele cu caracter personal sunt găzduite în Uniunea Europeană.

## 8. Acces pentru evaluare

Platforma poate fi accesată la adresa: **https://aicraiova.ro/aracip**

Pentru evaluarea funcțională a aplicației se pot utiliza următoarele modalități de acces:

| Secțiune | Modalitate de acces |
|----------|---------------------|
| Modulul Formare Profesională | Se selectează rolul (formabil / evaluator extern), se introduc numele și adresa de e-mail, apoi parola de acces: **ARACIP** |
| Administrare formare | Parolă de acces: **ARACIP** |
| Portaluri instituționale (director / inspectorat județean / inspector național) | Parolă de acces: **ARACIP** |
| Zona Calitate și Acreditare (autorizare, urmărire stadiu, legislație, întrebări frecvente) | Acces public, fără autentificare |
| Depunere dosar de autorizare | Public: `aicraiova.ro/acreditare/autorizare` |
| Verificarea stadiului unei cereri | Public: `aicraiova.ro/acreditare/autorizare/stadiu` (număr cerere + e-mail) |
| Documentația interfeței de programare (API) | Public: `aicraiova.ro/api-docs` |

Credențialele de mai sus sunt destinate exclusiv evaluării soluției. La implementare, fiecare utilizator primește cont individual, cu parolă proprie și, pentru conturile administrative, autentificare în doi pași.

---

*Document de prezentare funcțională. NEWTIME CONCEPT SOLUTIONS S.R.L.*
