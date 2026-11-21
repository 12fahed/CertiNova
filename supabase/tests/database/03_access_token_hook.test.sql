begin;
create extension if not exists pgtap with schema extensions;
select plan(4);

select is(
  private.custom_access_token_hook(
    '{"user_id": "a0000000-0000-4000-8000-000000000009", "claims": {"role": "authenticated", "sub": "a0000000-0000-4000-8000-000000000009"}}'
  ) -> 'claims' -> 'https://hasura.io/jwt/claims',
  '{"x-hasura-default-role": "user", "x-hasura-allowed-roles": ["user"], "x-hasura-user-id": "a0000000-0000-4000-8000-000000000009"}'::jsonb,
  'the hook adds Hasura claims for the user'
);

select is(
  private.custom_access_token_hook(
    '{"user_id": "a0000000-0000-4000-8000-000000000009", "claims": {"role": "authenticated", "aal": "aal1"}}'
  ) -> 'claims' ->> 'aal',
  'aal1',
  'the hook keeps the existing claims'
);

select ok(
  has_function_privilege('supabase_auth_admin', 'private.custom_access_token_hook(jsonb)', 'execute'),
  'supabase auth can run the hook'
);

select ok(
  not has_function_privilege('authenticated', 'private.custom_access_token_hook(jsonb)', 'execute'),
  'api users cannot run the hook'
);

select * from finish();
rollback;
