-- ============================================================
-- Shopify E-commerce NFT Platform — Supabase Schema
-- ============================================================
-- To apply: paste into the Supabase SQL editor and run.
--
-- PENDING SECURITY CHANGES (tracked in issue #2):
--   - `users.privatekey` column to be dropped once Privy
--     embedded wallets are integrated
--   - `users.password` column to be hashed with bcrypt
--     before storing (currently plaintext)
-- ============================================================


-- ------------------------------------------------------------
-- users
-- Stores customer accounts, Solana wallets, and NFT history.
-- ------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  fullname    text,
  password    text,                        -- TODO issue #2: store bcrypt hash, not plaintext
  walletaddress text,                      -- Solana public key
  privatekey  text,                        -- TODO issue #2: drop this column once Privy is integrated
  orderid     text,                        -- Shopify order ID
  history     jsonb default '[]'::jsonb,  -- array of NFT purchase objects (see note below)
  username    text,
  country     text,
  interests   jsonb default '[]'::jsonb,
  avatar      text,                        -- URL to profile image
  updated_at  timestamptz
);

-- Index for the most common lookup pattern
create index if not exists users_email_idx on public.users (email);
create index if not exists users_orderid_idx on public.users (orderid);

-- history array element shape (for reference, not enforced by DB):
-- {
--   id:          string   -- Shopify line item ID
--   title:       string   -- product title (truncated to 10 chars)
--   description: string   -- product name
--   image:       string   -- product image URL
--   symbol:      "USD"
--   price:       string
--   quantity:    number
--   mintAddress: string   -- Solana NFT mint address
--   buyDate:     string   -- ISO 8601 timestamp
-- }


-- ------------------------------------------------------------
-- tokens
-- Event log for NFT operations (mints, transfers, etc.)
-- ------------------------------------------------------------
create table if not exists public.tokens (
  id        uuid primary key default gen_random_uuid(),
  event     text not null,       -- e.g. "mint", "transfer", "metadata_upload"
  metadata  jsonb,               -- arbitrary event payload
  created_at timestamptz default now()
);

create index if not exists tokens_event_idx on public.tokens (event);
