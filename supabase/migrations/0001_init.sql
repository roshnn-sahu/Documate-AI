-- ============================================================================
-- Documate AI — initial schema (run in Supabase SQL editor)
-- Multi-user, Row-Level Security, pgvector for 2048-dim embeddings.
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists vector;

-- Tables ---------------------------------------------------------------------

-- 1:1 with auth.users, auto-provisioned by the trigger below.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text default 'New chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists chat_sessions_user_idx
  on public.chat_sessions (user_id, updated_at desc);

create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('user','assistant')),
  content    text not null,
  sources    jsonb,
  created_at timestamptz default now()
);
create index if not exists chat_messages_session_idx
  on public.chat_messages (session_id, created_at);

create table if not exists public.documents (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  session_id           uuid references public.chat_sessions(id) on delete set null,
  file_name            text not null,
  mime_type            text,
  size_bytes           bigint,
  cloudinary_url       text,
  cloudinary_public_id text,
  extracted_text       text,
  chunk_count          int default 0,
  is_favourite         boolean default false,
  created_at           timestamptz default now()
);
create index if not exists documents_user_idx
  on public.documents (user_id, created_at desc);

-- LangChain SupabaseVectorStore backing table.
-- Column names (content, embedding, metadata) are required by the library.
-- vector(2048) with NO ANN index: brute-force KNN, always filtered to one
-- user+session via metadata, so the candidate set is tiny.
create table if not exists public.document_chunks (
  id        uuid primary key default gen_random_uuid(),
  content   text,
  metadata  jsonb,
  embedding vector(2048)
);
create index if not exists document_chunks_metadata_idx
  on public.document_chunks using gin (metadata);

-- match_documents RPC --------------------------------------------------------
-- Param names (query_embedding, match_count, filter) are the exact contract
-- SupabaseVectorStore calls. `filter` is jsonb-containment matched.
create or replace function public.match_documents (
  query_embedding vector(2048),
  match_count int default 4,
  filter jsonb default '{}'
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    dc.id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  where dc.metadata @> filter
  order by dc.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Row-Level Security ---------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.chat_sessions   enable row level security;
alter table public.chat_messages   enable row level security;
alter table public.documents       enable row level security;
alter table public.document_chunks enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own sessions" on public.chat_sessions;
create policy "own sessions" on public.chat_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own messages" on public.chat_messages;
create policy "own messages" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own documents" on public.documents;
create policy "own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Chunks are gated via the user_id stamped into metadata at insert time.
drop policy if exists "own chunks" on public.document_chunks;
create policy "own chunks" on public.document_chunks
  for all
  using ((metadata->>'user_id')::uuid = auth.uid())
  with check ((metadata->>'user_id')::uuid = auth.uid());

-- Auto-provision a profile row on signup ------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
