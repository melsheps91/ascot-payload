# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Commands

The repo uses pnpm 12.5.1 (`pnpm-lock.yaml`).

- `pnpm dev`: dev server on http://localhost:3000 (admin at `/admin`). `pnpm devsafe` clears `.next` first.
- `pnpm build` / `pnpm start`: production build and serve.
- `pnpm lint`: ESLint.
- `pnpm generate:types`: regenerate `src/payload-types.ts` after any collection, field or block change.
- `pnpm generate:importmap`: regenerate `src/app/(payload)/admin/importMap.js` after adding custom admin components.
- `pnpm test:int`: Vitest integration tests (`tests/int/**/*.int.spec.ts`, jsdom). Single file: `pnpm exec vitest run --config ./vitest.config.mts tests/int/api.int.spec.ts`; single test: add `-t "<name>"`.
- `pnpm test:e2e`: Playwright tests (`tests/e2e`); starts or reuses the dev server. Single test: `pnpm exec playwright test --config=playwright.config.ts tests/e2e/frontend.e2e.spec.ts`.
- `pnpm exec tsc --noEmit`: type-check.
- `pnpm seed`: fills the site with the Ascot redesign content (pages, news, jobs, testimonials, forms, globals, images from `scripts/seed/assets/`). Re-runnable: seeded records are matched by slug/title and overwritten; other content is left alone.
- `pnpm migrate` / `pnpm migrate:create <name>`: apply or create migrations (see "Database").
- `pnpm acf:import -- <json files or folders> [--dry-run] [--force] [--as block|global]`: convert ACF field groups into Payload config (see below). Unit tests: `pnpm exec vitest run --config ./vitest.config.mts tests/unit`.
- `pnpm lint` currently crashes while loading `@eslint/eslintrc` ("Converting circular structure to JSON"). This problem predates the ACF tooling.

## Porting CleanBuildPro

This site replicates the CleanBuildPro WordPress theme in `../CleanBuildPro`, which has its own `CLAUDE.md`. Use the `/acf-to-payload` skill (`.claude/skills/acf-to-payload/`) for this work.

- The importer also runs in the browser at `/admin/acf-import` ("ACF importer" under Tools in the sidebar) while `pnpm dev` is up. The view is `src/components/admin/AcfImport*`, backed by the dev-only, login-required endpoints in `src/endpoints/acfImport.ts` (`/api/acf-import`, `/preview`, `/run`). They return 404 in production because they write source files.
- `scripts/acf-to-payload/convert.ts` is a pure ACF-group-to-source converter. `importer.ts` does the file work shared by the CLI (`index.ts`) and the endpoints: it writes the files, then edits `Pages.ts`, `payload.config.ts` and the block switch in `components/render-blocks.tsx` with regexes. Payload reloads the config after an import through Next's HMR socket, which only fires while a browser has the site open. If a test dev server runs on a port other than 3000, also set `PORT` to that port, or Payload listens to the wrong socket. Options-page groups become globals in `src/globals/`, and every other group becomes a block.
- Mapping choices: names are camelCased and the group's shared prefix is stripped. An ACF `link` becomes the `link()` group from `src/fields/link.ts` (`label`, `url`, `newTab`, plus `style` and a Font Awesome `icon`). A `true_false` with on/off labels becomes a radio. ACF tabs become a `tabs` field, and `conditional_logic` becomes `admin.condition`, using `blockData` for block-level fields read from inside repeaters.
- `src/app/(frontend)/components/shared/` has the React equivalents of the theme helpers: `Button`/`Buttons` (`button_field`/`button_repeater`), `Autop` (textarea `wpautop`), `Img` (upload field with an empty-slot placeholder), `RichText`, `Heading`/`Emphasis`, and `Section`/`SectionIntro` (the `{name}-wrap large-pad` wrapper and the shared intro fields from `src/fields/section.ts`).

## Architecture

Payload 3 runs inside a Next.js App Router app. There is no separate backend.

- `src/payload.config.ts` is the single source of truth: collections, the Lexical rich-text editor, the Postgres adapter (`@payloadcms/db-postgres`), Spaces storage (`@payloadcms/storage-s3`) and sharp.
- `src/app/(payload)/` is Payload's generated admin UI and REST/GraphQL routes. Leave it alone except for `custom.scss`.
- `src/app/(frontend)/` is the public site. Server components query data with the Local API (`getPayload({ config })` then `payload.find(...)`) instead of HTTP.
- Content model:
  - `pages` (`src/collections/Pages.ts`): `title`, `slug`, `meta` and a `layout` blocks field. Block configs live in `src/blocks/`, most based on a CleanBuildPro ACF group (the header comment says which). Each block has a React component in `src/app/(frontend)/components/`, and `components/render-blocks.tsx` renders the right one in a `switch` on `block.blockType`. Blocks share `sectionSettings` (background `theme` and `anchor`) and `sectionIntro` from `src/fields/section.ts`.
  - `posts` (news) with `categories`, `jobs` (careers), `testimonials`, and `cvs` (private uploads, readable only when logged in).
  - `forms` and `form-submissions` come from `@payloadcms/plugin-form-builder` (radio and upload fields enabled). Submissions get a `job` relationship for applications. `components/form/` renders any form and posts multipart to `/api/form-submissions`; the plugin stores uploads in `cvs`. There is no email adapter, so form emails are only logged.
  - Globals (`src/globals/`): `header` (logo, menu, button), `footer`, `companyDetails` (from the ACF "Company Details" group: address, phone, socials, company number) and `jobSettings` (application form, "why join" panel, speculative application page).
- Routing: `/` renders the page with slug `home`; `[slug]/page.tsx` renders other pages (`/home` redirects to `/`). `news/[slug]` is the article template, `careers/[slug]` the job template and `careers/apply` the speculative application page. Paths used by templates are in `src/lib/routes.ts`. Local API helpers (`getPageBySlug`, `getGlobals`, …) are in `src/lib/payload.ts`. Every collection and global has an `afterChange` hook (`src/hooks/revalidate.ts`) that revalidates the whole site. `src/app/my-route/route.ts` is a leftover example route from the template.
- Headings: wrap words in `*asterisks*` in any heading field to make them bold (`Emphasis` renders them as `<strong>`), which gives the redesign's light/bold mix.
- Upload fields (e.g. `image`) come back as `number | Media` depending on query depth. Check `typeof x === 'object'` before using them. Render rich text with `RichText` from `@payloadcms/richtext-lexical/react`.
- Frontend styles are Sass (`src/app/(frontend)/scss/`, entry `main.scss`), using the CleanBuildPro partials with `@use`: `_vars` (re-skinned to the redesign's navy palette), `_mixins` (the theme's `max-width()` etc. plus `display()`, `eyebrow()`, `auto-grid()`, `rise()`), `_reset`, `_helpers` (containers, `.large-pad`, `.grey-back`/`.primary-back`, same-background padding collapse), `_text-defaults`, `_buttons` and `_forms`. Section styles are one partial per block in `scss/sections/`. Montserrat (200–600) loads through `next/font` as `--font-primary`. Icons use the CleanBuildPro Font Awesome 7 Pro kit (`4ff287f21b`, CSS mode), loaded `beforeInteractive` in `layout.tsx`; loading it later leaves solid icons blank. The kit must allow the site's domain.

## Admin (Purplex branding)

- `payload.config.ts` `admin.meta` and `admin.components` set the title suffix, favicon, `graphics.Logo`/`Icon`, the login intro, the dashboard panel and the "View website" nav link. The components are in `src/components/admin/` (`branding/`, `Dashboard.tsx`, `BlockLabel.tsx`); their styles are in `src/app/(payload)/custom.scss` (`--plx-accent` is the accent colour). Logo files and block thumbnails live in `public/admin/`.
- Every page block has `imageURL` (a screenshot in `public/admin/blocks/`) and `admin.group` for the Add Section picker. `Pages.ts` wraps each block with `withSummaryLabel`, which shows the block's heading in its header. When adding a block, give it both and add a thumbnail (screenshot the section at 1440px wide, 640×400 JPEG).
- Collections and globals are grouped in the nav (Website, News, Careers, Settings, Forms) and pages, articles and jobs have `admin.preview`, which adds a preview button.
- Run `pnpm generate:importmap` after adding admin components (the dev server usually does it for you).

## Database (Postgres) and deployment

- Postgres everywhere. Locally: Homebrew Postgres 17, `DATABASE_URL=postgres://localhost:5432/ascot_payload` (see `.env.example`). Production: DigitalOcean managed Postgres with `DATABASE_CA_CERT`. `docker-compose.yml` is a MongoDB leftover from the template; ignore it.
- Development pushes schema changes automatically (`push: isDev`). **Removing or renaming a field or block drops its data straight away.** Back up first (`pg_dump`). Ambiguous changes make drizzle ask "create or rename column?" in the dev-server terminal and every request hangs until it's answered, so run `pnpm dev` in a terminal someone can type into.
- Production never pushes. Any schema change needs a migration: `pnpm migrate:create <name>`, committed in `src/migrations/`, applied by hand with `pnpm migrate`. `prodMigrations` is deliberately not set.
- After `pnpm dev` has run, local `pnpm migrate` prompts ("run Payload in dev mode") and hangs a non-interactive shell. Don't run it from a background process.
- Uploads: `s3Storage` (Spaces) is always registered with `alwaysInsertFields: true` and switched on by `S3_BUCKET`, so the schema is the same locally and in production. Images are public (`disablePayloadAccessControl`); CVs use a separate, private `s3Storage` and must never get `disablePayloadAccessControl`. `S3_PREFIX` defaults to `ascot-payload`.
- Every frontend page and the layout export `dynamic = 'force-dynamic'`: the DigitalOcean build has no database or secret, so nothing may query Payload at build time.
- **Before any deploy, run the `pre-deploy-check` skill** (`.claude/skills/pre-deploy-check/`).
- The tests use the same database as dev. The e2e `seedTestUser` helper deletes and recreates `dev@payloadcms.com`.
- Package manager: pnpm 12.5.1 (pinned in `package.json`; config in `pnpm-workspace.yaml` and `.npmrc`).

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
