-- ============================================================================
-- ARACIP · Schema Supabase pentru Formare Profesională (Activitățile A.2 / A.3)
-- Rulează acest script în Supabase → SQL Editor → New query → Run.
-- Toate tabelele folosesc jsonb pentru detalii + timestamp cu fus orar.
-- ============================================================================

-- Progres E-Learning (cursuri finalizate, procent) — comun formabil + evaluator
create table if not exists formare_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,            -- identificator utilizator (nume/email introdus la login sau session id)
  role         text not null,            -- 'formabil' | 'evaluator' | 'admin'
  progress     integer not null default 0,  -- procent 0..100
  details      jsonb not null default '{}'::jsonb,  -- ex: { "cursuri": { "curs-1": true, ... } }
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (user_id, role)
);

-- Rapoarte Simulare Autoevaluare Instituțională (RAEI) — Activitatea A.2 (formabil)
create table if not exists autoevaluare_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  role         text not null default 'formabil',
  scor         numeric,                  -- scor de pregătire (opțional)
  details      jsonb not null default '{}'::jsonb,  -- calificative, unitate, etc.
  created_at   timestamptz not null default now()
);

-- Rapoarte Simulare Evaluare Externă — Activitatea A.3 (evaluator extern)
create table if not exists evaluare_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  role         text not null default 'evaluator',
  scor         numeric,
  details      jsonb not null default '{}'::jsonb,  -- grile, dovezi, decizie ARACIP simulată
  created_at   timestamptz not null default now()
);

-- Arhivă documente ARA (inspector național) — text extras din PDF/Word/txt pentru RAG chatbot
create table if not exists ara_archive (
  id           uuid primary key default gen_random_uuid(),
  titlu        text not null,
  tip          text not null default 'Altele',        -- 'PDF' | 'Word' | 'Text' | 'Altele'
  descriere    text,
  uploaded_by  text not null default 'Inspector Național',
  judet        text not null default 'national',
  text_content text not null default '',               -- text integral extras (max 100k)
  text_preview text not null default '',               -- primele 300 caractere
  size         integer not null default 0,             -- dimensiune fișier în bytes
  created_at   timestamptz not null default now()
);

-- Indexuri utile pentru citire pe utilizator / rol
create index if not exists idx_formare_progress_user on formare_progress (user_id, role);
create index if not exists idx_autoevaluare_user     on autoevaluare_reports (user_id);
create index if not exists idx_evaluare_user         on evaluare_reports (user_id);
create index if not exists idx_ara_archive_created   on ara_archive (created_at desc);

-- ============================================================================
-- Row Level Security
-- Scrierea/citirea se face DOAR server-side cu SERVICE ROLE KEY (care ocolește RLS).
-- Activăm RLS și NU adăugăm politici publice, deci anon key nu poate accesa datele.
-- ============================================================================
alter table formare_progress    enable row level security;
alter table autoevaluare_reports enable row level security;
alter table evaluare_reports     enable row level security;
alter table ara_archive          enable row level security;

-- ============================================================================
-- LANȚUL CALITĂȚII LIVE · Depuneri reale de la unități (Școală → ISJ → ARACIP)
-- O unitate își depune autoevaluarea/RAEI; datele curg instant la ISJ (județ)
-- și la ARACIP (agregat național), toate din aceeași tabelă.
-- ============================================================================
create table if not exists unitati_calitate (
  id                     uuid primary key default gen_random_uuid(),
  nume_unitate           text not null,
  judet                  text not null,
  tip_unitate            text not null default 'Școală',       -- Grădiniță | Școală | Gimnaziu | Liceu | Colegiu | Special | Alt tip
  localitate             text,
  status                 text not null default 'autoevaluare_depusa', -- autoevaluare_depusa | in_evaluare | acreditat | periodica
  calificativ_general    text,                                  -- Nesatisfăcător | Satisfăcător | Bine | Foarte bine | Excelent (nullable)
  calificative_domenii   jsonb not null default '{}'::jsonb,    -- { "A": "Bine", "B": "Excelent", "C": "Satisfăcător" }
  calificative_indicatori jsonb not null default '{}'::jsonb,   -- { "I1": "...", ... } (opțional, I1..I24)
  rezumat                text,
  contact_email          text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists idx_unitati_judet    on unitati_calitate (judet);
create index if not exists idx_unitati_status   on unitati_calitate (status);
create index if not exists idx_unitati_created  on unitati_calitate (created_at desc);

alter table unitati_calitate     enable row level security;

-- ============================================================================
-- GDPR · Cereri „dreptul la ștergere" (art. 17 GDPR)
-- Persoana vizată depune o cerere din /confidentialitate/stergere.
-- Scrierea se face DOAR server-side (service role key ocolește RLS).
-- ============================================================================
create table if not exists cereri_stergere (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,                       -- adresa de e-mail a titularului datelor
  motiv        text,                                -- motivul cererii (opțional)
  status       text not null default 'noua',        -- 'noua' | 'in_lucru' | 'rezolvata' | 'respinsa'
  ip           text,                                -- IP-ul cererii (minimal, pentru audit/anti-abuz)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_cereri_stergere_created on cereri_stergere (created_at desc);
create index if not exists idx_cereri_stergere_status  on cereri_stergere (status);

alter table cereri_stergere       enable row level security;

-- ============================================================================
-- RAEI generate de directori (Generator RAEI din Portal Director) → dashboard ARACIP
-- Fiecare RAEI generat se salvează aici și apare live în tabloul central.
-- ============================================================================
create table if not exists raei_generate (
  id            uuid primary key default gen_random_uuid(),
  nume_unitate  text not null,
  judet         text,
  localitate    text,
  nivel         text,
  an_scolar     text,
  nr_elevi      integer,
  details       jsonb not null default '{}'::jsonb,  -- rezultate, personal, dotare, CEAC, obiective, dificultăți
  created_at    timestamptz not null default now()
);

create index if not exists idx_raei_created on raei_generate (created_at desc);
create index if not exists idx_raei_judet   on raei_generate (judet);

alter table raei_generate         enable row level security;

-- ============================================================================
-- Cereri de AUTORIZARE de funcționare provizorie (fondatori de unități noi)
-- Depuse din /acreditare/autorizare → apar la ARACIP (Inspector) și ISJ (județ).
-- Conform HG 994/2020 + procedura ARACIP.
-- ============================================================================
create table if not exists cereri_autorizare (
  id             uuid primary key default gen_random_uuid(),
  nr_inregistrare text not null,
  denumire       text not null,
  tip_solicitant text default 'noua',   -- 'noua' | 'existenta' (nivel/specializare nouă)
  cui            text,
  judet          text,
  adresa         text,
  reprezentant   text,
  nivel          text,
  profil         text,
  capacitate     integer,
  sali           integer,
  suprafata      integer,
  documente      jsonb not null default '[]'::jsonb,  -- [{ nume, url }]
  email          text,                                 -- contact solicitant (cheie de urmărire)
  telefon        text,
  status         text not null default 'depusa',       -- depusa | in_analiza | autorizat | respinsa
  motiv          text,                                 -- motivul deciziei (ex. la respingere)
  decizie_at     timestamptz,                          -- când a decis ARACIP
  created_at     timestamptz not null default now()
);

create index if not exists idx_cereri_aut_created on cereri_autorizare (created_at desc);
create index if not exists idx_cereri_aut_judet   on cereri_autorizare (judet);

alter table cereri_autorizare     enable row level security;

-- Migrare pentru baze existente (idempotent):
alter table cereri_autorizare add column if not exists email      text;
alter table cereri_autorizare add column if not exists telefon    text;
alter table cereri_autorizare add column if not exists motiv      text;
alter table cereri_autorizare add column if not exists decizie_at timestamptz;

-- ============================================================================
-- Cereri de ACREDITARE și EVALUARE PERIODICĂ (unități autorizate/acreditate)
-- Depuse de director din Portalul Director → ISJ + ARACIP → decizie ARACIP.
-- ============================================================================
create table if not exists cereri_evaluare (
  id             uuid primary key default gen_random_uuid(),
  nr_inregistrare text not null,
  tip            text not null default 'acreditare',  -- 'acreditare' | 'evaluare_periodica'
  denumire       text not null,
  cui            text,
  judet          text,
  nivel          text,
  calificativ    text,                                 -- autoevaluare (pt evaluare periodică)
  documente      jsonb not null default '[]'::jsonb,
  email          text,                                 -- contact director (notificări)
  status         text not null default 'depusa',        -- depusa | in_analiza | aprobat | respinsa
  motiv          text,                                 -- motivul deciziei (ex. la respingere)
  decizie_at     timestamptz,                          -- când a decis ARACIP
  created_at     timestamptz not null default now()
);

create index if not exists idx_cereri_eval_created on cereri_evaluare (created_at desc);
create index if not exists idx_cereri_eval_judet   on cereri_evaluare (judet);
create index if not exists idx_cereri_eval_tip     on cereri_evaluare (tip);

-- Migrare pentru baze existente (idempotent):
alter table cereri_evaluare add column if not exists email      text;
alter table cereri_evaluare add column if not exists motiv      text;
alter table cereri_evaluare add column if not exists decizie_at timestamptz;

alter table cereri_evaluare       enable row level security;

-- ============================================================================
-- Evaluări gratuite de conformitate NIS2 / ISO 27001 (NEWTIME CONCEPT SOLUTIONS)
-- Completate public de firme prospectate pe /evaluare-nis2. Nu au legatura cu ARACIP.
-- ============================================================================
create table if not exists evaluari_nis2 (
  id          uuid primary key default gen_random_uuid(),
  firma       text not null,
  cui         text,
  contact     text not null,
  email       text not null,
  raspunsuri  jsonb not null default '{}'::jsonb,  -- toate raspunsurile brute din formular
  status      text not null default 'noua',        -- noua | contactat | trimisa_oferta | client
  created_at  timestamptz not null default now()
);

create index if not exists idx_eval_nis2_created on evaluari_nis2 (created_at desc);

alter table evaluari_nis2 enable row level security;
