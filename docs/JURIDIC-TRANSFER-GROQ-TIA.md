# EVALUAREA TRANSFERULUI DE DATE CĂTRE O ȚARĂ TERȚĂ (SUA — GROQ)

**Analiza de impact a transferului (Transfer Impact Assessment — TIA)**
**în temeiul Capitolului V (art. 44–49) din Regulamentul (UE) 2016/679 (GDPR)**

---

**Întocmit de:** NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627
**Operator:** ARACIP — Agenția Română de Asigurare a Calității în Învățământul Preuniversitar (autoritate publică) · CIF 18126924 · sediu: Str. Spiru Haret nr. 12, Sector 1, București, cod poștal 010176 · aracip@edu.gov.ro
**Sub-împuternicit vizat:** Groq, Inc. (SUA) — procesare AI (asistentul ARA)
**Data:** · **Versiune:** finală 1.0

> **Notă privind statutul.** Document finalizat. Verificarea statutului de certificare EU–US DPF al Groq pe lista oficială și asumarea formală a TIA sunt acte proprii ale operatorului (ARACIP) prin DPO desemnat, la momentul semnării DPA cu Groq.

---

## 1. Obiectul transferului

| Element | Descriere |
|---|---|
| **Exportator** | ARACIP (operator), prin împuternicitul NEWTIME |
| **Importator** | Groq, Inc. — SUA |
| **Scopul** | Procesarea AI a întrebărilor din asistentul conversațional ARA |
| **Date transferate** | **Exclusiv conținutul întrebărilor introduse de utilizator.** NU se transmit documente de dosar, acte de identitate, CNP sau alte date de identificare |
| **Categorii de persoane vizate** | Utilizatorii asistentului ARA |
| **Frecvență** | Continuă, la fiecare interogare |

**Observație esențială:** deși minimizate, întrebările utilizatorului **pot conține incidental date cu caracter personal**; prin urmare transferul intră sub incidența **Capitolului V GDPR** și necesită un mecanism valid de transfer.

---

## 2. Mecanismul de transfer (art. 45 / art. 46)

### 2.1. Clauze Contractuale Standard — SCC (art. 46 alin. 2 lit. c) — mecanism principal
Groq pune la dispoziție un **Data Processing Addendum (DPA)** care **încorporează Clauzele Contractuale Standard ale UE** („By entering into the Agreement, Customer and Groq are deemed to have signed the EU SCCs, which form part of this DPA"). Prin urmare, transferul se întemeiază pe **SCC (art. 46(2)(c))** — modulul aplicabil fiind **Modulul 3 (împuternicit UE → sub-împuternicit țară terță)**, întrucât NEWTIME acționează ca împuternicit al ARACIP, iar Groq ca sub-împuternicit.
DPA-ul Groq confirmă și că **datele API nu sunt folosite în alte scopuri** și **nu se antrenează modele pe datele clientului**, iar ștergerea la încetare se face în maximum 180 de zile.

### 2.2. Decizie de adecvare — EU–US Data Privacy Framework (art. 45) — mecanism alternativ/complementar
Comisia Europeană a adoptat, la **10 iulie 2023**, decizia de adecvare pentru **EU–US Data Privacy Framework (DPF)**. Transferurile către o organizație din SUA **certificată** sub DPF beneficiază de adecvare (art. 45), fără a mai fi necesare SCC.

**Regulă operațională:** înainte de a invoca adecvarea DPF, se verifică pe lista oficială `dataprivacyframework.gov/list` dacă **Groq, Inc. figurează ca participant activ** la categoria de date relevantă. La data redactării, certificarea Groq sub DPF nu figura confirmată în sursele consultate; în consecință, **mecanismul de transfer utilizat efectiv este SCC (pct. 2.1)**, iar DPF se invocă doar dacă și din momentul în care certificarea Groq este confirmată pe lista oficială.

**Notă de risc (stabilitatea DPF):** decizia de adecvare DPF face obiectul unei **contestații pendinte la CJUE** (cauza C-703/25 P, apel introdus la 31.10.2025, în curs la mijlocul anului 2026). Există un risc, semnalat de doctrină, ca adecvarea să fie invalidată (precedentele Schrems I/II). Din acest motiv, **mecanismul de bază rămâne SCC**, menținut ca temei independent de soarta DPF.

---

## 3. Analiza de impact a transferului (TIA)

Structură conform recomandărilor EDPB (Recommendations 01/2020 privind măsurile suplimentare).

### Pasul 1 — Cartografierea transferului
Transfer UE (împuternicit NEWTIME) → SUA (Groq), continuu, doar conținutul întrebărilor ARA. Vezi secțiunea 1.

### Pasul 2 — Mecanismul de transfer
SCC (art. 46(2)(c)) — principal; eventual DPF (art. 45) dacă Groq e certificat. Vezi secțiunea 2.

### Pasul 3 — Evaluarea legislației țării terțe (SUA)
Legislația SUA (în special **FISA 702** și **EO 12333**) permite, în anumite condiții, accesul autorităților de informații la date deținute de furnizori de comunicații electronice. Reformele introduse prin **Executive Order 14086 (octombrie 2022)** — care stau la baza deciziei de adecvare DPF — au adăugat principii de necesitate și proporționalitate și un mecanism de redres (Data Protection Review Court). Riscul teoretic de acces guvernamental subzistă, dar este atenuat de: (i) natura datelor (întrebări, fără identificatori), (ii) angajamentul Groq de a nu folosi datele în alte scopuri și de a nu le utiliza pentru antrenare.

### Pasul 4 — Măsuri suplimentare (tehnice / organizatorice / contractuale)
| Tip | Măsură |
|---|---|
| **Tehnică** | **Minimizarea drastică** a datelor: se trimit doar întrebările, fără documente, acte de identitate, CNP; criptare în tranzit (TLS) |
| **Organizatorică** | Notă de avertizare în interfața ARA („nu introduceți date cu caracter personal"); instruirea utilizatorilor administrativi |
| **Contractuală** | DPA + SCC cu Groq; interdicția utilizării pentru antrenare; ștergere ≤180 zile la încetare; obligația de notificare a cererilor autorităților conform clauzei 15 din SCC |

### Pasul 5 — Evaluarea eficacității
Combinația minimizare + SCC + măsuri contractuale reduce riscul rezidual la un nivel **acceptabil** pentru operarea curentă. Riscul nu este eliminat complet cât timp există transferul.

### Pasul 6 — Reevaluare periodică
TIA se reevaluează la modificarea legislației SUA, a statutului DPF (inclusiv rezultatul cauzei C-703/25 P) sau a condițiilor Groq; cel puțin **anual**.

---

## 4. Concluzie și recomandare

1. **Transferul este licit** pe baza **SCC (art. 46(2)(c)), Modulul 3,** din DPA-ul Groq, completate cu măsurile suplimentare (minimizare) din secțiunea 3.
2. **Dacă Groq este certificat EU–US DPF** (verificat pe lista oficială la momentul semnării DPA), transferul beneficiază suplimentar de adecvare (art. 45); SCC se **păstrează ca mecanism de rezervă** dat fiind riscul de invalidare a DPF.
3. **Recomandare principală (eliminarea riscului):** migrarea componentei AI către un **furnizor cu opțiune de găzduire în UE** (sau un model găzduit în UE) **elimină transferul extra-UE** și, implicit, întreaga analiză de la Capitolul V. Semnalat și în `7-GAZDUIRE-DOMENIU.md` și `5-GDPR-CONFORMITATE.md`.

---

## 5. Pași administrativi la semnare

Următorii pași se realizează la momentul contractării Groq și al asumării formale a TIA de către operator:

- Semnarea DPA + SCC (Modulul 3) cu Groq.
- Verificarea listei oficiale EU–US DPF pentru Groq, Inc. (`dataprivacyframework.gov/list`) și consemnarea rezultatului.
- Asumarea TIA și anexarea la DPIA (`JURIDIC-DPIA.md`).
- Evaluarea deciziei strategice privind migrarea componentei AI către un furnizor cu găzduire în UE (recomandare de la pct. 4.3).

---

**NEWTIME CONCEPT SOLUTIONS S.R.L. · CUI 38803627**
