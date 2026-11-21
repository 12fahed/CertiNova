create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  org_id uuid references public.organizations (id) on delete cascade,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (key, org_id)
);
comment on table public.feature_flags is 'Feature switches. A null org_id is the global value; an org row overrides it.';

create table public.audit_log (
  id bigint generated always as identity primary key,
  org_id uuid references public.organizations (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  data jsonb not null default '{}',
  at timestamptz not null default now()
);
comment on table public.audit_log is 'Append-only record of important changes.';

create trigger set_updated_at before update on public.feature_flags
  for each row execute function private.set_updated_at();

create function private.forbid_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% is append-only', tg_table_name using errcode = 'insufficient_privilege';
end;
$$;

create trigger audit_log_append_only before update on public.audit_log
  for each row execute function private.forbid_change();

create function public.feature_enabled(p_key text, p_org_id uuid default null)
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select enabled from public.feature_flags where key = p_key and org_id = p_org_id),
    (select enabled from public.feature_flags where key = p_key and org_id is null),
    false
  );
$$;
comment on function public.feature_enabled is 'Org value if set, else the global value, else false.';
