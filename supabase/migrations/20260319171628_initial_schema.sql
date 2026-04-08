-- ============================================================
-- Shopify E-commerce NFT Platform — Supabase Schema
-- ============================================================
-- Auth and user profile data (name, avatar, country, etc.)
-- are managed by Privy. Supabase stores only what Privy
-- doesn't own: wallet address, order linkage, and NFT history.
-- ============================================================


-- ------------------------------------------------------------
-- users
-- Links a Privy-authenticated user (by email) to their
-- Solana wallet and NFT purchase history.
-- ------------------------------------------------------------
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  walletaddress text,        -- Solana public key
  orderid       text,        -- Shopify order ID
  history       jsonb default '[]'::jsonb,  -- array of NFT purchase objects
  updated_at    timestamptz
);

create index if not exists users_email_idx   on public.users (email);
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
  id         uuid primary key default gen_random_uuid(),
  event      text not null,       -- e.g. "mint", "transfer"
  metadata   jsonb,               -- arbitrary event payload
  created_at timestamptz default now()
);

create index if not exists tokens_event_idx on public.tokens (event);
