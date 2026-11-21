create extension if not exists citext with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.org_role as enum ('owner', 'admin', 'member');
create type public.field_key as enum (
  'recipient_name', 'organisation_name', 'rank', 'certificate_link', 'certificate_qr'
);
create type public.font_weight as enum ('normal', 'bold');
create type public.font_style as enum ('normal', 'italic');
create type public.text_decoration as enum ('none', 'underline');
create type public.batch_status as enum ('draft', 'queued', 'rendering', 'ready', 'failed');
create type public.render_status as enum ('pending', 'done', 'failed');
create type public.delivery_status as enum ('queued', 'sent', 'failed');
create type public.job_kind as enum ('render', 'export', 'email', 'legacy_unlock');
create type public.job_status as enum ('queued', 'running', 'done', 'failed');

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function private.is_valid_email(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$';
$$;
