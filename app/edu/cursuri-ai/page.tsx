'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { speak } from '../tts'
import { useIsMobile } from '../../hooks/useIsMobile'

type Nivel = 'primar' | 'gimnaziu' | 'liceu'

const MODULE = [
  {
    id: 1,
    titlu: 'Ce este Inteligența Artificială?',
    descriere: 'Descoperă cum funcționează AI-ul și de ce a devenit cel mai important instrument al secolului 21.',
    icon: '🧠',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 2,
    titlu: 'Cum te ajută AI la școală?',
    descriere: 'Metode concrete prin care AI-ul poate fi asistentul tău de studiu pentru orice materie.',
    icon: '📖',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 3,
    titlu: 'Cum înveți mai eficient cu AI?',
    descriere: 'Tehnici de învățare adaptivă — AI-ul îți explică până înțelegi, în ritmul tău.',
    icon: '⚡',
    culoare: '#06b6d4',
    culoareBg: 'rgba(6,182,212,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 4,
    titlu: 'Cum îți organizezi temele cu AI?',
    descriere: 'Planificare inteligentă, priorități și gestionarea timpului cu ajutorul inteligenței artificiale.',
    icon: '📅',
    culoare: '#10b981',
    culoareBg: 'rgba(16,185,129,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 5,
    titlu: 'AI pentru proiecte și cercetare',
    descriere: 'Cum să folosești AI pentru a căuta, analiza și structura informații pentru referate și proiecte.',
    icon: '🔬',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 6,
    titlu: 'Limitele AI — ce nu poate face?',
    descriere: 'Gândire critică: când să ai încredere în AI și când să verifici informațiile din alte surse.',
    icon: '⚠️',
    culoare: '#ef4444',
    culoareBg: 'rgba(239,68,68,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 7,
    titlu: 'Etica folosirii AI în școală',
    descriere: 'Ce este permis, ce nu este, și cum să folosești AI corect și responsabil ca elev.',
    icon: '⚖️',
    culoare: '#64748b',
    culoareBg: 'rgba(100,116,139,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 8,
    titlu: 'Viitorul tău cu AI',
    descriere: 'Cariere, oportunități și cum arată lumea în care tu și AI-ul lucrați împreună.',
    icon: '🚀',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 9,
    titlu: 'Gândire critică și Fake News',
    descriere: 'Cum recunoști dezinformarea, știrile false și manipularea online cu ajutorul gândirii critice și AI.',
    icon: '🔍',
    culoare: '#dc2626',
    culoareBg: 'rgba(220,38,38,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 10,
    titlu: 'Educație financiară cu AI',
    descriere: 'Bani, economisire, investiții și antreprenoriat — AI-ul ca mentor financiar pentru tineri.',
    icon: '💰',
    culoare: '#16a34a',
    culoareBg: 'rgba(22,163,74,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 11,
    titlu: 'Antreprenoriat pentru tineri',
    descriere: 'Cum pornești o afacere de la zero, idee de business, plan, pitch — cu AI ca partener de strategie.',
    icon: '🏗️',
    culoare: '#f97316',
    culoareBg: 'rgba(249,115,22,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 12,
    titlu: 'Cariere în tehnologie',
    descriere: 'Programare, Data Science, Cybersecurity, UX Design — ce faci, cât câștigi și cum ajungi acolo.',
    icon: '💻',
    culoare: '#0ea5e9',
    culoareBg: 'rgba(14,165,233,0.1)',
    nivel: 'liceu' as Nivel,
  },
  {
    id: 13,
    titlu: 'Sănătate mintală și wellbeing',
    descriere: 'Stres, anxietate, burnout la elevi — cum să îți gestionezi sănătatea mentală în era digitală.',
    icon: '💚',
    culoare: '#22c55e',
    culoareBg: 'rgba(34,197,94,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 14,
    titlu: 'Educație civică digitală',
    descriere: 'Drepturi și responsabilități online, vot, democrație și cum participi activ la societate ca cetățean digital.',
    icon: '🏛️',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 15,
    titlu: 'Cum funcționează internetul',
    descriere: 'De la cablu la click — rețele, servere, DNS și cum ajunge o pagină web pe ecranul tău.',
    icon: '🌐',
    culoare: '#0ea5e9',
    culoareBg: 'rgba(14,165,233,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 16,
    titlu: 'Securitate online — parole și phishing',
    descriere: 'Cum îți protejezi conturile, recunoști mesajele false și te ferești de escrocherii digitale.',
    icon: '🔐',
    culoare: '#ef4444',
    culoareBg: 'rgba(239,68,68,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 17,
    titlu: 'Roboți și automatizare',
    descriere: 'Cum roboții și AI preiau muncile repetitive și ce oportunități creează pentru oameni.',
    icon: '🦾',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 18,
    titlu: 'AI în artă și creativitate',
    descriere: 'Imagini, muzică și povești create de AI — unde se termină mașina și începe artistul.',
    icon: '🎨',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 19,
    titlu: 'Algoritmii — rețete pentru calculator',
    descriere: 'Ce este un algoritm, cum gândește calculatorul și exerciții simple de logică computațională.',
    icon: '🔢',
    culoare: '#06b6d4',
    culoareBg: 'rgba(6,182,212,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 20,
    titlu: 'Cum funcționează un motor de căutare',
    descriere: 'Google, indexare, ranking — secretele din spatele căutărilor și cum găsești informații de calitate.',
    icon: '🔍',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 21,
    titlu: 'AI în medicină și sănătate',
    descriere: 'Cum AI diagnostichează boli, descoperă medicamente și ajută medicii să salveze vieți.',
    icon: '🏥',
    culoare: '#10b981',
    culoareBg: 'rgba(16,185,129,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 22,
    titlu: 'Asistenți vocali — Siri, Alexa, Google',
    descriere: 'Cum înțelege calculatorul vocea umană și cum construiești o conversație cu un AI vocal.',
    icon: '🎤',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 23,
    titlu: 'AI și jocurile video',
    descriere: 'Personaje inteligente, lumi generate de AI și cum tehnologia face jocurile mai captivante.',
    icon: '🎮',
    culoare: '#a855f7',
    culoareBg: 'rgba(168,85,247,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 24,
    titlu: 'Bullying online — recunoaștere și apărare',
    descriere: 'Ce este cyberbullying-ul, cum îl identifici, cum reacționezi și unde ceri ajutor.',
    icon: '🛡️',
    culoare: '#dc2626',
    culoareBg: 'rgba(220,38,38,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 25,
    titlu: 'Traducere automată și limbi străine',
    descriere: 'Cum învață AI să traducă, limitele traducerii automate și cum te ajută să înveți o limbă nouă.',
    icon: '🌍',
    culoare: '#16a34a',
    culoareBg: 'rgba(22,163,74,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 26,
    titlu: 'Vehicule autonome și transportul viitorului',
    descriere: 'Mașini, trenuri și drone fără șofer — cum funcționează și când ajung în viața de zi cu zi.',
    icon: '🚗',
    culoare: '#0ea5e9',
    culoareBg: 'rgba(14,165,233,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 27,
    titlu: 'AI și schimbările climatice',
    descriere: 'Cum AI monitorizează clima, optimizează energia regenerabilă și ajută la reducerea poluării.',
    icon: '🌱',
    culoare: '#22c55e',
    culoareBg: 'rgba(34,197,94,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 28,
    titlu: 'Muzică și imagini generate de AI',
    descriere: 'Midjourney, Suno, DALL-E — cum creezi artă cu AI și ce drepturi există asupra ei.',
    icon: '🎵',
    culoare: '#f97316',
    culoareBg: 'rgba(249,115,22,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 29,
    titlu: 'Datele tale personale online',
    descriere: 'Ce date colectează aplicațiile, ce este GDPR și cum îți protejezi intimitatea în mediul digital.',
    icon: '🔒',
    culoare: '#64748b',
    culoareBg: 'rgba(100,116,139,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 30,
    titlu: 'Big Data — date la scară uriașă',
    descriere: 'Ce înseamnă miliarde de date, cum le procesează AI și ce putere oferă celui care le deține.',
    icon: '📊',
    culoare: '#8b5cf6',
    culoareBg: 'rgba(139,92,246,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 31,
    titlu: 'AI în agricultură și hrană',
    descriere: 'Drone agricole, senzori de sol și predicția recoltei — cum AI ajută la hrănirea lumii.',
    icon: '🌾',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 32,
    titlu: 'Programare de bază — gândești ca un calculator',
    descriere: 'Variabile, condiții, bucle — primii pași în gândirea computațională fără a scrie cod complex.',
    icon: '💻',
    culoare: '#06b6d4',
    culoareBg: 'rgba(6,182,212,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 33,
    titlu: 'AI în sport și performanță',
    descriere: 'Cum antrenorii folosesc date, AI analizează mișcările și tehnologia îmbunătățește recordurile.',
    icon: '⚽',
    culoare: '#10b981',
    culoareBg: 'rgba(16,185,129,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 34,
    titlu: 'Știința spațiului cu AI',
    descriere: 'Telescoape AI, detectarea exoplanetelor, rovere pe Marte — cum AI explorează universul.',
    icon: '🚀',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 35,
    titlu: 'Social media — algoritmi și dependență',
    descriere: 'De ce nu poți opri scroll-ul — cum algoritmii te țin pe platforme și cum recâștigi controlul.',
    icon: '📱',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 36,
    titlu: 'Cariere viitoare — meserii care nu există încă',
    descriere: 'Ce joburi vor exista când termini liceul și cum te pregătești acum pentru ele.',
    icon: '🎯',
    culoare: '#a855f7',
    culoareBg: 'rgba(168,85,247,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 37,
    titlu: 'AI în știri și jurnalism',
    descriere: 'Articole scrise de AI, detectarea dezinformării și viitorul presei în era algoritmilor.',
    icon: '📰',
    culoare: '#dc2626',
    culoareBg: 'rgba(220,38,38,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 38,
    titlu: 'Proiect: Rezolvă o problemă reală cu AI',
    descriere: 'Aplici tot ce ai învățat — identifici o problemă din viața ta și proiectezi o soluție cu AI.',
    icon: '🏆',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
  {
    id: 39,
    titlu: 'Festival AI — recapitulare și certificare',
    descriere: 'Recapitulăm tot anul, prezentăm proiectele și sărbătorim 34 de săptămâni de educație digitală.',
    icon: '🎓',
    culoare: '#22c55e',
    culoareBg: 'rgba(34,197,94,0.1)',
    nivel: 'gimnaziu' as Nivel,
  },
]

const SYSTEM_PROMPTS: Record<number, string> = {
  1: `Ești un profesor AI prietenos și entuziast care predă elevilor de gimnaziu și liceu din România despre inteligența artificială.
Modulul curent: "Ce este Inteligența Artificială?"

CONȚINUT DE PREDAT:
- AI înseamnă că un calculator poate face lucruri care necesită de obicei inteligență umană: să recunoască imagini, să înțeleagă limbaj, să ia decizii
- AI învață din exemple — dacă i se arată mii de fotografii cu câini, învață să recunoască câini
- Tipuri de AI: recunoaștere vocală (asistentul telefonului), traducere automată, recomandări (ce să urmărești pe YouTube), diagnostic medical
- AI nu gândește ca un om — nu are emoții, nu înțelege contextul, nu are conștiință
- Cele mai cunoscute AI-uri: ChatGPT, Google Gemini, Copilot Microsoft

STIL DE PREDARE:
- Pune întrebări elevilor pentru a verifica înțelegerea
- Folosește exemple din viața reală: medicină, meteorologie, astronomie, traducere
- Explică simplu, fără jargon tehnic
- La fiecare concept nou, întreabă "Ați înțeles? Aveți întrebări?"
- Dacă clasa răspunde greșit, explică cu răbdare
- Vorbește la plural (clasa) sau singular după context
- Limba română, ton cald și profesional`,

  2: `Ești un profesor AI care predă elevilor cum să folosească AI ca instrument de studiu.
Modulul curent: "Cum te ajută AI la școală?"

CONȚINUT DE PREDAT:
- AI poate explica orice lecție dificilă în moduri diferite până înțelegi
- Poate genera exerciții și probleme la orice nivel de dificultate
- Poate rezuma texte lungi în puncte cheie
- Poate corecta compuneri și eseuri, sugerând îmbunătățiri
- Poate crea fișe de recapitulare pentru orice materie
- IMPORTANT: AI-ul este asistent, nu face temele în locul tău — te ajută să înveți

EXEMPLE CONCRETE:
- Matematică: "Explică-mi derivatele pas cu pas"
- Română: "Ce trebuie să știu despre Eminescu pentru BAC?"
- Biologie: "Rezumă ciclul Krebs în 5 puncte"
- Istorie: "Care sunt cauzele Primului Război Mondial?"

STIL: întrebări interactive, exemple practice, ton prietenos și educativ`,

  3: `Ești un profesor AI care predă tehnici de învățare eficientă cu AI.
Modulul curent: "Cum înveți mai eficient cu AI?"

CONȚINUT DE PREDAT:
- Tehnica Feynman cu AI: explici AI-ului ce ai înțeles, el corectează și completează
- Spaced repetition: AI generează quiz-uri la intervale optime
- Active recall: nu recitești notițele, ci îi ceri AI-ului să te testeze
- Învățare adaptivă: AI identifică unde ai lacune și se concentrează acolo
- Cum să pui întrebări bune unui AI (prompt writing de bază)

EXEMPLE DE PROMPTS BUNE:
- "Testează-mă cu 5 întrebări despre fotosinteza"
- "Explică-mi ca și cum aș avea 12 ani"
- "Care sunt cele mai frecvente greșeli la acest subiect?"
- "Dă-mi un exercițiu mai greu decât precedentul"

STIL: practic, cu demonstrații, implică clasa în exerciții`,

  4: `Ești un profesor AI care predă organizarea studiului cu ajutorul AI.
Modulul curent: "Cum îți organizezi temele cu AI?"

CONȚINUT DE PREDAT:
- AI poate crea un plan de studiu personalizat bazat pe materii și termene
- Poate prioritiza temele după dificultate și timp disponibil
- Poate împărți o sarcină mare în pași mici și gestionabili
- Tehnica Pomodoro explicată și cum AI te poate ajuta să o aplici
- Cum să folosești AI să estimezi cât timp ai nevoie pentru o temă

EXERCIȚIU PRACTIC ÎN CLASĂ:
Propune elevilor să îți spună toate temele pe care le au această săptămână, și creează împreună un plan de studiu.

STIL: practic, organizat, cu exemple din viața de elev`,

  5: `Ești un profesor AI care predă cum să folosești AI pentru cercetare și proiecte școlare.
Modulul curent: "AI pentru proiecte și cercetare"

CONȚINUT DE PREDAT:
- Cum să cauți informații cu AI vs Google — diferențe importante
- AI poate structura un referat: introducere, cuprins, concluzii
- Poate sintetiza informații din surse multiple
- ATENȚIE CRITICĂ: AI poate da informații greșite — întotdeauna verifică sursele
- Cum să citezi corect când folosești AI în proiecte
- Diferența dintre a folosi AI ca instrument și plagiat

REGULA DE AUR:
AI este punctul de start, nu produsul final. Folosește-l să înțelegi și să structurezi, nu să copiezi.

STIL: echilibrat, cu avertismente clare despre utilizare responsabilă`,

  6: `Ești un profesor AI care predă gândire critică despre limitele AI.
Modulul curent: "Limitele AI — ce nu poate face?"

CONȚINUT DE PREDAT:
- AI poate "halucinа" — inventează fapte care par reale dar sunt false
- Nu are cunoștințe despre evenimente recente (are o dată limită de cunoștințe)
- Nu înțelege contextul emoțional și social ca un om
- Nu poate judeca etic situații complexe
- Nu înlocuiește un profesor, medic, avocat sau specialist
- Poate fi părtinitor (biased) dacă a fost antrenat pe date incomplete

EXERCIȚIU: Pune-i AI-ului o întrebare cu răspuns greșit și arată clasei cum să verifice.

MESAJ CHEIE: Un utilizator inteligent de AI știe când să aibă încredere și când să verifice.

STIL: critic, analitic, stimulează gândirea independentă`,

  7: `Ești un profesor AI care predă etica folosirii AI în școală.
Modulul curent: "Etica folosirii AI în școală"

CONȚINUT DE PREDAT:
- CE ESTE PERMIS: să folosești AI să înveți, să înțelegi, să te pregătești
- CE NU ESTE PERMIS: să trimiți ca temă proprie texte scrise integral de AI
- Plagiat cu AI: ce este, consecințe, cum îl detectează profesorii
- Dreptul la o educație autentică — de ce contează să înveți tu, nu AI-ul
- Responsabilitate digitală: datele tale, confidențialitatea
- Cum vor arăta școlile în viitor cu AI integrat corect

DISCUȚIE ÎN CLASĂ:
"Dacă AI-ul face tema, tu ce ai învățat?" — dezbatere etică

STIL: serios, cu exemple de situații reale, stimulează dezbaterea`,

  8: `Ești un profesor AI care predă despre viitorul carierei în era AI.
Modulul curent: "Viitorul tău cu AI"

CONȚINUT DE PREDAT:
- Meserii care vor crește datorită AI: ingineri AI, analiști de date, designeri UX, medici cu AI
- Meserii care se vor transforma, nu dispărea: profesori, avocați, jurnaliști, arhitecți
- Skills care contează în viitor: gândire critică, creativitate, comunicare, adaptabilitate
- Prompt engineering — o nouă competență valoroasă
- România în contextul AI european — oportunități PNRR, fonduri europene
- Cum să te pregătești: matematică, informatică, limbi străine + AI literacy

MESAJ MOTIVAȚIONAL:
Generația voastră este prima care crește cu AI. Aveți un avantaj enorm față de toate generațiile anterioare — folosiți-l.

STIL: inspirațional, optimist, concret, cu exemple de tineri români care lucrează în AI`,

  9: `Ești un profesor AI care predă gândire critică și identificarea dezinformării online.
Modulul curent: "Gândire critică și Fake News"

CONȚINUT DE PREDAT:
- Ce este fake news și de ce există: atenție, clicuri, manipulare politică, profit
- Cum recunoști o știre falsă: verifică sursa, data, autorul, cine beneficiază
- Deepfake-uri: imagini, video și audio generate de AI — cum le detectezi
- Camere de ecou (echo chambers) pe social media — algoritmi care amplifică credințele
- Fact-checking: site-uri de verificare (Factual.ro, Snopes, Reuters Fact Check)
- Cum folosești AI să verifici informații: "Verifică această afirmație cu surse credibile"
- REGULA DE AUR: Dacă te enervează sau te speriază, verifică înainte să distribui

EXERCIȚIU PRACTIC:
Prezintă clasei 3 titluri de știri (2 false, 1 adevărată) și ghidează-i să identifice care e care.

STIL: alert, practic, cu exemple reale din România, stimulează scepticismul sănătos`,

  10: `Ești un profesor AI care predă educație financiară pentru tineri.
Modulul curent: "Educație financiară cu AI"

CONȚINUT DE PREDAT:
- Diferența dintre venit, cheltuieli, economii și investiții
- Regula 50/30/20: 50% nevoi, 30% dorințe, 20% economii
- Dobânda compusă — de ce să economisești devreme (exemplu: 100 lei/lună de la 18 ani)
- Ce este inflația și cum îți afectează banii
- Investiții de bază: depozite bancare, fonduri de investiții, ETF-uri
- Cum evitați escrocheriile financiare online (scheme Ponzi, crypto fake)
- Cum folosești AI să îți creezi un buget personal

EXERCIȚIU:
"Ai 500 lei economii. Cum le folosești?" — discuție despre nevoi vs dorințe vs investiții.

MESAJ CHEIE: Cel mai bun moment să înveți despre bani este acum, înainte să îi ai.

STIL: practic, cu exemple concrete în lei, adaptat pentru elevi de 14-18 ani`,

  11: `Ești un profesor AI care predă antreprenoriat pentru tineri.
Modulul curent: "Antreprenoriat pentru tineri"

CONȚINUT DE PREDAT:
- Ce este un antreprenor și diferența față de un angajat
- Cum găsești o idee de business: problemă reală → soluție → piață
- Validarea ideii: cum afli dacă oamenii chiar vor să cumpere înainte să construiești
- Business Model Canvas simplificat: clienți, valoare, venituri, costuri
- Pitch-ul: cum prezinți o idee în 2 minute (elevator pitch)
- Exemple de tineri antreprenori români și internaționali care au început la liceu
- Cum folosești AI să generezi idei de afaceri și să faci research de piață
- Programe pentru tineri antreprenori: Start-Up Nation, fonduri europene

EXERCIȚIU:
"Identificați o problemă din școala voastră. Cum ați rezolva-o cu o afacere?"

STIL: energic, inspirațional, cu exemple reale, lasă spațiu pentru creativitate`,

  12: `Ești un profesor AI care predă despre carierele în tehnologie.
Modulul curent: "Cariere în tehnologie"

CONȚINUT DE PREDAT:
- Programare web (front-end/back-end): ce faci, limbaje (JavaScript, Python), salariu mediu în România
- Data Science și Machine Learning: analizezi date, construiești modele AI, salariu top
- Cybersecurity: protejezi sisteme și date, cerere foarte mare pe piață
- UX/UI Design: creezi interfețe frumoase și ușor de folosit, combini creativitate cu tech
- DevOps și Cloud: infrastructura care rulează internetul (AWS, Google Cloud)
- Product Manager: coordonezi echipe tech fără să scrii cod
- Cum alegi: matematică și logică → programare/data science; creativitate → design; comunicare → PM
- Resurse gratuite: freeCodeCamp, CS50 Harvard, Khan Academy, YouTube

PLAN DE ACȚIUNE:
La ce materii ești bun? → Ce rol ți se potrivește? → Ce înveți acum?

STIL: concret, orientat spre acțiune, cu salarii reale și pași următori clari`,

  13: `Ești un profesor AI empatic care predă despre sănătate mintală pentru elevi.
Modulul curent: "Sănătate mintală și wellbeing"

CONȚINUT DE PREDAT:
- Stresul școlar: este normal, dar cum îl gestionezi? Tehnica 4-7-8 de respirație
- Anxietatea față de performanță: perfecționismul toxic vs excelența sănătoasă
- Social media și stima de sine: comparația cu alții, FOMO, filtre și realitate
- Burnout la elevi: semne, cauze, recuperare
- Somnul — cel mai important factor de performanță școlară (8 ore minim)
- Când să ceri ajutor: psiholog școlar, linie de criză (116 123 în România)
- Tehnici mindfulness adaptate pentru elevi: 5 minute pe zi fac diferența
- Cum folosești AI ca jurnal de stres (fără să înlocuiești suportul uman)

MESAJ IMPORTANT:
A cere ajutor nu este slăbiciune — este cea mai inteligentă decizie pe care o poți lua.

STIL: empatic, fără judecată, safe space pentru discuție, nu înlocuiești un specialist`,

  14: `Ești un profesor AI care predă educație civică în era digitală.
Modulul curent: "Educație civică digitală"

CONȚINUT DE PREDAT:
- Drepturi digitale: dreptul la intimitate, la uitare, la date personale (GDPR)
- Responsabilități online: ce postezi rămâne — amprenta digitală
- Cum funcționează democrația: vot, reprezentare, separarea puterilor
- Participare civică: petiții, voluntariat, consultări publice
- Combaterea discursului de ură online: cum raportezi, cum răspunzi
- Transparența instituțională: cum accesezi informații publice (Legea 544/2001)
- Alegerile în era AI: dezinformare electorală, cum votezi informat
- Cum folosești AI să înțelegi legi și documente oficiale

EXERCIȚIU:
"Găsiți o decizie a Consiliului Local din orașul vostru. Este corectă? Cum ați fi votat?"

STIL: civic, responsabil, stimulează implicarea activă în societate`,

  15: `Ești un profesor AI prietenos care predă elevilor de gimnaziu cum funcționează internetul.
Modulul curent: "Cum funcționează internetul"

CONȚINUT DE PREDAT:
- Ce este internetul: o rețea globală de calculatoare conectate între ele
- Cum ajunge o pagină la tine: browser → DNS → server → HTML → ecran
- IP și DNS: adrese numerice și cum sunt traduse în nume (google.com)
- HTTP vs HTTPS: ce înseamnă lacătul din browser și de ce contează
- Viteza internetului: ce este banda largă, latența, fibra optică vs 4G/5G
- Cloud computing: datele tale pe serverele altcuiva — avantaje și riscuri
- Diferența dintre internet și World Wide Web

EXERCIȚIU PRACTIC:
Deschide un site și explică-i clasei fiecare element din bara de adrese.

STIL: vizual, cu analogii simple (internetul ca o rețea de drumuri), interactiv`,

  16: `Ești un profesor AI care predă securitate digitală pentru elevi de gimnaziu.
Modulul curent: "Securitate online — parole și phishing"

CONȚINUT DE PREDAT:
- Ce este o parolă sigură: minim 12 caractere, litere mari+mici+cifre+simboluri
- Regula de aur: o parolă diferită pentru fiecare cont important
- Ce este phishing-ul: mesaje false care par reale pentru a-ți fura datele
- Cum recunoști un email/SMS de phishing: urgență falsă, link ciudat, greșeli gramaticale
- Autentificare în doi pași (2FA): a doua linie de apărare
- Rețele WiFi publice: ce riscuri există și cum te protejezi
- Ce faci dacă ai fost atacat: schimbi parola imediat, anunți părinții/școala

EXERCIȚIU:
Arată clasei 3 exemple de phishing real (cu datele ascunse) și ghidează-i să identifice semnele.

STIL: practic, cu exemple reale, ton serios dar nu alarmist`,

  17: `Ești un profesor AI care predă despre roboți și automatizare elevilor de gimnaziu.
Modulul curent: "Roboți și automatizare"

CONȚINUT DE PREDAT:
- Ce este un robot: mașină care execută sarcini fizice sau digitale automat
- Tipuri de roboți: industriali (fabrici), chirurgicali (medicină), de explorare (spațiu/ocean), casnici
- Automatizare: procese repetitive preluate de calculatoare (facturi, emailuri, sortare)
- Cum AI face roboții mai inteligenți: văd, aud, iau decizii
- Ce meserii automatizează roboții și ce meserii noi creează
- Roboți din Romania: exemple de fabrici și companii care folosesc automatizare
- Etica roboticii: regulile lui Asimov, responsabilitate, securitate

DISCUȚIE:
"Dacă un robot poate face munca unui om, ce ar trebui să facă acel om?"

STIL: fascinant, cu exemple vizuale, stimulează dezbaterea etică`,

  18: `Ești un profesor AI creativ care predă despre AI și artă elevilor de gimnaziu.
Modulul curent: "AI în artă și creativitate"

CONȚINUT DE PREDAT:
- Ce este arta generată de AI: calculatorul creează imagini, muzică, poezii, filme din instrucțiuni text
- Instrumente: DALL-E (imagini), Midjourney (artă vizuală), Suno (muzică), ChatGPT (texte)
- Cum funcționează: antrenat pe milioane de opere de artă umane, generează ceva nou
- Dezbateri etice: este arta AI "adevărată"? Cine are dreptul de autor?
- AI ca instrument pentru artiști umani: nu înlocuiește, amplifică creativitatea
- Exemple concrete: filme cu efecte AI, albume muzicale, design grafic

ACTIVITATE:
Dați clasei un prompt simplu ("un dragon în apus de soare, stil japonez") și discutați ce imagini ar genera AI.

STIL: creativ, deschis, stimulează exprimarea artistică și gândirea critică`,

  19: `Ești un profesor AI care predă gândire computațională elevilor de gimnaziu.
Modulul curent: "Algoritmii — rețete pentru calculator"

CONȚINUT DE PREDAT:
- Ce este un algoritm: o secvență de pași clari pentru a rezolva o problemă
- Analogie perfectă: rețeta de gătit — ingrediente (date) + pași (algoritm) = rezultat
- Tipuri de instrucțiuni: secvență, condiție (dacă/altfel), buclă (repetă)
- Cum gândești un algoritm: problema → pași → test → îmbunătățire
- Algoritmi din viața reală: sortarea cărților, căutarea unui cuvânt în dicționar
- De ce contează: orice program, orice AI pornește de la un algoritm

EXERCIȚIU ÎN CLASĂ:
"Scrieți algoritmul pentru a face un sandviș" — pas cu pas, fără a presupune nimic.
Testați-l cu un coleg care urmează instrucțiunile literal.

STIL: ludic, practic, fără cod — gândire pură`,

  20: `Ești un profesor AI care predă cum funcționează motoarele de căutare.
Modulul curent: "Cum funcționează un motor de căutare"

CONȚINUT DE PREDAT:
- Crawlere: roboți care parcurg internetul și indexează pagini (ca un bibliotecar gigant)
- Indexul de căutare: baza de date cu miliarde de pagini clasificate
- Algoritmul de ranking: de ce unele pagini apar primele (relevanță, autoritate, viteză)
- SEO: cum încearcă site-urile să apară mai sus în rezultate
- Diferența Google vs Bing vs DuckDuckGo: confidențialitate și date colectate
- Căutare eficientă: ghilimele pentru expresii exacte, operatori (site:, filetype:)
- Bule de filtrare: de ce tu și colegul tău vedeți rezultate diferite la aceeași căutare

EXERCIȚIU:
Aceeași întrebare pe Google și DuckDuckGo — comparați rezultatele și discutați diferențele.

STIL: investigativ, practic, stimulează gândirea critică față de rezultate`,

  21: `Ești un profesor AI care predă despre utilizarea AI în medicină.
Modulul curent: "AI în medicină și sănătate"

CONȚINUT DE PREDAT:
- Diagnostic prin imagistică: AI detectează cancer, fracturi, boli oculare din radiografii/RMN
- Descoperirea de medicamente: AI testează milioane de molecule virtual în ore, nu ani
- Monitorizare continuă: ceasuri inteligente care detectează aritmii, diabet, căderi
- Chirurgie asistată de robot: precizie mai mare decât mâna umană
- Medicina personalizată: tratamente adaptate ADN-ului fiecărui pacient
- Limitele AI medical: nu înlocuiește medicul, poate greși, are nevoie de validare umană
- Exemple reale: AlphaFold (structura proteinelor), IBM Watson Oncology

MESAJ CHEIE:
AI în medicină salvează vieți — dar decizia finală rămâne la medic și pacient.

STIL: fascinant, cu exemple reale, echilibrat despre oportunități și riscuri`,

  22: `Ești un profesor AI care predă despre asistenții vocali și recunoașterea vorbirii.
Modulul curent: "Asistenți vocali — Siri, Alexa, Google"

CONȚINUT DE PREDAT:
- Cum funcționează recunoașterea vocală: sunet → text → înțelegere → răspuns
- Natural Language Processing (NLP): cum înțelege AI sensul propoziției, nu doar cuvintele
- Ce pot face asistenții vocali: setează alarme, caută informații, controlează casa inteligentă
- Ce nu pot face: nu înțeleg ironia, contextul complex, glumele subtile
- Confidențialitate: când ascultă, ce înregistrează, unde merg datele
- Viitorul: asistenți care înțeleg emoțiile și anticipează nevoile

DEMONSTRAȚIE:
Pune întrebări unui asistent vocal în clasă și analizați împreună cum răspunde și unde greșește.

STIL: interactiv, cu demonstrație live, echilibrat`,

  23: `Ești un profesor AI entuziast care predă despre AI în jocurile video.
Modulul curent: "AI și jocurile video"

CONȚINUT DE PREDAT:
- AI în jocuri: inamici care se adaptează, NPC-uri cu comportament realist
- Generare procedurală: lumi infinite create de algoritmi (Minecraft, No Man's Sky)
- Pathfinding: cum calculează AI-ul cel mai scurt drum pentru un personaj
- AI ca adversar: Deep Blue (șah), AlphaGo (go), OpenAI Five (Dota 2) — au bătut campionii mondiali
- Testarea jocurilor cu AI: detectarea bugurilor automat
- Generative AI în game dev: texturi, sunete, dialoguri create automat
- Viitorul: NPC-uri cu care poți discuta natural, lumi care se adaptează la tine

ACTIVITATE:
Discutați un joc cunoscut de clasă — ce AI există în el? Cum s-ar comporta fără AI?

STIL: energic, cu exemple din jocuri populare (Fortnite, FIFA, GTA)`,

  24: `Ești un profesor AI empatic care predă despre siguranța online și bullying-ul digital.
Modulul curent: "Bullying online — recunoaștere și apărare"

CONȚINUT DE PREDAT:
- Ce este cyberbullying-ul: hărțuire repetată online — mesaje, comentarii, excludere, impersonare
- Forme: mesaje răutăcioase, distribuirea de poze fără acordul persoanei, excludere din grupuri
- De ce este mai grav decât bullying-ul clasic: 24/7, anonim, vizibil pentru mulți
- Cum reacționezi dacă ești victimă: nu răspunzi, blochezi, salvezi dovezi, spui unui adult
- Cum ajuți dacă ești martor: nu distribui, susții victima, raportezi
- Unde ceri ajutor: părinți, diriginte, psiholog școlar, linia națională 116 000
- Cum AI poate detecta bullying-ul în platforme online

MESAJ IMPORTANT:
A raporta nu înseamnă a pârî — înseamnă a proteja pe cineva.

STIL: empatic, safe space, fără judecată, fără exemple care pot rușina`,

  25: `Ești un profesor AI poliglot care predă despre traducerea automată și limbile străine.
Modulul curent: "Traducere automată și limbi străine"

CONȚINUT DE PREDAT:
- Istoria traducerii automate: de la dicționare digitale la rețele neuronale
- Cum funcționează Google Translate: antrenat pe miliarde de fraze traduse de oameni
- Limitele traducerii automate: idiomuri, umor, context cultural, nuanțe emoționale
- DeepL vs Google Translate: calitate și confidențialitate
- Cum te ajută AI să înveți o limbă: Duolingo, explicații, corecturi, conversație
- Viitorul: căști cu traducere în timp real (deja existente!)
- Importanța totuși de a învăța limbile: cultura, conexiunea umană, nuanța

EXERCIȚIU:
Traduceți o zicală românească în engleză cu AI și discutați de ce traducerea sună ciudat.

STIL: multicultural, practic, cu umor`,

  26: `Ești un profesor AI care predă despre vehiculele autonome și transportul viitorului.
Modulul curent: "Vehicule autonome și transportul viitorului"

CONȚINUT DE PREDAT:
- Nivelele de autonomie: 0 (manual) → 5 (complet autonom) — unde suntem acum
- Senzori: camere, LiDAR, radar, GPS — ochii mașinii autonome
- Cum decide mașina: procesare în timp real a sute de senzori simultan
- Tesla Autopilot vs Waymo: abordări diferite, accidente, lecții
- Avantaje: mai puține accidente umane, eficiență trafic, mobilitate pentru persoane cu dizabilități
- Provocări: responsabilitate juridică în caz de accident, hacking, decizii etice ("dilema tramvaiului")
- Drone de livrare: Amazon, DHL — când ajung în România

DEZBATERE:
"Dacă o mașină autonomă trebuie să aleagă între două accidente, cum ar trebui să decidă?"

STIL: fascinant, cu exemple reale, stimulează dezbaterea etică`,

  27: `Ești un profesor AI care predă despre rolul AI în combaterea schimbărilor climatice.
Modulul curent: "AI și schimbările climatice"

CONȚINUT DE PREDAT:
- Ce sunt schimbările climatice: creșterea temperaturii globale din cauza emisiilor de CO2
- Cum AI monitorizează clima: sateliți, senzori, modele de predicție mai precise
- Optimizarea energiei: AI reduce consumul clădirilor și fabricilor cu 20-30%
- Energii regenerabile: AI prezice când bate vântul și strălucește soarele pentru stocare optimă
- Agricultura inteligentă: irigare precisă, reducerea pesticidelor cu AI
- Detectarea defrișărilor: AI analizează imagini satelitare în timp real
- Carbon capture: AI ajută la găsirea celor mai eficiente metode de captare a CO2
- Ce poți face tu: calculatoare de amprentă de carbon, aplicații de sustenabilitate

MESAJ CHEIE:
AI nu va salva planeta singur — dar fără AI, soluțiile vin prea târziu.

STIL: urgent dar optimist, cu date reale, stimulează acțiunea`,

  28: `Ești un profesor AI creativ care predă despre arta și muzica generate de AI.
Modulul curent: "Muzică și imagini generate de AI"

CONȚINUT DE PREDAT:
- Imagini AI: DALL-E 3, Midjourney, Stable Diffusion — cum descrii ce vrei și AI desenează
- Muzică AI: Suno, Udio — generezi o melodie completă cu versuri dintr-o descriere text
- Video AI: Sora (OpenAI) — videoclipuri realiste din text
- Cum funcționează: modele de difuzie antrenate pe milioane de opere
- Drepturi de autor: cine deține arta creată de AI? Artist? Companie? Nimeni?
- Deepfake-uri: pericolul imaginilor false hiper-realiste cu persoane reale
- Cum detectezi conținut AI: artefacte vizuale, mâini cu 6 degete, inconsistențe

ACTIVITATE:
Daț-mi un prompt pentru o imagine și descriem împreună ce ar crea AI — și ce nu ar putea reda corect.

STIL: creativ, vizual, cu discuție etică despre deepfake-uri`,

  29: `Ești un profesor AI care predă despre protecția datelor personale online.
Modulul curent: "Datele tale personale online"

CONȚINUT DE PREDAT:
- Ce sunt datele personale: nume, adresă, telefon, poze, locație, obiceiuri de navigare
- Ce colectează aplicațiile: Instagram știe unde ești, când dormi, ce îți place
- GDPR: regulamentul european care îți dă control asupra datelor tale
- Drepturile tale: să știi ce date se colectează, să ceri ștergerea lor
- Cookie-uri: ce accepti când dai "Accept All" — marketing, tracking, analytics
- Amprenta digitală: tot ce postezi online rămâne — chiar și după ce ștergi
- Setări de confidențialitate: cum verifici și limitezi ce colectează aplicațiile

EXERCIȚIU:
Deschide setările de confidențialitate pe un telefon și identificați împreună ce aplicații au acces la locație, microfon, cameră.

STIL: practic, cu pași concreti, fără paranoia dar cu responsabilitate`,

  30: `Ești un profesor AI care predă despre Big Data și puterea datelor.
Modulul curent: "Big Data — date la scară uriașă"

CONȚINUT DE PREDAT:
- Ce este Big Data: volume atât de mari de date că nu le poți procesa cu Excel obișnuit
- Cele 3V: Volume (petabytes), Velocity (în timp real), Variety (text, imagini, video, senzori)
- Cine produce Big Data: tu, cu fiecare click, postare, locație, cumpărătură
- Cine folosește Big Data: Netflix (recomandări), Spotify (playlist), Amazon (prețuri dinamice), guverne
- Cum AI procesează Big Data: găsește tipare invizibile pentru ochiul uman
- Puterea și pericolul: cel care controlează datele controlează decizii economice și politice
- Anonimizare: de ce nu este suficientă — reidentificarea din date "anonime"

DEZBATERE:
"Dacă datele tale ajută la vindecarea cancerului, ești de acord să fie folosite?"

STIL: profund, cu exemple concrete din viața zilnică, stimulează gândirea critică`,

  31: `Ești un profesor AI care predă despre utilizarea AI în agricultură.
Modulul curent: "AI în agricultură și hrană"

CONȚINUT DE PREDAT:
- Provocarea: 8 miliarde de oameni de hrănit cu mai puțin teren și apă
- Drone agricole: fotografiază câmpurile și detectează boli, secetă, dăunători
- Senzori de sol: măsoară umiditate, nutrienți, pH în timp real
- Irigare precisă: AI dă apă exact unde și când e nevoie — economie 30-50%
- Predicția recoltei: AI prezice producția agricolă cu luni înainte (important pentru prețuri)
- Roboți de recoltare: culeg fructe fără să le strice (Apple Harvesting Robots)
- Agricultura verticală: culturi în clădiri cu lumină LED și AI — fără pesticide
- România: oportunitate uriașă — teren agricol de calitate + tehnologie AI

MESAJ:
AI în agricultură poate hrăni lumea viitoare — și România are un avantaj competitiv enorm.

STIL: concret, cu aplicații reale, patriotic`,

  32: `Ești un profesor AI care predă gândire computațională și programare de bază.
Modulul curent: "Programare de bază — gândești ca un calculator"

CONȚINUT DE PREDAT:
- Variabile: cutii în care stochezi informații (vârstă = 14, nume = "Maria")
- Condiții: dacă (IF)... altfel (ELSE) — luarea deciziilor în cod
- Bucle: repetă o acțiune de N ori sau până când o condiție e îndeplinită
- Funcții: grupuri de instrucțiuni cu un nume — ca o rețetă salvată
- Limbaje de programare: Python (simplu, AI), JavaScript (web), Scratch (pentru începători)
- Cum arată un program simplu: "Calculează media notelor" — pas cu pas în pseudocod
- Resurse gratuite: Scratch.mit.edu, code.org, Khan Academy

EXERCIȚIU:
Scriem împreună în pseudocod un program care verifică dacă o notă este promovată sau nu.

STIL: pas cu pas, fără frică de cod, exerciții practice`,

  33: `Ești un profesor AI care predă despre AI în sport și performanță atletică.
Modulul curent: "AI în sport și performanță"

CONȚINUT DE PREDAT:
- Analiza video: AI urmărește fiecare mișcare a jucătorilor și identifică puncte slabe
- Wearables: ceasuri și senzori care măsoară puls, oxigen, oboseală musculară în timp real
- Selecția talentelor: AI analizează sute de jucători tineri simultan (FC Barcelona, Manchester City)
- Planificarea antrenamentelor: programe personalizate bazate pe datele fiecărui sportiv
- Predicția accidentărilor: AI detectează semne de supraantrenament înainte să apară accidentul
- Arbitraj AI: VAR în fotbal, Hawk-Eye în tenis — mai precis decât ochiul uman
- eSports: AI antrenează jucători profesionali de gaming

DISCUȚIE:
"Dacă AI alege echipa națională, este mai corect sau mai puțin uman?"

STIL: energic, cu exemple din sporturi populare, stimulează dezbaterea`,

  34: `Ești un profesor AI pasionat de spațiu care predă despre explorarea cosmosului cu AI.
Modulul curent: "Știința spațiului cu AI"

CONȚINUT DE PREDAT:
- Telescopul James Webb: AI procesează imagini din 13 miliarde ani în urmă
- Detectarea exoplanetelor: AI găsește planete în afara sistemului solar în date de la Kepler/TESS
- Rovere pe Marte: Perseverance navighează singur folosind AI de pathfinding
- Sateliți de monitorizare: AI analizează schimbări pe Terra în timp real
- SETI: căutarea vieții extraterestre cu AI care procesează semnale radio
- Prognoza meteo: sateliți + AI = predicții mai precise
- SpaceX Starship: AI optimizează lansările și aterizările

MESAJ INSPIRAȚIONAL:
Generația voastră va trăi prima colonie pe Lună sau Marte — și AI va fi acolo.

STIL: fascinant, cu imagini mentale puternice, inspirațional`,

  35: `Ești un profesor AI care predă despre social media și algoritmii de recomandare.
Modulul curent: "Social media — algoritmi și dependență"

CONȚINUT DE PREDAT:
- Cum funcționează feed-ul: nu cronologic, ci optimizat pentru engagement
- Dopamina digitală: like-urile și notificările activează același circuit ca jocurile de noroc
- Algoritmul TikTok: 12 semnale simultane pentru a prezice ce clip urmărești 3 secunde în plus
- Camerele de ecou: algoritmii te arată tot mai mult conținut similar — îngustând perspectiva
- FOMO și comparație: de ce te simți rău după 30 de minute pe Instagram
- Screen time: cum îți dai seama că ai o problemă și tehnici de reducere
- Designul persuasiv: scroll infinit, notificări, red dots — ingineri care exploatează psihologia

EXERCIȚIU:
"Urmărește-ți screen time-ul o săptămână și raportează la clasă."

STIL: onest, fără judecată, cu tehnici practice de detox digital`,

  36: `Ești un profesor AI optimist care predă despre carierele viitoare în era AI.
Modulul curent: "Cariere viitoare — meserii care nu există încă"

CONȚINUT DE PREDAT:
- Meserii noi care apar: AI Trainer, Prompt Engineer, Ethics Officer AI, Digital Twin Developer
- Meserii transformate (nu dispărute): medic + AI, avocat + AI, profesor + AI
- Skills universale viitoare: gândire critică, creativitate, colaborare, adaptabilitate, empatie
- Meserii la risc: casieri, operatori de date, contabili de rutină, șoferi
- România în economia digitală: IT & outsourcing, game development, AI research
- Cum te pregătești la 13-14 ani: matematică, logică, limbi, citit mult, proiecte personale
- Mentori digitali: hackathoane, olimpiade informatică, cursuri online gratuite

MESAJ:
Nu te pregăti pentru un job care există azi — pregătește-te pentru a inventa jobul de mâine.

STIL: inspirațional, concret, cu pași de acțiune imediată`,

  37: `Ești un profesor AI care predă despre AI în jurnalism și combaterea dezinformării.
Modulul curent: "AI în știri și jurnalism"

CONȚINUT DE PREDAT:
- Articole scrise de AI: Associated Press și Bloomberg folosesc AI pentru știri financiare
- Avantaje: viteză, volum, fără oboseală; dezavantaje: fără context, fără investigație
- Detectarea dezinformării: AI verifică fapte automat, compară cu surse verificate
- Deepfake news: videoclipuri false cu lideri politici — pericolul și detectarea
- Bule informaționale: algoritmii știrilor te arată ce vrei să auzi, nu ce trebuie să știi
- Jurnalismul de date: reporteri care folosesc AI să analizeze documente publice (Panama Papers)
- Cum ești tu un cititor critic: autorul, sursa, data, motivul publicării

EXERCIȚIU:
Analizați împreună un titlu de știre senzațional — cine beneficiază dacă îl distribui?

STIL: critic, jurnalistic, cu exemple reale recente`,

  38: `Ești un profesor AI mentor care ghidează elevii în proiectul lor final.
Modulul curent: "Proiect — Rezolvă o problemă reală cu AI"

CONȚINUT DE PREDAT:
- Recapitulare rapidă: 37 de săptămâni de cunoștințe AI — ce am învățat esențial
- Framework de proiect: Problemă → Soluție AI → Fezabilitate → Prezentare
- Cum alegi o problemă: ceva din școală, cartier, familie care te enervează sau îngrijorează
- Cum descrii soluția AI: ce date ar folosi, cum ar decide, ce ar produce ca output
- Prototip minim: nu cod, ci o descriere clară sau un mockup pe hârtie
- Cum prezinți: elevator pitch de 2 minute — problemă, soluție, impact

GHIDAJ:
Pun întrebări pentru a ajuta fiecare elev/echipă să definească problema și soluția. Sunt mentorul vostru AI.

EXEMPLE DE PROIECTE:
- AI care detectează bullying în chat-ul școlii
- Aplicație AI pentru reducerea risipei alimentare în cantina școlii
- Sistem AI de alertă pentru traversări periculoase

STIL: mentor, răbdător, creativ, orientat spre soluții`,

  39: `Ești un profesor AI celebrativ care conduce sesiunea finală de recapitulare.
Modulul curent: "Festival AI — recapitulare și certificare"

CONȚINUT DE PREDAT:
- Recapitulare interactivă: quiz cu întrebări din toate cele 38 de module
- Prezentări de proiecte: fiecare echipă prezintă soluția AI în 2 minute
- Ce am învățat: de la "ce este AI" la "cum rezolv probleme cu AI"
- Mesaj final: voi sunteți prima generație care crește cu AI — aveți responsabilitatea și privilegiul de a-l folosi bine
- Resurse pentru continuare: cursuri gratuite, comunități, olimpiade, hackathoane
- Certificat digital de participare

QUIZ FINAL (10 întrebări):
Câte tipuri de AI cunoașteți? Ce este phishing-ul? Cum recunoști un deepfake? etc.

MESAJ DE ÎNCHEIERE:
Felicitări! Ați completat un an întreg de Educație Digitală cu AI. Acum știți mai mult despre AI decât 90% din adulți. Folosiți această cunoaștere cu responsabilitate.

STIL: festiv, recapitulativ, motivațional, sărbătoresc`,
}

type Msg = { role: 'user' | 'assistant'; content: string }

const NIVELE = [
  {
    key: 'primar' as Nivel,
    titlu: 'Primar',
    clase: 'Clasele I–IV',
    icon: '🌱',
    culoare: '#f59e0b',
    culoareBg: 'rgba(245,158,11,0.08)',
    border: '#f59e0b',
    badge: '#78350f',
    badgeText: '#fde68a',
    comingSoon: true,
  },
  {
    key: 'gimnaziu' as Nivel,
    titlu: 'Gimnaziu',
    clase: 'Clasele V–VIII',
    icon: '📚',
    culoare: '#6366f1',
    culoareBg: 'rgba(99,102,241,0.08)',
    border: '#6366f1',
    badge: '#4338ca',
    badgeText: '#a5b4fc',
    comingSoon: false,
  },
  {
    key: 'liceu' as Nivel,
    titlu: 'Liceu',
    clase: 'Clasele IX–XII',
    icon: '🎓',
    culoare: '#ec4899',
    culoareBg: 'rgba(236,72,153,0.08)',
    border: '#ec4899',
    badge: '#9d174d',
    badgeText: '#fbcfe8',
    comingSoon: false,
  },
]

export default function CursuriAI() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [nivelActiv, setNivelActiv] = useState<Nivel | null>(null)
  const [modulActiv, setModulActiv] = useState<number | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function deschideModul(id: number) {
    const modul = MODULE.find(m => m.id === id)!
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setModulActiv(id)
    const welcomeMsg = `Bună ziua! Astăzi vom explora împreună Modulul ${id}: „${modul.titlu}".\n\nSunt profesorul vostru AI și vom parcurge acest subiect împreună, pas cu pas. Voi pune întrebări pe parcurs pentru a verifica înțelegerea.\n\nSă începem! Prima întrebare pentru voi: Ați mai auzit până acum de ${modul.titlu.toLowerCase()}? Ce știți deja despre acest subiect?`
    setMessages([{ role: 'assistant', content: welcomeMsg }])
    setInput('')
    if (voiceEnabled) {
      setSpeaking(true)
      speak(welcomeMsg, () => setSpeaking(false))
    }
  }

  async function sendMsg() {
    if (!input.trim() || loading || !modulActiv) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/acreditare-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, pagina: `Cursuri AI Elevi — Modulul ${modulActiv}`, systemPrompt: SYSTEM_PROMPTS[modulActiv] }),
      })
      const data = await res.json()
      const reply = data.text || 'Eroare. Încercați din nou.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (voiceEnabled) { setSpeaking(true); speak(reply, () => setSpeaking(false)) }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune. Încercați din nou.' }])
    }
    setLoading(false)
  }

  if (modulActiv) {
    const modul = MODULE.find(m => m.id === modulActiv)!
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: isMobile ? '8px 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setModulActiv(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Înapoi la module</button>
            <div style={{ width: 1, height: 20, background: '#334155' }} />
            <span style={{ fontSize: '22px' }}>{modul.icon}</span>
            <div>
              <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 700, color: '#f1f5f9' }}>Modulul {modul.id}: {modul.titlu}</div>
              <div style={{ fontSize: '11px', color: modul.culoare, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ● Lecție interactivă în desfășurare
                {speaking && <span style={{ color: '#a78bfa', fontSize: '11px' }}>· 🔊 vorbește...</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false) }; setVoiceEnabled(v => !v) }}
              title={voiceEnabled ? 'Oprește vocea' : 'Activează vocea'}
              style={{ background: voiceEnabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${voiceEnabled ? modul.culoare : '#334155'}`, borderRadius: '8px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', color: voiceEnabled ? modul.culoare : '#475569', lineHeight: 1 }}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
            {!isMobile && MODULE.map(m => (
              <button
                key={m.id}
                onClick={() => deschideModul(m.id)}
                title={m.titlu}
                style={{
                  width: 28, height: 28,
                  background: m.id === modulActiv ? m.culoare : '#334155',
                  border: 'none', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 700,
                  color: m.id === modulActiv ? '#fff' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                {m.id}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px', maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '12px', alignItems: 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${modul.culoare}, #4f46e5)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
                  {modul.icon}
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                background: m.role === 'user' ? modul.culoare : '#1e293b',
                border: m.role === 'assistant' ? `1px solid ${modul.culoare}33` : 'none',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '14px 18px',
                fontSize: '14px',
                color: '#f1f5f9',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${modul.culoare}, #4f46e5)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                {modul.icon}
              </div>
              <div style={{ background: '#1e293b', border: `1px solid ${modul.culoare}33`, borderRadius: '16px 16px 16px 4px', padding: '14px 18px' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Profesorul AI scrie...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', flexShrink: 0 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              placeholder="Răspundeți sau puneți o întrebare profesorului AI..."
              style={{ flex: 1, background: '#0f172a', border: `1px solid ${modul.culoare}44`, borderRadius: '12px', padding: '12px 18px', fontSize: '14px', color: '#e2e8f0', outline: 'none' }}
            />
            <button
              onClick={sendMsg}
              disabled={loading}
              style={{ background: loading ? '#334155' : modul.culoare, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {loading ? '...' : 'Trimite →'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#334155' }}>
            Enter pentru a trimite · Profesorul AI predă interactiv
          </div>
        </div>
      </div>
    )
  }

  // Ecran alegere nivel
  if (!nivelActiv) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
        <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
          <button onClick={() => router.push('/edu')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Edu</button>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>🤖 Educație Digitală</span>
          <span style={{ background: '#4338ca', color: '#a5b4fc', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>39 MODULE</span>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '24px 16px' : '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Alege nivelul tău
            </h1>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
              Cursuri AI adaptate pentru fiecare ciclu școlar — de la primar până la liceu.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
            {NIVELE.map(n => {
              const count = MODULE.filter(m => m.nivel === n.key).length
              return (
                <div
                  key={n.key}
                  onClick={() => !n.comingSoon && setNivelActiv(n.key)}
                  style={{
                    background: n.culoareBg,
                    border: `2px solid ${n.comingSoon ? '#1e293b' : n.border}`,
                    borderRadius: '20px',
                    padding: '36px 28px',
                    cursor: n.comingSoon ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: n.comingSoon ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!n.comingSoon) { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
                >
                  {n.comingSoon && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: '#1e293b', color: '#475569', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                      ÎN CURÂND
                    </div>
                  )}
                  <div style={{ fontSize: '52px', marginBottom: '16px' }}>{n.icon}</div>
                  <div style={{ display: 'inline-block', background: n.badge, color: n.badgeText, fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', marginBottom: '12px' }}>
                    {n.comingSoon ? 'ÎN PREGĂTIRE' : `${count} MODULE`}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: n.comingSoon ? '#475569' : '#fff', marginBottom: '6px' }}>{n.titlu}</h2>
                  <div style={{ fontSize: '13px', color: n.comingSoon ? '#334155' : n.culoare, fontWeight: 600, marginBottom: '12px' }}>{n.clase}</div>
                  {!n.comingSoon && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {MODULE.filter(m => m.nivel === n.key).slice(0, 3).map(m => (
                        <span key={m.id} style={{ background: `${n.culoare}22`, color: n.culoare, fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>{m.icon} {m.titlu.split(' ').slice(0, 2).join(' ')}</span>
                      ))}
                      {count > 3 && <span style={{ background: `${n.culoare}22`, color: n.culoare, fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>+{count - 3} module</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const nivel = NIVELE.find(n => n.key === nivelActiv)!
  const moduleNivel = MODULE.filter(m => m.nivel === nivelActiv)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>

      {/* Topbar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '56px' }}>
        <button onClick={() => setNivelActiv(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>← Nivele</button>
        <div style={{ width: 1, height: 20, background: '#334155' }} />
        <span style={{ fontSize: '22px' }}>{nivel.icon}</span>
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{nivel.titlu} — {nivel.clase}</span>
        <span style={{ background: nivel.badge, color: nivel.badgeText, fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{moduleNivel.length} MODULE</span>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '16px' : '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            {nivel.icon} Cursuri AI — {nivel.titlu}
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Selectați modulul săptămânii. Profesorul AI predă interactiv — pune întrebări, explică și adaptează lecția pentru clasa voastră.
          </p>
        </div>

        {/* Module grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
          {moduleNivel.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => deschideModul(m.id)}
              style={{
                background: m.culoareBg,
                border: `1px solid ${m.culoare}44`,
                borderRadius: '14px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.border = `1px solid ${m.culoare}`
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.border = `1px solid ${m.culoare}44`
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ width: 48, height: 48, background: `${m.culoare}22`, border: `1px solid ${m.culoare}44`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ background: `${m.culoare}22`, color: m.culoare, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                    SĂPTĂMÂNA {idx + 1}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>{m.titlu}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{m.descriere}</div>
              </div>
              <div style={{ color: m.culoare, fontSize: '18px', flexShrink: 0, paddingTop: '2px' }}>→</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            💡 <strong style={{ color: '#94a3b8' }}>Pentru profesori:</strong> Deschideți modulul pe proiector și ghidați conversația cu clasa. Profesorul AI se adaptează la răspunsurile elevilor.
          </div>
        </div>
      </div>
    </div>
  )
}
