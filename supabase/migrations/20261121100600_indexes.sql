-- Foreign keys and org-scoped reads.
create index organization_members_user_id_idx on public.organization_members (user_id);
create index organization_invites_org_id_idx on public.organization_invites (org_id);
create unique index organization_invites_pending_email_idx
  on public.organization_invites (org_id, email) where accepted_at is null;

create index events_org_id_idx on public.events (org_id, event_date desc) where deleted_at is null;
create index events_created_by_idx on public.events (created_by);

create index templates_org_id_idx on public.templates (org_id);
create index template_fields_font_family_idx on public.template_fields (font_family);

create index batches_org_id_idx on public.batches (org_id, created_at desc);
create index batches_event_id_idx on public.batches (event_id, created_at desc);
create index batches_template_id_idx on public.batches (template_id);

create index certificates_org_id_idx on public.certificates (org_id, created_at desc);
create index certificates_batch_id_idx on public.certificates (batch_id);
create index certificates_recipient_name_trgm_idx
  on public.certificates using gin (recipient_name extensions.gin_trgm_ops);
create index certificates_recipient_email_trgm_idx
  on public.certificates using gin ((recipient_email::text) extensions.gin_trgm_ops);

create index email_deliveries_certificate_id_idx on public.email_deliveries (certificate_id);
create index email_deliveries_org_status_idx on public.email_deliveries (org_id, status);

create index jobs_org_id_idx on public.jobs (org_id, created_at desc);
create index jobs_ref_id_idx on public.jobs (ref_id);

create index feature_flags_org_id_idx on public.feature_flags (org_id);

create index audit_log_org_id_idx on public.audit_log (org_id, at desc);
create index audit_log_entity_idx on public.audit_log (entity, entity_id);

create index encrypted_batches_locked_idx on legacy.encrypted_batches (batch_id) where unlocked_at is null;
