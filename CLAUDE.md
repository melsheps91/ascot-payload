# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Commands

The repo uses npm (`package-lock.json`), although some scripts and `playwright.config.ts` call `pnpm`.

- `npm run dev`: dev server on http://localhost:3000 (admin at `/admin`). `npm run devsafe` clears `.next` first.
- `npm run build` / `npm run start`: production build and serve.
- `npm run lint`: ESLint.
- `npm run generate:types`: regenerate `src/payload-types.ts` after any collection, field or block change.
- `npm run generate:importmap`: regenerate `src/app/(payload)/admin/importMap.js` after adding custom admin components.
- `npm run test:int`: Vitest integration tests (`tests/int/**/*.int.spec.ts`, jsdom). Single file: `npx vitest run --config ./vitest.config.mts tests/int/api.int.spec.ts`; single test: add `-t "<name>"`.
- `npm run test:e2e`: Playwright tests (`tests/e2e`); starts or reuses the dev server. Single test: `npx playwright test --config=playwright.config.ts tests/e2e/frontend.e2e.spec.ts`.
- `npx tsc --noEmit`: type-check.
- `npm run acf:import -- <json files or folders> [--dry-run] [--force] [--as block|global]`: convert ACF field groups into Payload config (see below). Unit tests: `npx vitest run --config ./vitest.config.mts tests/unit`.
- `npm run lint` currently crashes while loading `@eslint/eslintrc` ("Converting circular structure to JSON"). This problem predates the ACF tooling.

## Porting CleanBuildPro

This site replicates the CleanBuildPro WordPress theme in `../CleanBuildPro`, which has its own `CLAUDE.md`. Use the `/acf-to-payload` skill (`.claude/skills/acf-to-payload/`) for this work.

- The importer also runs in the browser at `/admin/acf-import` ("ACF importer" under Tools in the sidebar) while `npm run dev` is up. The view is `src/components/admin/AcfImport*`, backed by the dev-only, login-required endpoints in `src/endpoints/acfImport.ts` (`/api/acf-import`, `/preview`, `/run`). They return 404 in production because they write source files.
- `scripts/acf-to-payload/convert.ts` is a pure ACF-group-to-source converter. `importer.ts` does the file work shared by the CLI (`index.ts`) and the endpoints: it writes the files, then edits `Pages.ts`, `payload.config.ts` and the `page.tsx` block switch with regexes. Payload reloads the config after an import through Next's HMR socket, which only fires while a browser has the site open. If a test dev server runs on a port other than 3000, also set `PORT` to that port, or Payload listens to the wrong socket. Options-page groups become globals in `src/globals/`, and every other group becomes a block.
- Mapping choices: names are camelCased and the group's shared prefix is stripped. An ACF `link` becomes the `link()` group from `src/fields/link.ts` (`label`, `url`, `newTab`). A `true_false` with on/off labels becomes a radio. ACF tabs become a `tabs` field, and `conditional_logic` becomes `admin.condition`, using `blockData` for block-level fields read from inside repeaters.
- `src/app/(frontend)/components/shared/` has the React equivalents of the theme helpers: `Button`/`Buttons` (`button_field`/`button_repeater`) and `Autop` (textarea `wpautop`).

## Architecture

Payload 3 runs inside a Next.js App Router app. There is no separate backend.

- `src/payload.config.ts` is the single source of truth: collections, the Lexical rich-text editor, the SQLite adapter (`@payloadcms/db-sqlite`) and sharp.
- `src/app/(payload)/` is Payload's generated admin UI and REST/GraphQL routes. Leave it alone except for `custom.scss`.
- `src/app/(frontend)/` is the public site. Server components query data with the Local API (`getPayload({ config })` then `payload.find(...)`) instead of HTTP.
- Content model: the `pages` collection (`src/collections/Pages.ts`) has `title`, `slug` and a `layout` blocks field. Block configs live in `src/blocks/`: `Banner` was built by hand, and the others are generated from ACF (see above). Each block has a matching React component in `src/app/(frontend)/components/`, and `page.tsx` renders the right one in a `switch` on `block.blockType`.
- Routing is not built yet: there is no `[slug]` route. `src/app/(frontend)/page.tsx` (the `/` route) loads the page whose slug is hard-coded as `'test'`. `src/app/my-route/route.ts` is a leftover example route from the template.
- Upload fields (e.g. `image`) come back as `number | Media` depending on query depth. Check `typeof x === 'object'` before using them. Render rich text with `RichText` from `@payloadcms/richtext-lexical/react`.
- Frontend styles are plain nested CSS with no Tailwind or Sass. `src/app/(frontend)/theme.css` holds the CleanBuildPro foundation (variables as `--col-*`, reset, typography, `.btn`, containers, padding and helper classes). `styles.css` holds the per-section styles. `layout.tsx` loads the theme fonts through `next/font` as `--font-primary`/`--font-secondary`.

## Database (SQLite) caveats

- `DATABASE_URL=file:./ascot-payload.db`. The README, `.env.example` and `docker-compose.yml` still describe MongoDB from the template. Ignore that.
- The tests use the same database as dev; there is no separate test database. Integration tests load `.env` through `vitest.setup.ts`, and the e2e `seedTestUser` helper deletes and recreates `dev@payloadcms.com` in `ascot-payload.db`.
- In dev, Payload pushes schema changes to the database automatically. **Removing or renaming a field or block drops its columns or tables and deletes the data straight away.** Back up `ascot-payload.db` before restructuring.
- When a change is ambiguous (e.g. moving fields into a group), drizzle asks "create or rename column?" in the dev-server terminal and every request hangs until it's answered. So run `npm run dev` in a terminal someone can interact with, not as a detached background process.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
