insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('templates', 'templates', false, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('certificates', 'certificates', false, 10485760, array['image/png']),
  ('exports', 'exports', false, 524288000, array['application/zip', 'application/pdf'])
on conflict (id) do nothing;

-- Object keys start with the org id: <org_id>/...
create function private.storage_org_id(object_name text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select case
    when split_part(object_name, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then split_part(object_name, '/', 1)::uuid
  end;
$$;
grant execute on function private.storage_org_id(text) to authenticated;

create policy "members read org templates" on storage.objects
  for select to authenticated
  using (bucket_id = 'templates' and private.is_org_member(private.storage_org_id(name)));

create policy "admins upload org templates" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'templates'
    and private.has_org_role(private.storage_org_id(name), array['owner', 'admin']::public.org_role[])
  );

create policy "admins replace org templates" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'templates'
    and private.has_org_role(private.storage_org_id(name), array['owner', 'admin']::public.org_role[])
  );

create policy "admins delete org templates" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'templates'
    and private.has_org_role(private.storage_org_id(name), array['owner', 'admin']::public.org_role[])
  );

-- Only the worker (service role) writes certificates and exports.
create policy "members read org certificates and exports" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('certificates', 'exports')
    and private.is_org_member(private.storage_org_id(name))
  );
