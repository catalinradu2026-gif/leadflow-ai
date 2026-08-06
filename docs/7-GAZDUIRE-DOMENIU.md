# Găzduire și domeniu — recomandare pentru platforma ARACIP

**Versiune:** draft 1.0
**Context:** platforma este dezvoltată și demonstrată pe domeniul `aicraiova.ro` (domeniu al furnizorului). Pentru operarea oficială de către ARACIP este necesară o decizie privind **domeniul definitiv** și **infrastructura de găzduire**.

---

## 1. Cerințe pentru o autoritate publică

- **Rezidența datelor în UE/SEE** (conformitate GDPR).
- **Domeniu instituțional** propriu ARACIP (nu domeniul furnizorului).
- **Disponibilitate** ridicată și scalabilitate (≈11.500 unități + ISJ + inspectori).
- **Securitate** (HTTPS, backup, control acces).
- **Cost predictibil** și **posibilitate de audit**.

---

## 2. Situația tehnică actuală

| Componentă | Furnizor actual | Localizare | Observație |
|-----------|-----------------|-----------|------------|
| Aplicație web | Vercel | UE (configurabil) | Deploy automat, CDN global |
| Bază de date | Supabase (Postgres) | UE — Irlanda (`eu-west-1`) | GDPR OK |
| Fișiere/documente | Vercel Blob | UE (configurabil) | Privat |
| Email tranzacțional | Resend | UE/SUA | Domeniu verificat |
| AI (asistent ARA) | Groq | SUA | Singura componentă extra-UE |

---

## 3. Opțiuni de găzduire

### Opțiunea A — Rămâne pe Vercel + Supabase (regiune UE)
- **Avantaje:** rapid de pus în producție, scalare automată, cost mic la început, deja funcțional.
- **Dezavantaje:** furnizori privați (SUA-based, cu infrastructură UE); necesită DPA + SCC; percepția „cloud comercial" la o instituție publică.
- **Cost orientativ:** ordinul zecilor–sutelor EUR/lună, în funcție de trafic.

### Opțiunea B — Găzduire pe cloud/VPS în UE, gestionat
- Ex.: furnizor european (Hetzner/OVH/Scaleway) sau cloud de stat (dacă e disponibil).
- **Avantaje:** control complet, date integral UE, posibil sub contract instituțional.
- **Dezavantaje:** necesită administrare (DevOps), backup și monitorizare proprii; timp de implementare mai mare.
- **Cost orientativ:** VPS de la câteva zeci EUR/lună + operare.

### Opțiunea C — Infrastructura proprie ARACIP / cloud guvernamental
- Găzduire în infrastructura autorității / cloud guvernamental (dacă există și e accesibil).
- **Avantaje:** control instituțional maxim, conformitate integrală.
- **Dezavantaje:** dependent de disponibilitatea și politicile IT ale autorității; cel mai lung de implementat.

---

## 4. Recomandare

**Pe termen scurt (pilot / predare):** Opțiunea A cu regiuni UE + DPA/SCC semnate — este cea funcțională azi, cu risc minim și cost mic.

**Pe termen mediu (operare națională):** migrare către Opțiunea B/C, în funcție de politica IT a ARACIP, cu:
- baza de date pe plan plătit (backup automat, disponibilitate garantată);
- componenta AI mutată pe un furnizor cu opțiune UE (sau model găzduit UE), pentru a elimina singurul transfer extra-UE.

Migrarea este posibilă fără rescriere: aplicația e portabilă (Next.js standard), iar datele (Postgres) se exportă/importă direct.

---

## 5. Domeniu

Domeniul `aicraiova.ro` este **al furnizorului** și se folosește doar pentru demonstrație. Pentru operare oficială:

| Variantă | Exemplu | Recomandare |
|----------|---------|-------------|
| Subdomeniu al domeniului oficial ARACIP | `platforma.aracip.ro` / `calitate.aracip.ro` | **Recomandat** — identitate instituțională clară |
| Subdomeniu în domeniul ministerului | `calitate.edu.ro` | Alternativă, dacă se preferă umbrela ME |
| Domeniu `.ro` nou dedicat | ex. `calitateeducatie.ro` | Posibil, dar mai slab ca autoritate percepută |

**Recomandare:** subdomeniu sub domeniul oficial ARACIP (`*.aracip.ro`), cu certificat TLS și înregistrări DNS gestionate de autoritate. Migrarea domeniului nu afectează codul — se schimbă doar configurarea DNS și adresa de email a expeditorului (`noreply@<domeniul-oficial>`).

---

## 6. Pași de migrare (când se decide)

1. Alegerea domeniului oficial + acces DNS.
2. Provizionarea infrastructurii (plan plătit bază de date + găzduire aplicație).
3. Configurarea variabilelor de mediu pe noul mediu.
4. Migrarea datelor (export/import Postgres + fișiere).
5. Verificarea domeniului de email pe noul domeniu.
6. Semnarea DPA/SCC cu furnizorii reținuți.
7. Testare + comutare DNS (fără întrerupere).

---

## 7. Sinteză decizională

| Aspect | Situație acum | Recomandare |
|--------|---------------|-------------|
| Aplicație | Vercel (UE configurabil) | Opțiunea A la pilot; B/C la operare națională |
| Bază de date | Supabase UE (Irlanda) | Plan plătit (backup automat) la producție |
| Fișiere | Vercel Blob privat (UE) | Rămâne |
| AI (ARA) | Groq (SUA) | DPA + SCC; ideal furnizor cu opțiune UE la scară |
| E-mail | Resend (domeniu verificat) | Domeniu oficial ARACIP la producție |
| Domeniu | `aicraiova.ro` (al furnizorului, demo) | Subdomeniu `*.aracip.ro` |

**Concluzie:** soluția e deja conformă și operabilă pe infrastructură UE pentru etapa de pilot/predare; migrarea către o configurație integral instituțională se poate face fără rescriere, la decizia ARACIP.

---

*Document pregătit de NEWTIME CONCEPT SOLUTIONS S.R.L. Decizia finală privind găzduirea și domeniul revine ARACIP.*
