begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

-- Org A: owner, admin, member. Org B: owner (the outsider).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner@a.com'),
  ('00000000-0000-0000-0000-0000000000a2', 'admin@a.com'),
  ('00000000-0000-0000-0000-0000000000a3', 'member@a.com'),
  ('00000000-0000-0000-0000-0000000000b1', 'owner@b.com');
insert into public.organizations (id, name, slug) values
  ('10000000-0000-0000-0000-00000000000a', 'Org A', 'org-a'),
  ('10000000-0000-0000-0000-00000000000b', 'Org B', 'org-b');
insert into public.organization_members (org_id, user_id, role) values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-0000000000a1', 'owner'),
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-0000000000a2', 'admin'),
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-0000000000a3', 'member'),
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-0000000000b1', 'owner');
insert into public.events (id, org_id, name, issuer_name) values
  ('20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', 'Hackathon', 'Dean');
insert into public.templates (id, org_id, event_id, image_path, image_width, image_height) values
  ('30000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a',
   '20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a/t.png', 2000, 1414);
insert into public.batches (id, org_id, event_id, template_id) values
  ('40000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a',
   '20000000-0000-0000-0000-00000000000a', '30000000-0000-0000-0000-00000000000a');
insert into public.certificates (id, org_id, batch_id, recipient_name, recipient_email, rank) values
  ('50000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a',
   '40000000-0000-0000-0000-00000000000a', 'Aarav Sharma', 'aarav@example.com', '1st');

create function pg_temp.login_as(p_user_id uuid) returns void language sql as $$
  select set_config('role', 'authenticated', true),
         set_config('request.jwt.claims', json_build_object('sub', p_user_id, 'role', 'authenticated')::text, true);
$$;

-- Member of org A
select pg_temp.login_as('00000000-0000-0000-0000-0000000000a3');
select is((select count(*)::int from public.events), 1, 'a member reads own org events');
select is((select count(*)::int from public.certificates), 1, 'a member reads own org certificates');
select throws_ok(
  $$ insert into public.events (org_id, name, issuer_name)
     values ('10000000-0000-0000-0000-00000000000a', 'Gala', 'Dean') $$,
  '42501', null,
  'a member cannot create events'
);
select lives_ok(
  $$ insert into public.certificates (org_id, batch_id, recipient_name)
     values ('10000000-0000-0000-0000-00000000000a', '40000000-0000-0000-0000-00000000000a', 'New Person') $$,
  'a member can add certificates to own org'
);

-- Admin of org A
select pg_temp.login_as('00000000-0000-0000-0000-0000000000a2');
select lives_ok(
  $$ insert into public.events (org_id, name, issuer_name)
     values ('10000000-0000-0000-0000-00000000000a', 'Gala', 'Dean') $$,
  'an admin can create events'
);
select throws_ok(
  $$ update public.organization_members set role = 'owner'
     where user_id = '00000000-0000-0000-0000-0000000000a3' $$,
  '42501', null,
  'an admin cannot grant the owner role'
);
update public.organization_members set role = 'member'
  where user_id = '00000000-0000-0000-0000-0000000000a1';
select is(
  (select role::text from public.organization_members where user_id = '00000000-0000-0000-0000-0000000000a1'),
  'owner',
  'an admin cannot change an owner row'
);

-- Owner of org B (outsider)
select pg_temp.login_as('00000000-0000-0000-0000-0000000000b1');
select is((select count(*)::int from public.events), 0, 'an outsider sees no events of another org');
select is((select count(*)::int from public.certificates), 0, 'an outsider sees no certificates of another org');
select is((select count(*)::int from public.profiles), 1, 'an outsider sees only own profile');
select throws_ok(
  $$ insert into public.certificates (org_id, batch_id, recipient_name)
     values ('10000000-0000-0000-0000-00000000000a', '40000000-0000-0000-0000-00000000000a', 'Intruder') $$,
  '42501', null,
  'an outsider cannot add certificates to another org'
);

-- Anonymous verify
select set_config('role', 'anon', true), set_config('request.jwt.claims', '{"role": "anon"}', true);
select results_eq(
  $$ select recipient_name, rank, is_revoked from public.verify_certificate('50000000-0000-0000-0000-00000000000a') $$,
  $$ values ('Aarav Sharma'::text, '1st'::text, false) $$,
  'anonymous verify shows the name by default'
);
select is((select count(*)::int from public.certificates), 0, 'anonymous cannot read certificates directly');

reset role;
update public.organizations set show_name_on_verify = false where id = '10000000-0000-0000-0000-00000000000a';
set local role anon;
select is(
  (select recipient_name from public.verify_certificate('50000000-0000-0000-0000-00000000000a')),
  null,
  'verify hides the name when the org turns it off'
);

select * from finish();
rollback;
