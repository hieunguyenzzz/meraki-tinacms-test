# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meraki Wedding Planner is a bilingual (English/Vietnamese) wedding photography and planning portfolio built with **Next.js 14** and **TinaCMS**. It features a wedding journal (gallery), blog, testimonials, and service pages with a custom design system and editorial workflow.

## Development Setup & Commands

### Essential Commands
```bash
# Development server (runs Next.js + TinaCMS)
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Type checking
yarn typecheck

# Linting
yarn lint

# Run single test (not configured yet - would use Next.js testing setup)
# Jest/Vitest not yet configured in this project
```

### Package Manager
**Yarn 1.22.0** is required (specified in `packageManager` field). Do NOT use npm or pnpm.

### Environment Setup
- Node.js >= 18.0.0 required
- `.env` file needed for TinaCMS integration (see `.env.example`)
- TinaCMS runs locally with file-based storage in `public/` folder
- Development URL: `http://localhost:3000` (with TinaCMS admin at `/admin`)

## Architecture & Code Structure

### Tech Stack
- **Framework**: Next.js 14 (App Router) with TypeScript 5.8
- **CMS**: TinaCMS 2.8 (local, file-based, not cloud)
- **Styling**: Tailwind CSS 3.4 + Radix UI primitives
- **UI Components**: Custom Radix UI components in `src/components/ui/`
- **Fonts**: Custom fonts (Vocago serif, BT Beau Sans, Pinyon Script handwriting)

### Directory Structure

```
src/
├── app/
│   ├── page.tsx                    # Root redirect to language home
│   ├── [lang]/
│   │   ├── page.tsx               # Homepage (dynamic per language)
│   │   ├── journal/               # Wedding gallery routes
│   │   ├── blog/                  # Blog routes
│   │   ├── about/                 # About page
│   │   ├── service/               # Services
│   │   ├── social-media/          # Social links
│   │   ├── lets-connect/          # Contact
│   │   └── love-notes/            # Additional pages
│   └── api/tina/gql/route.ts      # TinaCMS GraphQL endpoint
├── components/
│   ├── Header.tsx                 # Navigation with language switcher
│   ├── Footer.tsx                 # Footer
│   ├── *Client.tsx                # Client components for Tina editing
│   ├── Lightbox.tsx               # Image gallery/lightbox
│   ├── JournalTemplate.tsx        # Special layout for journal entries
│   └── ui/                        # Radix UI-based components
└── lib/
    └── utils.ts                   # Utility functions (cn() for Tailwind merging)

tina/
├── config.ts                      # Main TinaCMS configuration
└── collections/
    ├── page.ts                    # Page content type definition
    ├── blog.ts                    # Blog post schema
    ├── journal.ts                 # Wedding journal schema
    └── testimonial.ts             # Client testimonial schema

content/
├── page/                          # Page content files (MDX)
├── blog/                          # Blog posts (MDX)
├── journal/                       # Wedding journal entries (MDX)
└── testimonials/                  # Testimonial files (MDX)
```

### Key Architecture Patterns

#### 1. Internationalization (i18n)
- **URL-based**: All routes use `[lang]` dynamic parameter (`/en/*`, `/vi/*`)
- **Content**: All content types have bilingual fields (e.g., `title_en`, `title_vi`)
- **Helper function**: `t(text: {en: string; vi: string}, lang: string)` used throughout
- **Content suffixes**: Files use `_en` and `_vi` suffixes for organization

#### 2. TinaCMS Integration
- **Local-first**: No cloud APIs used (clientId/token = null)
- **File-based storage**: Content stored as MDX in `/content` directory
- **Live editing**: Client components use `useTina()` hook and `tinaField()` markers
- **Collections**: Page, Blog, Journal, Testimonial types defined in `tina/collections/`
- **Build process**: `tinacms build --local` generates schema before Next.js build

#### 3. Data Fetching Pattern
```typescript
// Server-side: Fetch via TinaCMS client
import { client } from '@/tina/__generated__/client'
const { data } = await client.queries.page({ relativePath: 'home_en.mdx' })

// Client-side: Wrap with useTina() for live editing
const { data } = useTina({ query, data })
```

#### 4. Component Pattern - Server + Client Splits
- Pages are server components that fetch content
- Client components (e.g., `HomeClient.tsx`) wrap content with `useTina()` and handle interactivity
- `tinaField()` markup enables in-place editing in TinaCMS visual editor

#### 5. Responsive Design
- **Mobile-first**: Custom breakpoints optimized for mobile experience
  - sm: 375px, md: 744px, lg: 1280px, xl: 1728px
- **Typography system**: Predefined responsive text classes with automatic mobile scaling
  - See [TYPOGRAPHY_GUIDE.md](TYPOGRAPHY_GUIDE.md) for all available classes
- **CSS variables**: Design tokens in `globals.css` for colors, typography, spacing

### Design System

#### Colors (CSS Variables)
- **Primary text**: `#374220` (dark olive green)
- **Secondary text**: `#535d44`, `#838978`, `#a6ab9d` (decreasing contrast)
- **Background**: `#fef5e3` (cream), `#fff1d5` (off-white)
- **Accents**: `#838d4c` (olive), `#ae89cb` (purple)

#### Typography
All classes are **responsive by default** with automatic mobile scaling at 744px breakpoint:
- `.text-display` - 64px / 40px mobile
- `.text-h1` - 52px / 32px mobile
- `.text-h2` - 36px / 24px mobile
- `.text-h2-beau` - BT Beau Sans variant, 32px / 20px mobile
- `.text-h4` - 24px / 20px mobile
- `.text-body-lg/md/sm` - Body text with multiple sizes
- `.font-handwriting` - Pinyon Script (decorative)

See [TYPOGRAPHY_GUIDE.md](TYPOGRAPHY_GUIDE.md) for detailed usage.

#### Journal Template
See [JOURNAL_TEMPLATE_GUIDE.md](JOURNAL_TEMPLATE_GUIDE.md) for the wedding journal entry structure:
- Two-column layout (40/60 split)
- Bilingual content (EN/VI)
- Customizable images, text, testimonials
- All fields editable via TinaCMS

## TinaCMS Content Collections Schema

### Page
- Hero sections, services, SEO metadata
- Supports multiple language versions via `*_en` and `*_vi` suffixes

### Blog
- Rich-text content with `TinaMarkdown`
- Featured images, excerpt, categories, tags
- Bilingual support with publish status
- Query: `client.queries.blogConnection()` for listings

### Journal (Wedding Entries)
- Complex template with left/right column layout
- Multiple image placements (detail, ceremony, portrait)
- Bilingual text fields
- Wedding details (date, venue, location, guest count, type)
- Embedded testimonials
- Query: `client.queries.journalConnection()` for gallery listings

### Testimonial
- Client quote (bilingual), name, rating, photo
- Featured flag for homepage display

## Configuration Files

### `next.config.js`
- Rewrites `/admin` route to TinaCMS UI
- Webpack fallbacks for Node modules (fs, path)
- Page extensions configured

### `tailwind.config.ts`
- Custom design tokens (colors, typography, spacing)
- 3 custom font families imported via @font-face
- Animation utilities (e.g., footer gradient animation)
- Background image patterns (paper texture)
- Responsive breakpoints

### `tsconfig.json`
- Path alias: `@/*` → `./src/*`
- Includes `tina/` in compilation
- ES5 target for broad compatibility

### `globals.css`
- CSS variable definitions for entire design system
- @font-face declarations for custom fonts
- Component utility classes (typography, backgrounds)
- Responsive overrides for typography at `@media (max-width: 744px)`

### `.eslintrc.cjs` + `.eslintrc.json`
- Base config extends eslint:recommended + Next.js config
- React, TypeScript, JSX-a11y, React Hooks plugins
- Import resolver configured for TypeScript paths
- Stricter TypeScript rules enabled

## Important Development Notes

### Migration Context
This project was recently migrated from **Remix to Next.js** (see [MIGRATION.md](MIGRATION.md)):
- Old Remix app in `app-old/` (archived for reference)
- New app structure follows Next.js App Router conventions
- TinaCMS integration updated for Next.js API routes
- Some routes (journal, blog detail pages) may still need refinement

### Tina Workflow
1. Edit content via TinaCMS admin UI (`/admin`)
2. Changes saved to MDX files in `/content`
3. Run `yarn build` to regenerate TinaCMS schema
4. Server-side pages import and use the generated client (`@/tina/__generated__/client`)

### Adding New Pages
1. Create folder in `src/app/[lang]/your-page/`
2. Add `page.tsx` server component
3. Define data structure in `tina/collections/` if new content type needed
4. Use `useTina()` in client component for live editing

### Language Handling
- Always check `params.lang` from route params
- Create both `*_en` and `*_vi` content files
- Use `t()` helper: `const title = t({en: 'Title', vi: 'Tiêu đề'}, lang)`
- Content files follow naming: `home_en.mdx`, `home_vi.mdx`

## SEO & Metadata
- Use Next.js metadata API in page components
- Open Graph tags for social sharing in component metadata
- Structured data (JSON-LD) not yet implemented - consider adding
- Bilingual sitemaps/robots.txt generation recommended

## Common Tasks

### Running the dev server
```bash
yarn dev
```
Opens localhost:3000 with hot reload. TinaCMS admin available at `/admin`.

### Building for production
```bash
yarn build
yarn start
```
Runs TinaCMS build to generate schema, then Next.js build.

### Type checking entire project
```bash
yarn typecheck
```
Catches TypeScript errors across entire codebase.

### Linting code
```bash
yarn lint
```
Runs ESLint with Next.js + React + TypeScript rules.

### Creating new journal entries
1. Create MDX file in `content/journal/slug_en.mdx` and `slug_vi.mdx`
2. Follow template structure from [JOURNAL_TEMPLATE_GUIDE.md](JOURNAL_TEMPLATE_GUIDE.md)
3. Use TinaCMS admin to refine and publish
4. Entries appear in `/en/journal` and `/vi/journal` automatically

## Resources & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **TinaCMS Docs**: https://tina.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/docs
- **Project Guides**: See TYPOGRAPHY_GUIDE.md, JOURNAL_TEMPLATE_GUIDE.md
