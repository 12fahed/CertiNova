-- Hasura enforces its own permissions (it connects as postgres, which bypasses RLS).
-- These policies mirror them for direct supabase-js access.

create function private.shares_org_with(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members me
    join public.organization_members them on them.org_id = me.org_id
    where me.user_id = (select auth.uid()) and them.user_id = p_user_id
  );
$$;
grant execute on function private.shares_org_with(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invites enable row level security;
alter table public.events enable row level security;
alter table public.fonts enable row level security;
alter table public.templates enable row level security;
alter table public.template_fields enable row level security;
alter table public.batches enable row level security;
alter table public.certificates enable row level security;
alter table public.email_deliveries enable row level security;
alter table public.jobs enable row level security;
alter table public.feature_flags enable row level security;
alter table public.audit_log enable row level security;

-- profiles
create policy "read own and teammates" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or private.shares_org_with(id));
create policy "update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- organizations (created and deleted by the API with the service role)
create policy "members read" on public.organizations
  for select to authenticated
  using (private.is_org_member(id));
create policy "admins update" on public.organizations
  for update to authenticated
  using (private.has_org_role(id, '{owner,admin}'))
  with check (private.has_org_role(id, '{owner,admin}'));

-- organization_members: only owners grant or change the owner role
create policy "members read" on public.organization_members
  for select to authenticated
  using (private.is_org_member(org_id));
create policy "admins add" on public.organization_members
  for insert to authenticated
  with check (
    private.has_org_role(org_id, '{owner,admin}')
    and (role <> 'owner' or private.has_org_role(org_id, '{owner}'))
  );
create policy "admins change" on public.organization_members
  for update to authenticated
  using (
    private.has_org_role(org_id, '{owner,admin}')
    and (role <> 'owner' or private.has_org_role(org_id, '{owner}'))
  )
  with check (role <> 'owner' or private.has_org_role(org_id, '{owner}'));
create policy "admins remove or self leave" on public.organization_members
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    or (
      private.has_org_role(org_id, '{owner,admin}')
      and (role <> 'owner' or private.has_org_role(org_id, '{owner}'))
    )
  );

-- organization_invites
create policy "admins manage" on public.organization_invites
  for all to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'))
  with check (private.has_org_role(org_id, '{owner,admin}'));

-- events and templates: members read, admins write
create policy "members read" on public.events
  for select to authenticated
  using (private.is_org_member(org_id));
create policy "admins write" on public.events
  for all to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'))
  with check (private.has_org_role(org_id, '{owner,admin}'));

create policy "members read" on public.templates
  for select to authenticated
  using (private.is_org_member(org_id));
create policy "admins write" on public.templates
  for all to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'))
  with check (private.has_org_role(org_id, '{owner,admin}'));

create policy "members read" on public.template_fields
  for select to authenticated
  using (exists (
    select 1 from public.templates t
    where t.id = template_id and private.is_org_member(t.org_id)
  ));
create policy "admins write" on public.template_fields
  for all to authenticated
  using (exists (
    select 1 from public.templates t
    where t.id = template_id and private.has_org_role(t.org_id, '{owner,admin}')
  ))
  with check (exists (
    select 1 from public.templates t
    where t.id = template_id and private.has_org_role(t.org_id, '{owner,admin}')
  ));

-- fonts: reference data
create policy "everyone reads" on public.fonts
  for select to anon, authenticated
  using (true);

-- batches and certificates: members create, admins change or delete
create policy "members read" on public.batches
  for select to authenticated
  using (private.is_org_member(org_id));
create policy "members create" on public.batches
  for insert to authenticated
  with check (private.is_org_member(org_id));
create policy "admins delete" on public.batches
  for delete to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'));

create policy "members read" on public.certificates
  for select to authenticated
  using (private.is_org_member(org_id));
create policy "members create" on public.certificates
  for insert to authenticated
  with check (private.is_org_member(org_id));
create policy "admins revoke" on public.certificates
  for update to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'))
  with check (private.has_org_role(org_id, '{owner,admin}'));
create policy "admins delete" on public.certificates
  for delete to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'));

-- worker-owned tables: read only
create policy "members read" on public.email_deliveries
  for select to authenticated
  using (private.is_org_member(org_id));
create policy "members read" on public.jobs
  for select to authenticated
  using (private.is_org_member(org_id));

create policy "read global and own org" on public.feature_flags
  for select to authenticated
  using (org_id is null or private.is_org_member(org_id));

create policy "admins read" on public.audit_log
  for select to authenticated
  using (private.has_org_role(org_id, '{owner,admin}'));
