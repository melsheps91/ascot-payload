#!/usr/bin/env bash
# Automated half of the pre-deploy check for the Ascot Group site. Run from anywhere:
#   bash .claude/skills/pre-deploy-check/check.sh
# Exits non-zero if anything here would break a DigitalOcean App Platform Docker build
# or a fresh production database boot. Adapted from the Payload Starter's check.

set -uo pipefail
cd "$(dirname "$0")/../../.." || exit 1

FAIL=0
say_fail() { echo "FAIL: $1"; FAIL=1; }
say_ok()   { echo "OK: $1"; }
LOG_DIR="$(mktemp -d)"

echo "=== Pre-deploy check ==="

# 0. The build test below moves .env aside, which a running dev server would pick up.
if lsof -ti :3000 >/dev/null 2>&1; then
  echo "Stop the dev server (port 3000) first: the production build check moves .env aside."
  exit 1
fi

# 1. Stale/conflicting lockfiles. The Dockerfile picks a package manager by checking
# yarn.lock, then package-lock.json, then pnpm-lock.yaml; an earlier one silently wins.
if [ -f package-lock.json ]; then
  say_fail "package-lock.json exists; the Dockerfile would run 'npm ci' instead of pnpm. Delete it: git rm package-lock.json"
else
  say_ok "no stale package-lock.json"
fi
if [ -f yarn.lock ]; then
  say_fail "yarn.lock exists; the Dockerfile would use yarn. Delete it: git rm yarn.lock"
else
  say_ok "no stale yarn.lock"
fi

# 2. pnpm-lock.yaml must match package.json.
if pnpm install --frozen-lockfile >"$LOG_DIR/pnpm.log" 2>&1; then
  say_ok "pnpm-lock.yaml is in sync with package.json"
else
  say_fail "pnpm-lock.yaml is out of sync with package.json; run 'pnpm install' and commit the lockfile"
  tail -20 "$LOG_DIR/pnpm.log"
fi

# 3. pnpm pinned, and installed with npm install -g rather than Corepack
# (Corepack's download is unreliable in DO's Kaniko builder; Payload Starter, 2026-09-28).
if grep -q '"packageManager": "pnpm@' package.json; then
  say_ok "packageManager is pinned ($(node -p "require('./package.json').packageManager"))"
else
  say_fail "package.json has no pinned \"packageManager\": \"pnpm@<version>\""
fi
if grep -q "corepack enable" Dockerfile 2>/dev/null; then
  say_fail "Dockerfile uses 'corepack enable'; install pnpm with npm install -g (see the Payload Starter Dockerfile)"
else
  say_ok "Dockerfile installs pnpm via npm install -g, not Corepack"
fi

# 3b. Files pnpm reads at install time must reach the Dockerfile's deps stage.
# Ascot, 2026-09-30: .npmrc (legacy-peer-deps=true) was missing from that COPY; without it
# the install fails ("Missing: yjs@13.6.33 from lock file").
DEPS_COPY_LINE=$(grep -m1 "^COPY package.json" Dockerfile 2>/dev/null)
for f in pnpm-workspace.yaml .npmrc; do
  if [ -f "$f" ]; then
    if echo "$DEPS_COPY_LINE" | grep -q "$f"; then
      say_ok "Dockerfile's deps stage copies $f"
    else
      say_fail "$f exists but the Dockerfile's deps-stage COPY doesn't include it: $DEPS_COPY_LINE"
    fi
  fi
done

# 3c. The Dockerfile copies .next/standalone, which only exists with output: 'standalone'.
# Ascot, 2026-09-30: missing from next.config.ts.
if grep -qE "output:[[:space:]]*['\"]standalone['\"]" next.config.ts; then
  say_ok "next.config.ts sets output: 'standalone'"
else
  say_fail "next.config.ts doesn't set output: 'standalone'; the Dockerfile's final stage copies .next/standalone"
fi

# 4. Postgres, not SQLite. App Platform's disk is wiped on every deploy. Ascot, 2026-09-30.
if grep -q "postgresAdapter" src/payload.config.ts && ! grep -q "sqliteAdapter" src/payload.config.ts; then
  say_ok "the database adapter is Postgres"
else
  say_fail "src/payload.config.ts isn't using postgresAdapter; SQLite doesn't survive App Platform deploys"
fi

# 5. Migrations must match the schema, or a fresh production database boots incomplete.
# Generates the next migration; a new file means drift. Needs the local database running.
MIGRATIONS_DIR="src/migrations"
BEFORE_COUNT=$(find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.ts" ! -name "index.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$BEFORE_COUNT" -eq 0 ]; then
  say_fail "no migrations in $MIGRATIONS_DIR; production never pushes schema, so a fresh database would be empty"
fi
echo "n" | pnpm exec cross-env NODE_OPTIONS=--no-deprecation payload migrate:create __predeploy_drift_check__ >"$LOG_DIR/migrate.log" 2>&1
AFTER_COUNT=$(find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.ts" ! -name "index.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$AFTER_COUNT" -gt "$BEFORE_COUNT" ]; then
  NEWFILE=$(find "$MIGRATIONS_DIR" -maxdepth 1 -name "*drift_check*.ts" 2>/dev/null | head -1)
  say_fail "the schema has changed since the last migration; one was just generated: ${NEWFILE:-unknown}. Delete it and create a properly named one: pnpm migrate:create <name>"
elif grep -q "No schema changes" "$LOG_DIR/migrate.log"; then
  say_ok "migrations are current, no schema drift"
else
  say_fail "couldn't confirm the migration check ran (is local Postgres running? brew services start postgresql@17). Log: $LOG_DIR/migrate.log"
fi

# 6. TypeScript.
if pnpm exec tsc --noEmit >"$LOG_DIR/tsc.log" 2>&1; then
  say_ok "tsc --noEmit is clean"
else
  say_fail "tsc --noEmit reported errors:"
  cat "$LOG_DIR/tsc.log"
fi

# 7. Nothing may touch Payload at build time: the DO build has no database or
# PAYLOAD_SECRET. Every frontend page and the layout set force-dynamic (segment config is
# per file). Payload Starter 2026-09-28; Ascot 2026-09-30 ("missing secret key" on /).
if grep -rlE "dynamic[[:space:]]*=[[:space:]]*['\"]force-static['\"]" src/app >/dev/null 2>&1; then
  say_fail "found force-static in: $(grep -rlE "dynamic[[:space:]]*=[[:space:]]*['\"]force-static['\"]" src/app | tr '\n' ' ')"
else
  say_ok "no page forces build-time static rendering"
fi
MISSING_DYNAMIC=""
while IFS= read -r f; do
  grep -q "force-dynamic" "$f" || MISSING_DYNAMIC="$MISSING_DYNAMIC $f"
done < <(find "src/app/(frontend)" \( -name "page.tsx" -o -name "layout.tsx" \))
if [ -n "$MISSING_DYNAMIC" ]; then
  say_fail "these frontend files don't export dynamic = 'force-dynamic':$MISSING_DYNAMIC"
else
  say_ok "every frontend page and layout is force-dynamic"
fi
if grep -rl "generateStaticParams" src/app >/dev/null 2>&1; then
  say_fail "generateStaticParams found in $(grep -rl generateStaticParams src/app | tr '\n' ' '); it runs at build time with no database. Wrap it (see the Payload Starter's generateStaticParamsSafely) or remove it"
else
  say_ok "no generateStaticParams (nothing queries Payload at build time)"
fi

# 8. The real test: a production build with no .env, matching the Docker build.
if [ -f .env ]; then
  ENV_BACKUP="$LOG_DIR/env-backup"
  mv .env "$ENV_BACKUP"
  trap '[ -f "$ENV_BACKUP" ] && mv "$ENV_BACKUP" .env' EXIT
fi
if NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" NEXT_PUBLIC_SERVER_URL=https://predeploy-check.example.com pnpm exec next build >"$LOG_DIR/build.log" 2>&1; then
  say_ok "production build succeeds with no .env (matches the Docker build)"
else
  say_fail "production build fails with no .env; last 40 lines:"
  tail -40 "$LOG_DIR/build.log"
fi
if [ -f "${ENV_BACKUP:-}" ]; then
  mv "$ENV_BACKUP" .env
  trap - EXIT
fi

# 9. prodMigrations must not be set: concurrent Server Components each call getPayload()
# on the first request and race the migration (Payload Starter, 2026-09-29).
if grep -qE "prodMigrations[[:space:]]*:" src/payload.config.ts; then
  say_fail "payload.config.ts sets prodMigrations; remove it and apply migrations by hand (pnpm migrate)"
else
  say_ok "prodMigrations is not set; migrations are applied by hand"
fi

# 10. Spaces storage. Images must be public; CVs must stay private.
CONFIG=src/payload.config.ts
if grep -q "s3Storage(" "$CONFIG"; then
  if grep -q "acl: 'public-read'" "$CONFIG" && grep -q "disablePayloadAccessControl: true" "$CONFIG"; then
    say_ok "images: public-read and served straight from Spaces"
  else
    say_fail "the media s3Storage needs acl: 'public-read' and disablePayloadAccessControl: true (Payload Starter, 2026-09-30)"
  fi
  # CVs: private ACL, and never disablePayloadAccessControl, or anyone could download them.
  CVS_BLOCK=$(awk '/acl: .private./,/}\),/' "$CONFIG")
  if echo "$CVS_BLOCK" | grep -q "cvs:" && ! echo "$CVS_BLOCK" | grep -q "disablePayloadAccessControl"; then
    say_ok "CVs: private ACL, downloads still go through Payload's access control"
  else
    say_fail "CVs must use a separate s3Storage with acl: 'private' and without disablePayloadAccessControl"
  fi
  if grep -q "alwaysInsertFields: true" "$CONFIG"; then
    say_ok "storage fields are always in the schema (local migrations match production)"
  else
    say_fail "set alwaysInsertFields: true on s3Storage; otherwise production has columns the migrations don't (Ascot, 2026-09-30)"
  fi
  # The plugin's URLs are lon1.digitaloceanspaces.com/<bucket>/…; `**` also covers bucket-style
  # and CDN hosts if the URL format changes (`*` matches exactly one subdomain).
  if grep -q "'\*\*.digitaloceanspaces.com'" next.config.ts; then
    say_ok "next.config.ts allows **.digitaloceanspaces.com images"
  else
    say_fail "next.config.ts must allow hostname '**.digitaloceanspaces.com' in images.remotePatterns, or next/image rejects Spaces media"
  fi
else
  say_fail "no s3Storage in $CONFIG; uploads would be lost on every App Platform deploy"
fi

echo ""
if [ "$FAIL" -eq 1 ]; then
  echo "=== Pre-deploy check: FAILED. Fix the above before deploying ==="
  exit 1
else
  echo "=== Pre-deploy check: all automated checks passed ==="
  echo "Now work through the manual checklist in .claude/skills/pre-deploy-check/SKILL.md."
fi
