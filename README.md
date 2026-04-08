# HubsAI Minting Engine — Backend

Express.js REST API that handles Shopify webhooks, mints NFTs on Solana via Metaplex, and stores user/order data in Supabase.

## Prerequisites

- Node.js 21+
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (`brew install supabase/tap/supabase`)

## Setup

```bash
npm install
cp .example.env .env
# fill in .env values (see Environment Variables below)
```

## Running

```bash
npm run dev      # dev server with hot reload (nodemon + ts-node)
npm run build    # compile TypeScript → dist/
npm run start    # run compiled output (production)
```

Server runs on port 1001 by default.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 1001) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_USER_KEY` | Supabase secret (service role) key |
| `SUPABASE_DB_PASSWORD` | Supabase database password |
| `SOLANA_RPC_URL` | Solana RPC endpoint |
| `SOLANA_WALLET_PRIVATEKEY` | Platform treasury wallet private key (pays for minting) |
| `RESEND_API_KEY` | Resend transactional email API key |
| `RESEND_FROM` | From address for emails |
| `PINATA_API_KEY` | Pinata IPFS API key |
| `PINATA_SECRET_API_KEY` | Pinata IPFS secret key |
| `SHOPIFY_SHOP_NAME` | Shopify store name |
| `SHOPIFY_ACCESS_TOKEN` | Shopify Admin API access token |
| `SHOPIFY_WEBHOOK_SECRET` | Webhook signing secret (from Shopify Partner dashboard → App → Webhooks) |
| `PRIVY_APP_ID` | Privy app ID |
| `PRIVY_VERIFICATION_KEY` | Privy PEM public key for JWT verification (from Privy dashboard → App Settings → Verification key) |
| `USER_SITE_URL` | User frontend URL (used in NFT email notifications) |

## Database Migrations

Schema changes are tracked with the Supabase CLI. All migrations live in `supabase/migrations/` and are committed to the repo.

### First-time setup

You need the Supabase CLI installed and authenticated:

```bash
brew install supabase/tap/supabase
supabase login   # opens browser — log in with geoff+3@smittyworks.com
```

Link to the remote project:

```bash
supabase link --project-ref kluecvsnihbtqvwpwkyr
# enter the DB password when prompted (see SUPABASE_DB_PASSWORD in .env)
```

Verify local and remote are in sync:

```bash
supabase migration list
# Local and Remote columns should match
```

### Making a schema change

**Never edit the database directly in the Supabase dashboard.** Always go through a migration so the change is tracked in version control.

```bash
# 1. Create a new migration file
supabase migration new <descriptive_name>
# e.g. supabase migration new add_rls_policies

# 2. Edit the generated file in supabase/migrations/
#    Write idempotent SQL (use IF NOT EXISTS / IF EXISTS where possible)

# 3. Preview what will be applied
supabase migration list

# 4. Push to the remote database
supabase db push
```

### Migration file conventions

- Use `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, etc. so migrations are safe to re-run
- One logical change per migration file
- Name files descriptively: `add_rls_policies`, `add_user_verified_column`, etc.
- The timestamp prefix is added automatically by the CLI

### Existing migrations

| Migration | Description |
|---|---|
| `20260319171628_initial_schema.sql` | Baseline schema — `users` and `tokens` tables with indexes |
| `20260319173953_add_rls_policies.sql` | Enable RLS on `users` and `tokens` — blocks all non-service-role access |
