begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

-- Fixtures: two orgs, one owner each.
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.com', '{"full_name": "Owner A"}'),
  ('00000000-0000-0000-0000-00000000000b', 'b@example.com', '{}');
insert into public.organizations (id, name, slug) values
  ('10000000-0000-0000-0000-00000000000a', 'Org A', 'org-a'),
  ('10000000-0000-0000-0000-00000000000b', 'Org B', 'org-b');
insert into public.organization_members (org_id, user_id, role) values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 'owner'),
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000b', 'owner');
insert into public.events (id, org_id, name, issuer_name) values
  ('20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', 'Hackathon', 'Dean');
insert into public.templates (id, org_id, event_id, image_path, image_width, image_height) values
  ('30000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a',
   '20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a/t.png', 2000, 1414);

select is((select count(*)::int from public.fonts), 50, 'all legacy fonts are seeded');

select is(
  (select full_name from public.profiles where id = '00000000-0000-0000-0000-00000000000a'),
  'Owner A',
  'auth signup creates a profile'
);

update auth.users set email = 'a2@example.com' where id = '00000000-0000-0000-0000-00000000000a';
select is(
  (select email::text from public.profiles where id = '00000000-0000-0000-0000-00000000000a'),
  'a2@example.com',
  'auth email change updates the profile'
);

select throws_ok(
  $$ insert into public.batches (org_id, event_id, template_id) values
     ('10000000-0000-0000-0000-00000000000b', '20000000-0000-0000-0000-00000000000a',
      '30000000-0000-0000-0000-00000000000a') $$,
  '23503', null,
  'a batch cannot use an event from another organisation'
);

select lives_ok(
  $$ insert into public.batches (id, org_id, event_id, template_id) values
     ('40000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a',
      '20000000-0000-0000-0000-00000000000a', '30000000-0000-0000-0000-00000000000a') $$,
  'a batch in the same organisation is accepted'
);

select throws_ok(
  $$ insert into public.certificates (org_id, batch_id, recipient_name) values
     ('10000000-0000-0000-0000-00000000000b', '40000000-0000-0000-0000-00000000000a', 'X') $$,
  '23503', null,
  'a certificate cannot point to a batch of another organisation'
);

select throws_ok(
  $$ insert into public.template_fields (template_id, field_key, x, y, width, height, color) values
     ('30000000-0000-0000-0000-00000000000a', 'recipient_name', 0, 0, 10, 10, 'red') $$,
  '23514', null,
  'field colour must be a hex code'
);

select throws_ok(
  $$ delete from public.organization_members
     where org_id = '10000000-0000-0000-0000-00000000000a'
       and user_id = '00000000-0000-0000-0000-00000000000a' $$,
  '23514', null,
  'the last owner cannot leave'
);

select throws_ok(
  $$ update public.organization_members set role = 'admin'
     where org_id = '10000000-0000-0000-0000-00000000000a'
       and user_id = '00000000-0000-0000-0000-00000000000a' $$,
  '23514', null,
  'the last owner cannot be demoted'
);

select lives_ok(
  $$ delete from public.organizations where id = '10000000-0000-0000-0000-00000000000b' $$,
  'deleting an organisation cascades past the owner guard'
);

insert into public.audit_log (org_id, action, entity) values
  ('10000000-0000-0000-0000-00000000000a', 'create', 'event');
select throws_ok(
  $$ update public.audit_log set action = 'edit' $$,
  '42501', null,
  'audit log rows cannot be changed'
);

select throws_ok(
  $$ insert into legacy.encrypted_batches (batch_id, encrypted_data, salt, iv, unlocked_at) values
     ('40000000-0000-0000-0000-00000000000a', 'ff', 'aa', 'bb', now()) $$,
  '23514', null,
  'an unlocked legacy row cannot keep its encrypted blob'
);

insert into public.feature_flags (key, enabled) values ('email-certificates', false);
insert into public.feature_flags (key, org_id, enabled) values
  ('email-certificates', '10000000-0000-0000-0000-00000000000a', true);
select ok(
  public.feature_enabled('email-certificates', '10000000-0000-0000-0000-00000000000a')
  and not public.feature_enabled('email-certificates', null),
  'an org feature flag overrides the global value'
);

select * from finish();
rollback;
