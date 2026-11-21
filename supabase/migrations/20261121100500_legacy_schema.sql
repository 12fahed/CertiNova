create schema legacy;
revoke all on schema legacy from public, anon, authenticated;
comment on schema legacy is 'MongoDB migration data. Not exposed to API roles.';

create table legacy.id_map (
  collection text not null,
  mongo_id text not null,
  new_id uuid not null,
  migrated_at timestamptz not null default now(),
  primary key (collection, mongo_id),
  unique (collection, new_id)
);
comment on table legacy.id_map is 'Maps each MongoDB _id to its new uuid, so the migration can run again safely.';

create table legacy.encrypted_batches (
  batch_id uuid primary key references public.batches (id) on delete cascade,
  encrypted_data text,
  salt text,
  iv text,
  created_at timestamptz not null default now(),
  unlocked_at timestamptz,
  -- Blob fields are cleared on unlock; the row stays to track unlock progress.
  check (
    (unlocked_at is null and encrypted_data is not null and salt is not null and iv is not null)
    or (unlocked_at is not null and encrypted_data is null and salt is null and iv is null)
  )
);
comment on table legacy.encrypted_batches is 'Old recipient lists encrypted with the user password (AES-256-CBC, PBKDF2-SHA256).';
