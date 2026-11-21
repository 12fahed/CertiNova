-- Supabase Auth calls this before it signs each access token.
-- Hasura reads its claims from the https://hasura.io/jwt/claims namespace.
create function private.custom_access_token_hook(event jsonb)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'claims',
    (event -> 'claims') || jsonb_build_object(
      'https://hasura.io/jwt/claims',
      jsonb_build_object(
        'x-hasura-default-role', 'user',
        'x-hasura-allowed-roles', jsonb_build_array('user'),
        'x-hasura-user-id', event ->> 'user_id'
      )
    )
  );
$$;
comment on function private.custom_access_token_hook is 'Supabase Auth custom access token hook: adds Hasura claims.';

grant usage on schema private to supabase_auth_admin;
grant execute on function private.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function private.custom_access_token_hook(jsonb) from public, anon, authenticated;
