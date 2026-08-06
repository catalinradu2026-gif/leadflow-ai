# POLITICA DE RETENȚIE A DATELOR CU CARACTER PERSONAL

**în aplicarea art. 5 alin. (1) lit. (e) din Regulamentul (UE) 2016/679 (GDPR)**
**— principiul limitării stocării —**

---

**Întocmit de:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Operator:** ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar (autoritate publică) · CIF 18126924 · sediu: Str. Spiru Haret nr. 12, Sector 1, București, cod poștal 010176 · aracip@edu.gov.ro
**Data:** · **Versiune:** finală 1.0

> **Notă privind statutul.** Document finalizat. Termenele de mai jos sunt prevederi ferme, stabilite în temeiul Legii Arhivelor Naționale nr. 16/1996 și al principiului limitării stocării (art. 5(1)(e) GDPR). Ele se aliniază nomenclatorului arhivistic al ARACIP; acolo unde nomenclatorul prevede un termen mai lung pentru o categorie de acte, prevalează termenul din nomenclator.

---

## 1. Principiu și scop

Conform **art. 5 alin. (1) lit. (e) GDPR**, datele cu caracter personal se păstrează **într-o formă care permite identificarea persoanelor vizate pe o perioadă care nu depășește perioada necesară îndeplinirii scopurilor**. La expirarea termenului, datele se **șterg** sau se **anonimizează** ireversibil.

Prezenta politică stabilește termenele de retenție per categorie, criteriile de stabilire și modul de ștergere.

---

## 2. Criterii de stabilire a termenelor

Termenele se determină pe baza:
- **obligațiilor legale** de arhivare a actelor administrative (Legea nr. 16/1996 a Arhivelor Naționale; nomenclatorul arhivistic aprobat al ARACIP);
- **scopului prelucrării** (durata procedurii / valabilitatea certificatului / durata acreditării);
- **termenelor de prescripție** aplicabile eventualelor litigii;
- **principiului minimizării** — nu se păstrează peste necesar;
- **cerinței art. 4 din Legea nr. 190/2018** de a stabili **termene clare de stocare** pentru actele de identitate / CNP.

---

## 3. Tabelul termenelor de retenție (propunere)

| # | Categorie de date | Stocare (tabelă/loc) | Termen propus | Criteriu | La expirare |
|---|---|---|---|---|---|
| 1 | **Date de formare + certificate** (nume, e-mail, unitate, progres, certificat) | `formare_progress` | Durata de valabilitate a certificatului + **3 ani** de arhivare | Scop + arhivare + dovada calificării | Ștergere/anonimizare |
| 2 | **Dosare de autorizare** (e-mail, telefon, reprezentant legal, **documente cu act identitate/CNP**) | `cereri_autorizare` + Blob privat | Durata procedurii + **10 ani** de arhivare a actului administrativ | Legea 16/1996 + art. 4 L.190/2018 | Ștergere documente / anonimizare metadate |
| 3 | **Dosare de acreditare / evaluare periodică** (e-mail contact director, denumire, CUI) | `cereri_evaluare` | Durata acreditării + **10 ani** de arhivare | Scop + arhivare | Ștergere/anonimizare |
| 4 | **Rezultate autoevaluare / RAEI** (date instituționale) | `autoevaluare_reports`, `evaluare_reports`, `raei_generate` | Durata ciclului de evaluare instituțională + **5 ani** | Scop instituțional | Anonimizare |
| 5 | **Cereri de ștergere (GDPR)** (e-mail, motiv) | `cereri_stergere` | Dovada soluționării — **3 ani** | Probarea respectării art. 17 (art. 5(2) responsabilizare) | Ștergere |
| 6 | **Conținutul mesajelor din asistentul ARA** | procesare Groq (fără stocare de durată) | Fără stocare pe termen lung; nefolosit pentru antrenare și șters în maximum **180 de zile** (per DPA Groq) | Minimizare | Nestocat |
| 7 | **Loguri tehnice / de securitate** | infrastructură | **12 luni** | Strict pentru securitate (art. 32) | Ștergere automată |
| 8 | **Loguri de decizii** (autorizare/acreditare, marcaj temporal) | server-side | Corelat cu termenul dosarului aferent (același termen ca dosarul de la poz. 2/3) | Responsabilizare (art. 5(2)) | Anonimizare/arhivare |
| 9 | **E-mailuri tranzacționale** (metadate la Resend) | Resend | **90 de zile** | Scop tranzacțional | Ștergere |

---

## 4. Reguli de aplicare

4.1. **Ștergere sau anonimizare la expirare.** La atingerea termenului, datele se șterg efectiv sau se anonimizează ireversibil (fără posibilitate de re-identificare).

4.2. **Documente cu act de identitate / CNP (art. 4 Legea 190/2018).** Se aplică termen explicit, acces restrâns „need-to-know", stocare privată (blob privat) și **instruirea periodică** a personalului. Ștergerea documentelor sursă se face imediat ce încetează necesitatea legală de păstrare.

4.3. **Suspendarea ștergerii („legal hold").** Dacă datele fac obiectul unui litigiu, control ANSPDCP sau altei obligații legale de conservare, ștergerea se suspendă până la încetarea cauzei.

4.4. **La încetarea contractului cu împuternicitul (NEWTIME).** Datele se șterg sau se returnează operatorului conform art. 10 din `JURIDIC-DPA-operator-imputernicit.md`.

4.5. **Revizuire.** Politica se revizuiește cel puțin **anual** și ori de câte ori se modifică nomenclatorul arhivistic al ARACIP.

---

## 5. Responsabilități

- **Operatorul (ARACIP):** stabilește și aprobă termenele definitive conform nomenclatorului arhivistic; decide ștergerea/arhivarea.
- **Împuternicitul (NEWTIME):** implementează tehnic ștergerea/anonimizarea la termen și pune la dispoziție mecanismele; nu șterge din proprie inițiativă fără instrucțiunea operatorului (art. 28(3)(a)).
- **DPO:** monitorizează respectarea politicii.

---

---

**NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627**
