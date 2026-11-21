alter table public.jobs add column result jsonb;
comment on column public.jobs.result is 'Output of a finished job, e.g. {"path": "<org_id>/<job_id>.zip", "format": "images_zip"} for exports.';
