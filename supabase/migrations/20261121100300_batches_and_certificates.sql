create table public.batches (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  event_id uuid not null,
  template_id uuid not null,
  status public.batch_status not null default 'draft',
  recipient_count integer not null default 0 check (recipient_count >= 0),
  has_rank boolean not null default false,
  template_snapshot jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, org_id),
  foreign key (event_id, org_id) references public.events (id, org_id) on delete cascade,
  foreign key (template_id, event_id) references public.templates (id, event_id) on delete cascade
);
comment on table public.batches is 'One generation run for an event.';
comment on column public.batches.template_snapshot is 'Template image and fields at render time, so later template edits do not change issued certificates.';

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  batch_id uuid not null,
  recipient_name text check (char_length(recipient_name) between 1 and 200),
  recipient_email extensions.citext check (private.is_valid_email(recipient_email)),
  rank text check (char_length(rank) between 1 and 100),
  file_path text,
  render_status public.render_status not null default 'pending',
  revoked_at timestamptz,
  revoked_reason text check (char_length(revoked_reason) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, org_id),
  foreign key (batch_id, org_id) references public.batches (id, org_id) on delete cascade,
  check (revoked_reason is null or revoked_at is not null)
);
comment on table public.certificates is 'One certificate for one recipient. The id is the public verify UUID.';
comment on column public.certificates.recipient_name is 'Null only for migrated certificates whose data is still locked.';
comment on column public.certificates.file_path is 'Object key in the certificates storage bucket: <org_id>/<batch_id>/<id>.png.';

create table public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  certificate_id uuid not null,
  email extensions.citext not null check (private.is_valid_email(email)),
  status public.delivery_status not null default 'queued',
  attempts integer not null default 0 check (attempts >= 0),
  error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (certificate_id, org_id) references public.certificates (id, org_id) on delete cascade
);
comment on table public.email_deliveries is 'One email send for one certificate.';

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  kind public.job_kind not null,
  status public.job_status not null default 'queued',
  progress integer not null default 0 check (progress >= 0),
  total integer not null default 0 check (total >= 0),
  ref_id uuid,
  error text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  check (progress <= total)
);
comment on table public.jobs is 'Long work done by the worker. The app subscribes to progress.';
comment on column public.jobs.ref_id is 'The batch the job works on, when it has one.';

create trigger set_updated_at before update on public.batches
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.certificates
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.email_deliveries
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.jobs
  for each row execute function private.set_updated_at();
