create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 200),
  email extensions.citext not null check (private.is_valid_email(email)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'One row per Supabase Auth user.';

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 64),
  show_name_on_verify boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.organizations is 'A team that issues certificates.';
comment on column public.organizations.show_name_on_verify is 'Show the recipient name on the public verify page.';

create table public.organization_members (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.org_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
comment on table public.organization_members is 'Links users to organisations with a role.';

create table public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email extensions.citext not null check (private.is_valid_email(email)),
  role public.org_role not null default 'member' check (role <> 'owner'),
  token_hash text not null unique,
  invited_by uuid references public.profiles (id) on delete set null,
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
comment on table public.organization_invites is 'Open invites to join an organisation. Only the token hash is stored.';

create trigger set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.organizations
  for each row execute function private.set_updated_at();

-- Keep profiles in step with auth.users.
create function private.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_saved
  after insert or update of email on auth.users
  for each row execute function private.sync_profile_from_auth();

-- Every organisation must keep at least one owner.
create function private.guard_last_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.role = 'owner'
     and (tg_op = 'DELETE' or new.role <> 'owner')
     and exists (select 1 from public.organizations o where o.id = old.org_id)
     and not exists (
       select 1 from public.organization_members m
       where m.org_id = old.org_id and m.role = 'owner' and m.user_id <> old.user_id
     ) then
    raise exception 'organization % must keep at least one owner', old.org_id
      using errcode = 'check_violation';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger guard_last_owner
  before update of role or delete on public.organization_members
  for each row execute function private.guard_last_owner();

-- Membership helpers for RLS and storage policies.
create function private.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members
    where org_id = p_org_id and user_id = (select auth.uid())
  );
$$;

create function private.has_org_role(p_org_id uuid, p_roles public.org_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members
    where org_id = p_org_id and user_id = (select auth.uid()) and role = any (p_roles)
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid, public.org_role[]) to authenticated;
