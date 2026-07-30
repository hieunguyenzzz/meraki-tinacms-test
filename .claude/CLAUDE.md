# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meraki Wedding Planner is a bilingual (English/Vietnamese) destination-wedding site built with **Next.js 14** (App Router), **TinaCMS**, and **Tailwind CSS**. It serves wedding journals (galleries), a blog, love notes (testimonials), service and about pages, plus a "Let's Connect" enquiry form that feeds the ERP.

**Live:** https://v2.merakiweddingplanner.com

## Commands

```bash
yarn dev         # Dev server on port 3005 (admin at /admin/index.html)
yarn build       # Production build: tinacms build (Tina Cloud) + next build
yarn build:local # Production build against local filesystem, no cloud checks
yarn start       # Start production server
yarn typecheck   # tsc
yarn lint        # ESLint
```

**Package manager**: Yarn 1.22.x only (enforced in `package.json`). Do NOT use npm or pnpm.

## Architecture

### Tech Stack
- Next.js 14 (App Router) + TypeScript 5.8
- TinaCMS 2.8 — **local filesystem in dev, Tina Cloud in production**
- Tailwind CSS 3.4 + Radix UI primitives
- PostgreSQL (`pg`) for enquiry submissions only — not for content
- AWS S3 + Thumbor for all media
- Fonts: Vocago (display/serif), BT Beau Sans (body), Pinyon Script (handwriting), Inter (fallback sans)

### How content editing actually works
- `yarn dev` runs TinaCMS against the local filesystem — edits write straight to `content/*.mdx`.
- Production uses **Tina Cloud** (`TINA_CLIENT_ID` / `TINA_TOKEN` in `tina/config.ts`). Editors work at `/admin`; Tina Cloud commits the MDX back to GitHub, which is why most of the git history is `TinaCMS content update`.
- The routes under `src/app/api/tina/` are **non-functional stubs** left over from a self-hosted-backend experiment. Nothing calls them. Don't build on them or assume they serve GraphQL.

### Key Directories
- `src/app/[lang]/` — all pages, URL-based i18n (`/en/*`, `/vi/*`)
- `src/components/` — components; `*Client.tsx` are the client halves used for TinaCMS live editing
- `src/components/blocks/` — content-block renderers (rich text, galleries, text+image, spacing, testimonial)
- `src/lib/` — `db.ts` (Postgres), `mail.ts` + `email-templates/`, `image.ts` (S3/Thumbor URL helpers)
- `tina/collections/` — collection schemas (10 of them, see below)
- `tina/media/S3MediaStore.ts`, `tina/components/MediaManagerScreen.tsx` — custom S3 media store and the custom Media Manager screen that **replaces** Tina's built-in one
- `tina/fields/` — custom image, video, and journal-order field plugins
- `content/` — MDX content
- `config/legacy-post-redirects.mjs` — 301s from retired WordPress `/posts/<slug>` URLs
- `scripts/` — one-off migration helpers (WordPress import, image→S3 migration) and `init-db.sql`

### Collections
`page`, `service`, `about`, `journal`, `blog`, `journal-listing`, `blog-listing`, `love-notes-listing`, `lets-connect`, `footer`.

Content volume: ~61 journals, ~23 blog posts, the rest singletons. Note `content/testimonials/` has no matching collection — love notes are edited through `love-notes-listing`.

### Internationalization Pattern

Routes take a `[lang]` param. **Both languages live in one MDX file** with `*_en` / `*_vi` suffixed fields — there is no `home_en.mdx` / `home_vi.mdx` split.

```typescript
// content/page/home.mdx frontmatter
// title_en: Welcome to Meraki Wedding Planner
// title_vi: Chào mừng đến với Meraki Wedding Planner
// seo_en: { title, description }
// seo_vi: { title, description }

// Pages define this helper locally (there is no shared export):
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

// ...and pick fields by suffix:
const seo = lang === 'en' ? page?.seo_en : page?.seo_vi;
```

### Server/Client Component Pattern

Pages are server components that fetch data, then hand off to a client component for TinaCMS live editing:

```typescript
// page.tsx (Server Component)
import { client } from '@/tina/__generated__/client';
const { data, query, variables } = await client.queries.page({
  relativePath: 'index.mdx'
});
return <PageClient data={data} query={query} variables={variables} />;

// PageClient.tsx (Client Component)
'use client';
import { useTina, tinaField } from 'tinacms/dist/react';

export function PageClient({ data, query, variables }) {
  const { data: tinaData } = useTina({ data, query, variables });
  return <h1 data-tina-field={tinaField(tinaData.page, 'title_en')}>{tinaData.page.title_en}</h1>;
}
```

### TinaCMS Data Fetching
```typescript
import { client } from '@/tina/__generated__/client';

const { data } = await client.queries.journal({ relativePath: 'couple-name.mdx' });
const { data } = await client.queries.journalConnection();
```

### Rendering & Caching
- Every page exports `revalidate = 3600` and `generateStaticParams()` → ISR, hourly. Verified live: responses carry `x-nextjs-cache: HIT` and `cache-control: s-maxage=3600, stale-while-revalidate`.
- `src/app/page.tsx` (bare `/`) is a client component that reads `navigator.language` and `router.replace()`s to `/en` or `/vi`. No server-side locale negotiation.
- `next.config.js` rewrites `/admin` → `/admin/index.html` (Tina builds the admin bundle into `public/admin`, which is gitignored).

### Media Pipeline
No `next/image` anywhere — `images.unoptimized = true` in `next.config.js`.

- Originals live in S3 (`merakiweddingplanner`, `ap-southeast-1`).
- Resizing goes through Thumbor at `https://thumbor.merakiweddingplanner.com/unsafe/{fitMode}/{size}/{url}`.
- Use `MerakiImage` (`src/components/ui/MerakiImage.tsx`) for content images — it builds Thumbor `srcSet`s at 400/800/1200/1600 and caps width at 2000.
- `src/lib/image.ts` has `resolveImageUrl()` (relative path → S3 URL) and `getThumborUrl()`.
- `/api/s3/{upload,list,delete,batch-delete}` back the custom Media Manager. Uploads are **presigned** — the browser PUTs to S3 directly, so no large bodies pass through the app.

### Let's Connect Enquiry Flow
`POST /api/lets-connect` (`runtime = 'nodejs'`, `force-dynamic`):
1. Honeypot check on a hidden `company` field — returns a fake success if filled.
2. Validates first name, last name, email.
3. Persists to Postgres `lets_connect_submissions` (table is created on demand in `src/lib/db.ts`).
4. Best-effort POST to the ERP (`ERP_INQUIRY_URL`, `X-Inquiry-Secret`) to create a Lead — failures are logged, never fatal.
5. Sends a notification to `CONTACT_EMAIL_TO` and a thank-you to the couple via nodemailer/Zoho SMTP.

Every log line carries a `correlationId`. Keep that pattern when extending the route.

## Environment Variables

Runtime (see `.env.example`; `.env.production` in the repo is a placeholder template, not real values):

| Variable | Purpose |
|---|---|
| `TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_BRANCH` | Tina Cloud |
| `TINA_PUBLIC_IS_LOCAL` | `false` in production |
| `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | media store |
| `THUMBOR_BASE` | image resizing base URL |
| `DATABASE_URL` | Postgres for enquiries |
| `ZOHO_EMAIL`, `ZOHO_PASSWORD`, `CONTACT_EMAIL_TO` | SMTP |
| `ERP_INQUIRY_URL`, `ERP_INQUIRY_SECRET` | ERP lead sync |

`TINA_CLIENT_ID` and `TINA_TOKEN` must be present at **build** time, not just runtime.

## Deployment

Docker, on Dokploy at 62.146.238.16 (panel: `panel.merakiweddingplanner.com`).

- Docker Swarm service / container prefix: `merakiweddingplanner-tina-fmfj1t`, listening on 3000
- Traefik routes `v2.merakiweddingplanner.com` (+ a `*.traefik.me` preview host) with Let's Encrypt
- Postgres runs as a separate container on the same host (`merakiweddingplanner-database-*`)
- Thumbor and MinIO are separate services on the same host

Known issues worth knowing before you debug something else:
- The Dockerfile runs `yarn start` (`next start`) while `next.config.js` sets `output: 'standalone'`. Next.js logs `"next start" does not work with "output: standalone"` on every boot. It serves anyway, but the two are mismatched.
- The swarm task is shut down and rescheduled roughly every 12 minutes (clean `SIGTERM`, no application error in the logs). Unresolved.
- `GEMINI_API_KEY` is set on the server but is not referenced anywhere in the code.

## Design System

### Typography (responsive, switches at max-width 744px)
| Class | Desktop | Mobile | Face |
|---|---|---|---|
| `.text-display` | 64px | 40px | Vocago |
| `.text-h1` | 52px | 32px | Vocago |
| `.text-h2` | 32px | 20px | BT Beau Sans (300) |
| `.text-h3` | 36px | 24px | Vocago |
| `.text-h4` | 24px | 20px | Vocago |
| `.text-body-lg` | 20px | 16px | — |
| `.text-body-md` | 16px | 14px | — |
| `.text-body-sm` | 14px | 12px | — |
| `.text-handwriting` | 24px | — | Pinyon Script |

The decorative class is `.text-handwriting` (not `font-handwriting`).

### Colours
Defined as CSS variables in `src/app/globals.css` and exposed as Tailwind tokens. Use the token classes (`text-text-primary`, `bg-background-base`, `border-line-secondary`), never raw hex.

- Text: primary `#374220`, secondary `#535d44`, tertiary `#838978`, disabled `#a6ab9d`, accent `#838d4c`
- Backgrounds: base `#fef5e3`, 1 `#fff1d5`, 2 `#838d4c`, brand `#374220`, support `#b6b38b` / `#ae89cb`
- Lines: accent `#374220`, primary `#696e5e`, secondary `#a6ab9d`, disabled `#caccc3`

### Responsive Breakpoints
```
sm: 375px, md: 744px, lg: 1280px, xl: 1728px
```

## Common Pitfalls

1. **Import `tinaField` from `'tinacms/dist/react'`**, not `'tinacms'`.
2. **Missing `'use client'`** — anything using `useTina`, `useState`, or context needs it.
3. **Don't `@apply` the custom typography classes** — it causes circular dependencies.
4. **Don't reach for `next/image`.** Images are unoptimized by config; use `MerakiImage`, or a plain `<img loading="lazy">` for one-offs.
5. **GraphQL field names must match `tina/__generated__/types.ts` exactly** — regenerate after schema changes.
6. **Language switching** changes the URL segment *and* which `*_en`/`*_vi` field you read — not the `relativePath`.
7. **Don't extend `src/app/api/tina/`** — those handlers are stubs.

## Adding New Content Types

1. Create the schema in `tina/collections/your-collection.ts`
2. Add it to the `collections` array in `tina/config.ts`
3. Run `yarn build` (or `yarn dev`) to regenerate types
4. Add MDX files under `content/your-collection/`
5. Query via the generated client

## Adding New Pages

1. Create `src/app/[lang]/your-page/`
2. Add `page.tsx` (server component) with `revalidate = 3600` and `generateStaticParams()` returning both langs
3. Add a `*Client.tsx` with `useTina()` for live editing
4. Add **one** MDX file with `*_en` / `*_vi` fields

## Project Guides

- `TYPOGRAPHY_GUIDE.md` — full typography documentation
- `JOURNAL_TEMPLATE_GUIDE.md` — journal entry structure and fields
- `tina/GALLERY_FIELD_GUIDE.md` — gallery field usage
- `DOCKPLOY_*.md` — deployment runbooks
