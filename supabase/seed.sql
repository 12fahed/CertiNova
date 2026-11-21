-- Local dev data only (supabase db reset). Every user's password: password123

with users (id, email, full_name) as (
  values
    ('a0000000-0000-4000-8000-000000000001'::uuid, 'owner@certinova.local', 'Olivia Owner'),
    ('a0000000-0000-4000-8000-000000000002'::uuid, 'admin@certinova.local', 'Adam Admin'),
    ('a0000000-0000-4000-8000-000000000003'::uuid, 'member@certinova.local', 'Maya Member')
)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email,
  extensions.crypt('password123', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}', jsonb_build_object('full_name', full_name), now(), now(),
  '', '', '', ''
from users;

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), id, id::text, 'email',
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), now(), now(), now()
from auth.users
where email like '%@certinova.local';

insert into public.organizations (id, name, slug) values
  ('b0000000-0000-4000-8000-000000000001', 'Demo University', 'demo-university');

insert into public.organization_members (org_id, user_id, role) values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'owner'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'admin'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'member');

insert into public.events (id, org_id, name, issuer_name, event_date, created_by) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001',
   'Spring Hackathon 2026', 'Dr. Meera Iyer', '2026-04-18', 'a0000000-0000-4000-8000-000000000001');

insert into public.templates (id, org_id, event_id, image_path, image_width, image_height, created_by) values
  ('d0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001',
   'c0000000-0000-4000-8000-000000000001',
   'b0000000-0000-4000-8000-000000000001/d0000000-0000-4000-8000-000000000001.png', 2000, 1414,
   'a0000000-0000-4000-8000-000000000001');

insert into public.template_fields (template_id, field_key, x, y, width, height, font_family, font_weight, color) values
  ('d0000000-0000-4000-8000-000000000001', 'recipient_name', 500, 620, 1000, 140, 'Great Vibes', 'normal', '#1f2a44'),
  ('d0000000-0000-4000-8000-000000000001', 'rank', 800, 800, 400, 80, 'Montserrat', 'bold', '#b08d2e'),
  ('d0000000-0000-4000-8000-000000000001', 'organisation_name', 600, 950, 800, 70, 'Inter', 'normal', '#333333'),
  ('d0000000-0000-4000-8000-000000000001', 'certificate_qr', 1700, 1150, 200, 200, 'Inter', 'normal', '#000000');

insert into public.batches (id, org_id, event_id, template_id, status, recipient_count, has_rank, created_by) values
  ('e0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001',
   'c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001',
   'ready', 3, true, 'a0000000-0000-4000-8000-000000000002');

insert into public.certificates (id, org_id, batch_id, recipient_name, recipient_email, rank, render_status) values
  ('f0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001',
   'e0000000-0000-4000-8000-000000000001', 'Aarav Sharma', 'aarav@example.com', '1st', 'done'),
  ('f0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001',
   'e0000000-0000-4000-8000-000000000001', 'Diya Patel', 'diya@example.com', '2nd', 'done'),
  ('f0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001',
   'e0000000-0000-4000-8000-000000000001', 'Kabir Rao', null, '3rd', 'done');

insert into public.feature_flags (key, enabled) values ('email-certificates', false);
