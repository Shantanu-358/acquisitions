# Docker Setup — Acquisitions

This project uses Docker with [Neon Local](https://neon.com/docs/local/neon-local) for development and Neon Cloud for production.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A [Neon](https://neon.tech) account with a project

## Project Structure

```
Dockerfile                  # Multi-stage Node.js image
docker-compose.dev.yml      # Dev: app + Neon Local proxy
docker-compose.prod.yml     # Prod: app only (connects to Neon Cloud)
.env.development            # Dev environment variables (git-ignored)
.env.production             # Prod environment variables (git-ignored)
.env.development.example    # Dev template (committed to repo)
.env.production.example     # Prod template (committed to repo)
```

## Environment Variable Switching

The `DATABASE_URL` environment variable controls which database the app connects to:

- **Development:** `postgres://neon:npg@neon-local:5432/neondb` — routed through the Neon Local proxy running alongside the app in Docker Compose.
- **Production:** `postgres://user:pass@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require` — connects directly to Neon Cloud.

An additional `NEON_LOCAL_HOST` variable (set only in dev) tells the Neon serverless driver to use HTTP mode against the local proxy instead of the default Neon Cloud endpoint.

---

## Development Setup (Neon Local)

Neon Local creates **ephemeral database branches** from your parent branch when the container starts, and deletes them when it stops. Each `docker compose up` gives you a fresh copy of your database.

### 1. Configure environment

```bash
cp .env.development.example .env.development
```

Edit `.env.development` and fill in your Neon credentials:

- `NEON_API_KEY` — from https://console.neon.tech/app/settings/api-keys
- `NEON_PROJECT_ID` — from Project Settings > General
- `PARENT_BRANCH_ID` — the branch to fork from (leave as-is to use the default branch)
- `ARCJET_KEY` — your Arcjet key

### 2. Start the dev environment

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

This starts two services:
- `neon-local` — Neon Local proxy on port 5432 (creates an ephemeral branch)
- `app` — the Express app on port 3000

### 3. Run database migrations (inside the container)

```bash
docker compose -f docker-compose.dev.yml exec app npx drizzle-kit migrate
```

### 4. Stop (ephemeral branch is automatically deleted)

```bash
docker compose -f docker-compose.dev.yml down
```

### Optional: Persist branches per git branch

Uncomment the `volumes` block in `docker-compose.dev.yml` under the `neon-local` service and add `.neon_local/` to your `.gitignore` (already done). This ties a Neon branch to each git branch so data persists across restarts.

---

## Production Setup (Neon Cloud)

In production, the app connects directly to your Neon Cloud database. No Neon Local proxy is used.

### 1. Configure environment

```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your real Neon Cloud connection string and Arcjet key.

### 2. Start the production container

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 3. Run database migrations

```bash
docker compose -f docker-compose.prod.yml exec app npx drizzle-kit migrate
```

### 4. Stop

```bash
docker compose -f docker-compose.prod.yml down
```

---

## How It Works

The key difference is in `src/config/database.js`:

```js
// When NEON_LOCAL_HOST is set (dev Docker), the serverless driver
// is configured to talk HTTP to the Neon Local proxy.
if (process.env.NEON_LOCAL_HOST) {
  neonConfig.fetchEndpoint = `http://${process.env.NEON_LOCAL_HOST}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
```

- **Dev:** `NEON_LOCAL_HOST=neon-local` is set → driver talks to the local proxy over HTTP.
- **Prod:** `NEON_LOCAL_HOST` is not set → driver uses the default Neon Cloud HTTPS endpoint.

No code changes are needed between environments — only the environment variables differ.

---

## Useful Commands

```bash
# Rebuild after dependency changes
docker compose -f docker-compose.dev.yml up --build

# View logs
docker compose -f docker-compose.dev.yml logs -f app

# Open a shell in the app container
docker compose -f docker-compose.dev.yml exec app sh

# Run drizzle studio
docker compose -f docker-compose.dev.yml exec app npx drizzle-kit studio
```
