# The Ascot Group website

The Ascot Group's website, built on [Payload CMS](https://payloadcms.com) 3 and Next.js 16. It recreates the "Homepage redesign brief" from Claude Design using the structure of [CleanBuild Pro](https://github.com/purplexmarketing/CleanBuildPro), Purplex's WordPress starter theme: its ACF sections become Payload blocks, and its SCSS partials and mixins style the site.

Everything on the site is editable in a Purplex-branded admin at `/admin`.

![The homepage header](public/admin/blocks/banner.jpg)

## Contents

- [Getting started](#getting-started)
- [Commands](#commands)
- [How the site is built](#how-the-site-is-built)
- [Editing content](#editing-content)
- [Forms](#forms)
- [Styling](#styling)
- [Database notes](#database-notes)
- [Before launch](#before-launch)

## Getting started

You need Node.js 20.9 or later.

```bash
git clone https://github.com/melsheps91/ascot-payload.git
cd ascot-payload
cp .env.example .env      # then set PAYLOAD_SECRET to a long random string
npm install
npm run seed              # optional: fills the site with the design's content
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (the first visit asks you to create an admin user)

The database is a single SQLite file (`ascot-payload.db`), created on first run. It, uploaded images (`media/`) and uploaded CVs (`cvs/`) are not in git.

> Run `npm run dev` in a terminal you can type into. If a schema change is ambiguous, Payload asks "create or rename column?" there, and every request waits until it's answered.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000. `npm run devsafe` clears the `.next` cache first. |
| `npm run build` / `npm run start` | Production build and server. |
| `npm run seed` | Fills every page, article, job, testimonial, form and setting from the design brief. Safe to re-run: seeded records are updated in place, anything else is left alone. |
| `npm run db:push` | Applies schema changes when the automatic update fails (see [Database notes](#database-notes)). Add `-- --dry` to preview. Stop `npm run dev` first. |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after changing a collection, field or block. |
| `npm run generate:importmap` | Registers new admin components. |
| `npm run acf:import -- <files> [--dry-run]` | Converts CleanBuild Pro ACF JSON into Payload blocks or globals. Also available in the admin under **Tools → ACF importer** in development. |
| `npm run test:int` / `npm run test:e2e` | Vitest and Playwright tests. |
| `npx tsc --noEmit` | Type-check. |

## How the site is built

CleanBuild Pro's structure maps directly onto Payload:

| CleanBuild Pro (WordPress) | This site |
| --- | --- |
| Page templates (a fixed list of `include`s) | The **Pages** collection, built from **Sections** (blocks) the editor chooses and orders |
| `inc/content/*.php`, `inc/header/banner-*.php` | A block config in `src/blocks/` and a React component in `src/app/(frontend)/components/` |
| ACF field groups | Block and global configs, keeping the ACF field names |
| ACF options pages | Globals: Header, Footer, Company Details, Job Settings |
| Custom post types | Collections: Articles (with Categories), Jobs, Testimonials, CVs |
| `button_field()`, `wpautop`, `[address]` shortcodes | Shared components in `components/shared/` |

### Page sections

| Section | Based on |
| --- | --- |
| Page header | ACF Banner and the four banner templates |
| Text section | Intro Content |
| Image & text rows | Repeater Content |
| Icon grid | Icon Grid |
| Image cards | Product Cards – Manual |
| Logo grid | Global Sections logo grid |
| Image gallery | Gallery |
| Testimonials | Testimonials slider |
| Latest news, News listing | `latest-news.php`, `posts-loop.php` |
| Contact form section | Form Shortcode and `form-section.php` |
| Scrolling ticker, Timeline, Legal sections, Vacancies list | New for the redesign |

### Routes

| URL | Renders |
| --- | --- |
| `/` | The page with the slug `home` |
| `/<slug>` | Any other page |
| `/news/<slug>` | A news article |
| `/careers/<slug>` | A job, with its application form |
| `/careers/apply` | The speculative application page |

### Project layout

```
src/
  app/(frontend)/      the website: routes, components, scss/
  app/(payload)/       Payload's admin and API (custom.scss holds the admin styling)
  blocks/              page section configs
  collections/         Pages, Articles, Categories, Jobs, Testimonials, CVs, Media, Users
  globals/             Header, Footer, Company Details, Job Settings
  components/admin/    admin branding, dashboard and block labels
  fields/  hooks/  lib/
scripts/
  seed/                the content seed and its images
  acf-to-payload/      the ACF importer
  push-schema.ts       npm run db:push
public/admin/          Purplex logos and the block picker thumbnails
```

## Editing content

- **Pages** are built from sections. Use **Add Section** at the bottom of a page, and drag sections to reorder them. Each section's **Section settings** set its background (white, grey or navy).
- **Bold words in headings:** wrap them in `*asterisks*`, e.g. `Build your career *with us.*`
- **Image cropping:** click the important part of an image in **Images & files** to set its focal point. Page headers also have an **Image Position** setting.
- **Preview:** pages, articles and jobs have a preview button next to **Save**.
- **Edit from the website:** when you're logged in to the admin, an **Edit page** button appears in the bottom-right corner of every page.
- **Menus, footer and contact details** are under **Settings**.

## Forms

Forms use Payload's [form-builder plugin](https://payloadcms.com/docs/plugins/form-builder), so they're edited under **Forms → Forms**, and everything sent arrives in **Forms → Submissions**.

- **Contact** is used by the Contact form section on `/contact`.
- **Job application** is used on every job page and `/careers/apply`, chosen in **Careers → Job Settings**. Applications are linked to their job, and CVs (PDF or Word, up to 10 MB) are stored in the private **CVs** collection, which only logged-in users can open.

One renderer (`src/app/(frontend)/components/form/`) draws any form in the site's style and posts it to Payload's `/api/form-submissions`.

## Styling

- Sass, in `src/app/(frontend)/scss/`, using CleanBuild Pro's partials: `_vars`, `_mixins`, `_reset`, `_helpers`, `_text-defaults`, `_buttons`, `_forms`. Section styles are one partial per block in `scss/sections/`.
- Fonts: Montserrat, via `next/font`.
- Icons: the Font Awesome 7 Pro kit, loaded in `layout.tsx`. Override the kit with `NEXT_PUBLIC_FONT_AWESOME_KIT`.
- Sliders use [Embla Carousel](https://www.embla-carousel.com); the video lightbox uses the native `<dialog>` element.

## Database notes

- In development, Payload updates the database automatically when collections or blocks change. **Removing or renaming a field or block deletes its data straight away**, so back up `ascot-payload.db` before restructuring.
- A drizzle-kit bug writes some `CREATE INDEX` statements twice when it rebuilds a table (for example after adding a collection), so the automatic update fails with "index … already exists" and requests hang. Stop the dev server and run `npm run db:push`, which applies the same changes without the duplicates and refuses anything flagged as data loss.
- `docker-compose.yml` is left over from the Payload template and describes MongoDB. It isn't used.

## Before launch

- [ ] Upload the missing images: brand and client logos, the TEDx and Acquisitions images, the Building Products image and the award badge.
- [ ] Connect an email service (e.g. SMTP with `@payloadcms/email-nodemailer`, or Resend) so form notification emails send. Until then they're only written to the server log.
- [ ] Allow the live domain in the Font Awesome kit settings.
- [ ] Set `NEXT_PUBLIC_SERVER_URL` to the live address (used for share links).
- [ ] Choose production hosting and a database. SQLite suits a single server; Postgres suits serverless hosting.

---

Built by [Purplex](https://www.purplexmarketing.com) for The Ascot Group.
