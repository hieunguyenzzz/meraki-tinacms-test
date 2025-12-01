# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meraki Wedding Planner is a bilingual (English/Vietnamese) wedding photography portfolio built with **Next.js 14** (App Router), **TinaCMS** (local, file-based), and **Tailwind CSS**. Features wedding journal galleries, blog, testimonials, and service pages with a custom design system.

## Commands

```bash
yarn dev        # Development server (Next.js + TinaCMS at localhost:3000, admin at /admin)
yarn build      # Production build (tinacms build --local + next build)
yarn start      # Start production server
yarn typecheck  # Type checking
yarn lint       # ESLint
```

**Package Manager**: Yarn 1.22.x only (enforced in package.json). Do NOT use npm or pnpm.

## Architecture

### Tech Stack
- Next.js 14 (App Router) + TypeScript 5.8
- TinaCMS 2.8 (local mode, file-based storage)
- Tailwind CSS 3.4 + Radix UI primitives
- Custom fonts: Vocago (serif), BT Beau Sans, Pinyon Script (handwriting)

### Key Directories
- `src/app/[lang]/` - All pages use URL-based i18n (`/en/*`, `/vi/*`)
- `src/components/` - React components (Header, Footer, *Client.tsx for TinaCMS editing)
- `tina/collections/` - TinaCMS schema definitions (Page, Blog, Journal, Testimonial)
- `content/` - MDX content files organized by type
- `public/images/` - Static assets

### Internationalization Pattern
All routes use `[lang]` dynamic parameter. Content fields use `*_en`/`*_vi` suffixes.

```typescript
// Helper used throughout
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

// Content file naming: home_en.mdx, home_vi.mdx
```

### Server/Client Component Pattern
Pages are server components that fetch data, then pass to client components for TinaCMS live editing:

```typescript
// page.tsx (Server Component)
import { client } from '@/tina/__generated__/client';
const { data, query, variables } = await client.queries.page({
  relativePath: `home_${params.lang}.mdx`
});
return <PageClient data={data} query={query} variables={variables} />;

// PageClient.tsx (Client Component)
'use client';
import { useTina, tinaField } from 'tinacms/dist/react';

export function PageClient({ data, query, variables }) {
  const { data: tinaData } = useTina({ data, query, variables });
  return <h1 data-tina-field={tinaField(tinaData.page, 'title')}>{tinaData.page.title}</h1>;
}
```

### TinaCMS Data Fetching
```typescript
import { client } from '@/tina/__generated__/client';

// Single document
const { data } = await client.queries.journal({ relativePath: 'couple-name.mdx' });

// Collection listing
const { data } = await client.queries.journalConnection();
```

## Design System

### Typography (responsive, auto-scales at 744px breakpoint)
- `.text-display` - 64px / 40px mobile
- `.text-h1` - 52px / 32px mobile
- `.text-h2` - 36px / 24px mobile
- `.text-h4` - 24px / 20px mobile
- `.text-body-lg/md/sm` - Body text sizes
- `.font-handwriting` - Pinyon Script decorative

### Colors (CSS Variables)
- Primary text: `#374220` (dark olive)
- Secondary: `#535d44`, `#838978`, `#a6ab9d`
- Background: `#fef5e3` (cream), `#fff1d5`
- Accents: `#838d4c` (olive), `#ae89cb` (purple)

Use CSS variable classes (`text-text-primary`, `bg-background-base`) not hardcoded hex values.

### Responsive Breakpoints
```
sm: 375px, md: 744px, lg: 1280px, xl: 1728px
```

## Common Pitfalls

1. **Import tinaField correctly**: Use `'tinacms/dist/react'` not `'tinacms'`
2. **Missing 'use client'**: Components with hooks (useTina, useState) need directive at top
3. **Don't use @apply with custom typography classes**: Causes circular dependencies
4. **Image lazy loading**: All images must use lazy loading
   ```tsx
   // Next.js Image (default lazy)
   <Image src={image} alt={alt} width={800} height={600} unoptimized />

   // Regular img tags
   <img src={image} alt={alt} loading="lazy" />
   ```
5. **GraphQL queries**: Must match exact field names from `tina/__generated__/types.ts`
6. **Language switching**: Update both URL path and content query suffix

## Adding New Content Types

1. Create schema in `tina/collections/your-collection.ts`
2. Import in `tina/config.ts` collections array
3. Run `yarn build` to regenerate types
4. Create content MDX files in `content/your-collection/`
5. Query via generated client

## Adding New Pages

1. Create folder in `src/app/[lang]/your-page/`
2. Add `page.tsx` server component that fetches data
3. Create `*Client.tsx` component with `useTina()` for live editing
4. Create both `*_en.mdx` and `*_vi.mdx` content files

## Project Guides

- `TYPOGRAPHY_GUIDE.md` - Full typography system documentation
- `JOURNAL_TEMPLATE_GUIDE.md` - Wedding journal entry structure and fields
