create table public.events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 200),
  issuer_name text not null check (char_length(issuer_name) between 2 and 100),
  event_date date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (id, org_id)
);
comment on table public.events is 'An event that issues certificates. Soft delete keeps old verify links working.';

create table public.fonts (
  family text primary key,
  category text not null check (category in ('sans', 'serif', 'script', 'display', 'mono')),
  is_system boolean not null default false,
  render_family text not null
);
comment on table public.fonts is 'Fonts that the editor and both renderers support.';
comment on column public.fonts.render_family is 'Font the server renders with. Differs from family only for system fonts that cannot be bundled.';

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  event_id uuid not null unique,
  image_path text not null,
  image_width integer not null check (image_width > 0),
  image_height integer not null check (image_height > 0),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, org_id),
  unique (id, event_id),
  foreign key (event_id, org_id) references public.events (id, org_id) on delete cascade
);
comment on table public.templates is 'The background image of an event certificate.';
comment on column public.templates.image_path is 'Object key in the templates storage bucket: <org_id>/<template_id>.<ext>.';

create table public.template_fields (
  template_id uuid not null references public.templates (id) on delete cascade,
  field_key public.field_key not null,
  x numeric not null check (x >= 0),
  y numeric not null check (y >= 0),
  width numeric not null check (width > 0),
  height numeric not null check (height > 0),
  font_family text not null default 'Inter' references public.fonts (family) on update cascade,
  font_weight public.font_weight not null default 'normal',
  font_style public.font_style not null default 'normal',
  text_decoration public.text_decoration not null default 'none',
  color text not null default '#000000' check (color ~ '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$'),
  primary key (template_id, field_key)
);
comment on table public.template_fields is 'One box on a template. Positions are natural image pixels.';

create trigger set_updated_at before update on public.events
  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.templates
  for each row execute function private.set_updated_at();
