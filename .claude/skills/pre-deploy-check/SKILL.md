---
name: pre-deploy-check
description: Run before any DigitalOcean App Platform deploy of the Ascot Group site (first deploy or redeploy) and before answering "is this ready to deploy?". Runs the automated checks in check.sh, then walks the dashboard checklist. Adapted from the Payload Starter's pre-deploy-check for this project (pnpm, Postgres, Spaces with private CVs).
---

# Pre-Deploy Check (Ascot Group site)

Run this before **any** DigitalOcean App Platform deploy, and before answering "is this ready to deploy?". It is the Payload Starter's pre-deploy check adapted to this project. Every check exists because a real deploy of this project or the starter broke on it; the dated notes say which.

## 1. Run the automated checks

Stop `pnpm dev` first (the build check moves `.env` aside), make sure local Postgres is running (`brew services start postgresql@17`), then:

```
bash .claude/skills/pre-deploy-check/check.sh
```

It checks, from the repo:

- **No stale `package-lock.json` / `yarn.lock`.** The Dockerfile tries yarn, then npm, then pnpm, so a leftover lockfile silently wins. Starter, 2026-09-28.
- **`pnpm-lock.yaml` matches `package.json`** (`pnpm install --frozen-lockfile`).
- **pnpm is pinned** (`"packageManager"`) and the Dockerfile installs it with `npm install -g`, not Corepack, which is unreliable in DO's Kaniko builder. Starter, 2026-09-28.
- **`pnpm-workspace.yaml` and `.npmrc` reach the Dockerfile's install stage.** Ascot, 2026-09-30: `.npmrc` (`legacy-peer-deps=true`) was missing from that `COPY`, and without it the install fails with "Missing: yjs@13.6.33 from lock file".
- **`output: 'standalone'`** in `next.config.ts`. The Dockerfile's last stage copies `.next/standalone`. Ascot, 2026-09-30: it was missing.
- **The database adapter is Postgres.** App Platform wipes its disk on every deploy, so SQLite can't be used. Ascot, 2026-09-30.
- **Migrations match the schema.** It generates a throwaway migration; if a file appears, the schema has drifted. Delete that file and create a properly named one: `pnpm migrate:create <descriptive-name>`. Starter, 2026-09-28.
- **`tsc --noEmit` is clean.**
- **Nothing touches Payload at build time.** The DO build has no database and no `PAYLOAD_SECRET`. No `force-static`, every page and the layout under `src/app/(frontend)` export `dynamic = 'force-dynamic'` (segment config is per file, not inherited), and there's no unwrapped `generateStaticParams`. Starter, 2026-09-28; Ascot, 2026-09-30 ("missing secret key" prerendering `/`).
- **A production build succeeds with no `.env`.** The closest local match to the Docker build, and the check that catches the previous point directly.
- **`prodMigrations` is not set.** Concurrent Server Components each call `getPayload()` on the first request and race the migration. Starter, 2026-09-29.
- **Spaces storage is correct:**
  - Images: `acl: 'public-read'` and `disablePayloadAccessControl: true` (Starter, 2026-09-30).
  - **CVs: a separate `s3Storage` with `acl: 'private'` and without `disablePayloadAccessControl`**, so downloads still go through Payload and only logged-in users get them. Getting this wrong would publish applicants' CVs.
  - `alwaysInsertFields: true`, so the plugin's `prefix` and `_objectKey` columns exist locally as well as in production. Otherwise local migrations miss them. Ascot, 2026-09-30.
  - `next.config.ts` allows `**.digitaloceanspaces.com`, or `next/image` rejects Spaces media. The plugin's URLs are `lon1.digitaloceanspaces.com/<bucket>/…`; `**` also covers bucket-style and CDN hosts (`*` matches exactly one subdomain).

Fix everything it flags before moving on.

## 2. Manual checklist (DO dashboard)

These can't be checked from the repo. Confirm each one, in order, on every deploy:

- [ ] **`NEXT_PUBLIC_SERVER_URL` is a literal URL**, never `${...}` bind-variable syntax. It's inlined at build time, when App Platform can't resolve bind variables. Scope it Build and Run Time.
- [ ] **`DATABASE_URL` is the literal connection string** for this site's own scoped database user (cluster → Users & Databases), never a `${component.DATABASE_URL}` binding.
- [ ] **`DATABASE_CA_CERT` holds the certificate's contents** (the text from `-----BEGIN CERTIFICATE-----` to `-----END CERTIFICATE-----`), never a file path; it's passed straight to Postgres as the certificate. From a terminal: `DATABASE_CA_CERT="$(cat ~/Downloads/ca-certificate.crt)"`. Ascot, 2026-09-30.
- [ ] **The app is a Trusted Source** on the database cluster. Without it the app builds and goes Active, then fails on its first request.
- [ ] **New migrations are applied by hand.** Add your machine as a Trusted Source, then run `pnpm migrate` with this site's `DATABASE_URL` and `DATABASE_CA_CERT`. Migrations never run automatically.
- [ ] **Spaces variables are set:** `S3_BUCKET`, `S3_ENDPOINT` (e.g. `https://lon1.digitaloceanspaces.com`), `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. `S3_PREFIX` is optional and defaults to `ascot-payload`. If you set it, it must be unique to this site: the bucket is shared, and prefixes keep each site's files apart.
- [ ] **Secrets are marked Encrypted:** `DATABASE_URL`, `DATABASE_CA_CERT`, `PAYLOAD_SECRET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
- [ ] **Scope:** only `NEXT_PUBLIC_SERVER_URL` is Build and Run Time; everything else is Run Time.
- [ ] **`PAYLOAD_SECRET` is this site's own random value** (`openssl rand -hex 32`), never copied from another site.
- [ ] **The Font Awesome kit allows the live domain** (kit settings on fontawesome.com), or icons don't load.
- [ ] **Never run `pnpm seed` against production once it has real content.** It overwrites every seeded page, form and setting with the design brief's copy.

### First deploy only: move the content and uploads

The production database should be an exact copy of the local one, migrations table included, so later `pnpm migrate` runs know what's already applied.

1. In the cluster, create this site's own database and user (never the cluster's default database), and add your machine as a Trusted Source.
2. **Let the site user create tables.** New databases are owned by `doadmin`, and since Postgres 15 other users can't create tables in `public`. Run once, **as doadmin** (its connection string: cluster → Connection details, User = doadmin, Database = this site's):
   ```
   psql "<doadmin connection string>" -c "GRANT USAGE, CREATE ON SCHEMA public TO <site user>;"
   ```
   It must print only `GRANT`; "no privileges were granted" means it ran as the site user. Never load or migrate as doadmin: it would own the tables and the site user couldn't use them. Ascot, 2026-09-30.
3. Dump local Postgres, skipping login sessions:
   ```
   pg_dump --no-owner --no-privileges --exclude-table-data=users_sessions -d ascot_payload -f ascot.sql
   ```
4. Load it into the new, empty production database, **as the site user**, in one transaction:
   ```
   psql "<production DATABASE_URL>" -v ON_ERROR_STOP=1 --single-transaction -f ascot.sql
   ```
5. Remove the local dev-push marker the copy brings with it, or the next `pnpm migrate` against production stops at the dev-mode prompt. Then confirm both migrations show as run:
   ```
   psql "<production DATABASE_URL>" -c "DELETE FROM payload_migrations WHERE name = 'dev' AND batch = -1;"
   DATABASE_URL="<production DATABASE_URL>" DATABASE_CA_CERT="$(cat ca-certificate.crt)" pnpm payload migrate:status
   ```
6. Upload the files: images public under the prefix, CVs private under `<prefix>/cvs`. Put the Spaces keys in `.env.spaces` (git-ignored; template in `scripts/upload-to-spaces.ts`), then:
   ```
   pnpm spaces:upload --dry    # check the list
   pnpm spaces:upload
   ```
   Files already in Spaces are skipped, so it's safe to re-run.
7. Delete `ascot.sql` afterwards: it contains form submissions and users' password hashes.
8. Keep connection strings out of chats and tickets. If one is pasted anywhere, reset that user's password (cluster → Users & Databases → ⋯ → Reset password).

## Local development notes

- Local development uses Postgres 17 from Homebrew (`DATABASE_URL=postgres://localhost:5432/ascot_payload`) with automatic schema push.
- **After `pnpm dev` has run, `pnpm migrate` locally asks** "It looks like you've run Payload in dev mode…" and waits. Locally you don't need to migrate (push keeps the schema current); migrations are for production. If you do need to replay them locally, answer the prompt in your own terminal.

## Keeping this current

If a deploy breaks for a new reason, that's a gap in this skill. Add the check to `check.sh` (if it can be automated) or to the checklist above, with the date and what happened, in the same style.
