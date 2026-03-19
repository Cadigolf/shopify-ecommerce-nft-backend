-- ============================================================
-- Row Level Security
-- ============================================================
-- The backend uses the service role key, which bypasses RLS
-- automatically. Enabling RLS with no public policies means
-- all access is blocked except via the service role — which
-- is exactly what we want since the frontends never call
-- Supabase directly.
--
-- If direct frontend Supabase access is ever added, user-level
-- policies and Privy JWKS config in Supabase Auth settings
-- will be needed at that point.
-- ============================================================

alter table public.users   enable row level security;
alter table public.tokens  enable row level security;
