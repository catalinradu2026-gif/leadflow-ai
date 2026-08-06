# ARA — Asistentul digital ARACIP · Documentație

> Documentează ce știe și cum se comportă ARA pe fiecare pagină a platformei.
> Fișiere cheie: `app/components/AraChatbot.tsx` (UI + context pagină) și
> `app/api/acreditare-chat/route.ts` (creierul / system prompt + cunoștințe live).

## Unde apare
- ARA e montată global în `app/layout.tsx` → buton flotant jos-dreapta pe **toate paginile**.
- **Excepție:** homepage-ul `/` (AIcraiova) — `AraChatbot` face `return null`. Acolo răspunde **Ava** (agenta de vânzări AIcraiova), nu ARA. Deci NU se pun amândouă pe `/`.
- ARA apare pe: `/aracip`, `/acreditare/*`, `/edu/*`, `/demo/*`, `/scoala`, `/gradinita`.

## Cum devine conștientă de pagină
`AraChatbot` citește `usePathname()` și adaptează:
1. **Eticheta paginii** din `PAGE_LABELS` (afișată în header-ul chatului).
2. **Salutul** din `getGreeting(pathname)` — 30+ variante specifice.
3. **Întrebările rapide** din `getQuickQuestions(pathname)` — chips specifice paginii.
4. Trimite către API: `messages`, `pagina` (eticheta), `userIdentity` (doar pe portaluri autentificate), `pageContext` (conținutul live al ecranului — vezi mai jos).

## Cunoștințe FIXE (system prompt în `acreditare-chat`)
- Procese ARACIP: autorizare, acreditare instituțională, evaluare periodică (documente, termene, criterii A1/A2/A3, calificative Excelent/Bine/Satisfăcător/Nesatisfăcător).
- Harta completă a portalului (ce rol găsește ce, pe ce URL).
- FAQ cu răspunsuri (autorizare / acreditare / periodică / documente / termene / taxe / contestații).
- BAC (mate M1/M2, română real/uman), cursuri AI elevi + formare profesori.
- Documentele demo ISJ Dolj.
- `getProfilVizitator(pagina)` — pentru fiecare tip de pagină construiește un profil „cine e persoana + ce gândește + cum răspunde ARA".

## Cunoștințe LIVE (actualizate automat la fiecare mesaj)
- 📄 **Documente publicate** (`app/api/documents`) + calcul termene active/urgente.
- 📢 **Anunțuri/module/general** din panoul admin (`app/api/ara-knowledge`).
- 🗄️ **Arhivă oficială ARACIP** (`app/api/ara-archive` → `loadArchiveDocs(5)`) ca RAG.
 - **Stocare: Supabase** (tabel `ara_archive`), cu fallback pe Vercel Blob dacă lipsesc cheile.
 - Când există documente, ARA răspunde pe baza lor cu referință la titlu.
- 👁️ **`pageContext`** — ce vede efectiv utilizatorul pe ecran, pus de pagină în `window.__araPageContext`.
 - **Momentan doar `app/demo/director/page.tsx`** setează acest context.
 - Restul paginilor: ARA știe *tipul* paginii + cunoștințele de mai sus, dar nu conținutul exact de pe ecran.

## Model
- Groq `llama-3.3-70b-versatile`, `max_tokens: 600`, `temperature: 0.4`, ultimele 10 mesaje.
- Rate limit: 60 req/min per IP; system prompt custom limitat la 10/zi.

## Comportament per pagină (rezumat)
| Rută | Profil persoană | Stil ARA |
|------|-----------------|----------|
| `/aracip` | Vizitator nou, rol necunoscut | Întreabă rolul, apoi îndrumă cu URL-uri |
| `/acreditare/autorizare` | Fondator școală nouă | Oferă lista documente + termene proactiv |
| `/acreditare/acreditare-scolara` | Director pre-acreditare | Plan pe zile, simulare comisie |
| `/acreditare/evaluare-periodica` | Director la 5 ani | Checklist diferențe vs prima acreditare |
| `/demo/inspector` | Inspector Național | Ton coleg-expert, statistici, proceduri |
| `/demo/isj` | Inspector ISJ | Scurt, citează documentul (nr+dată) |
| `/demo/director` | Director ocupat | Termen urgent + **vede ecranul live** |
| `/edu/diriginte` | Diriginte | Pas cu pas activare cod sesiune |
| `/edu/elevi` | Elev | Ton cald, „tu", fără judecată |
| `/edu/cursuri-profesori` | Profesor | Practic, prompturi gata de folosit |

## Goluri cunoscute / de îmbunătățit
1. **`pageContext` doar pe Director** — de extins la Inspector, ISJ, Acreditare pentru ca ARA să știe exact ce e pe ecran.
2. Homepage `/` e acoperit de Ava (intenționat), nu de ARA.
