create view public.org_stats
with (security_invoker = true)
as
select
  o.id as org_id,
  (select count(*) from public.events e where e.org_id = o.id and e.deleted_at is null) as events_count,
  (select count(*) from public.batches b where b.org_id = o.id) as batches_count,
  (select count(*) from public.certificates c where c.org_id = o.id) as certificates_count,
  (select max(b.created_at) from public.batches b where b.org_id = o.id) as last_batch_at
from public.organizations o;
comment on view public.org_stats is 'Live counts per organisation. Replaces the old Record collection.';

create function public.verify_certificate(p_certificate_id uuid)
returns table (
  certificate_id uuid,
  organisation_name text,
  issuer_name text,
  event_name text,
  event_date date,
  issued_at timestamptz,
  recipient_name text,
  rank text,
  is_revoked boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id,
    o.name,
    e.issuer_name,
    e.name,
    e.event_date,
    c.created_at,
    case when o.show_name_on_verify then c.recipient_name end,
    case when o.show_name_on_verify then c.rank end,
    (c.revoked_at is not null or e.deleted_at is not null)
  from public.certificates c
  join public.batches b on b.id = c.batch_id
  join public.events e on e.id = b.event_id
  join public.organizations o on o.id = c.org_id
  where c.id = p_certificate_id;
$$;
comment on function public.verify_certificate is 'Public verify lookup. Never returns the email. Hides the name when the organisation turns it off.';

revoke execute on function public.verify_certificate(uuid) from public;
grant execute on function public.verify_certificate(uuid) to anon, authenticated, service_role;

create function public.search_certificates(p_org_id uuid, p_query text)
returns setof public.certificates
language sql
stable
set search_path = ''
as $$
  with q as (
    select '%' || replace(replace(replace(p_query, '\', '\\'), '%', '\%'), '_', '\_') || '%' as pattern
  )
  select c.*
  from public.certificates c, q
  where c.org_id = p_org_id
    and (c.recipient_name ilike q.pattern or c.recipient_email::text ilike q.pattern)
  order by c.created_at desc;
$$;
comment on function public.search_certificates is 'Case-insensitive search on recipient name and email within one organisation.';
