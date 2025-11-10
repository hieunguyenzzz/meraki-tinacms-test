# GitHub Copilot Instructions - Meraki Wedding Planner

## Project Context
Bilingual (EN/VI) wedding portfolio built with Next.js 14 App Router + TinaCMS (local, file-based). Custom design system with responsive typography and Figma-sourced layouts.

## Critical Workflows

### Package Management
**ALWAYS use Yarn 1.22.x** - never npm/pnpm (enforced in package.json). All commands: `yarn dev`, `yarn build`, `yarn typecheck`.

### Development Server
```bash
yarn dev  # Starts Next.js + TinaCMS dev server (localhost:3000, admin at /admin)
```

### TinaCMS Content Editing
1. Content lives in `content/{page,blog,journal,testimonials}/` as MDX files
2. Schema defined in `tina/collections/` - regenerate after schema changes with `yarn build`
3. All content fields are bilingual: use `*_en` and `*_vi` suffixes (e.g., `title_en`, `title_vi`)
4. Client components must wrap with `useTina()` hook and mark editable fields with `tinaField()`

## Code Patterns

### Internationalization (i18n)
**URL-based routing**: All pages under `src/app/[lang]/` receive `params.lang` ('en' or 'vi').

```typescript
// Helper function used project-wide
const t = (text: { en: string; vi: string }, lang: string) => 
  lang === 'en' ? text.en : text.vi;

// Usage in components
const title = t({ en: 'Home', vi: 'Trang chủ' }, lang);
```

**Content files**: Name with language suffix (`home_en.mdx`, `home_vi.mdx`).

### Server/Client Component Split
**Pattern**: Server components fetch data → pass to Client components for TinaCMS live editing.

```typescript
// page.tsx (Server Component)
export default async function Page({ params }: { params: { lang: string } }) {
  const { data } = await client.queries.page({ relativePath: `home_${params.lang}.mdx` });
  return <PageClient data={data} query={query} variables={variables} lang={params.lang} />;
}

// PageClient.tsx (Client Component)
'use client';
import { useTina, tinaField } from 'tinacms/dist/react';

export default function PageClient({ data, query, variables, lang }) {
  const { data: tinaData } = useTina({ data, query, variables });
  return <h1 data-tina-field={tinaField(tinaData.page, 'title')}>{tinaData.page.title_en}</h1>;
}
```

### Styling Conventions

**Typography**: Use semantic responsive classes from `globals.css` (auto-scale at 744px breakpoint):
```tsx
<h1 className="text-display">  // 64px desktop → 40px mobile
<h2 className="text-h2">       // 36px → 24px
<p className="text-body-lg">   // 20px → 16px
```

**Colors**: Use CSS variable tokens, not hardcoded values:
```tsx
className="bg-background-base text-text-primary"  // ✅ Correct
className="bg-[#fef5e3] text-[#374220]"           // ❌ Avoid
```

**Font families**: `font-vocago` (serif), `font-bt-beau-sans` (sans), `font-handwriting` (Pinyon Script).

### Journal Template Pattern
Wedding journals use special two-column layout (`JournalTemplate.tsx`):
- Left column (40%): Logo, couple info, wedding details, ceremony photo
- Right column (60%): Large portrait (75%), testimonial (25%)
- All content from `template_layout` and `testimonial` fields in schema
- See `JOURNAL_TEMPLATE_GUIDE.md` for field structure

## Schema & Data Fetching

### TinaCMS Collections
**Four content types** in `tina/collections/`: Page, Blog, Journal, Testimonial.

**Query pattern**:
```typescript
import { client } from '@/tina/__generated__/client';

// Single document
const { data } = await client.queries.journal({ relativePath: 'couple-name.mdx' });

// Collection listing
const { data } = await client.queries.journalConnection();
```

**Adding new collection**:
1. Create schema in `tina/collections/your-collection.ts`
2. Import in `tina/config.ts` collections array
3. Run `yarn build` to regenerate types in `tina/__generated__/`
4. Use generated client for queries

### Responsive Breakpoints
```typescript
// tailwind.config.ts custom breakpoints
sm: '375px'   // mobile
md: '744px'   // tablet
lg: '1280px'  // desktop
xl: '1728px'  // large desktop
```

## Component Architecture

### Radix UI Integration
Primitive components in `src/components/ui/` built with Radix + Tailwind:
- Import from `@/components/ui/{button,dialog,accordion,...}`
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow existing component patterns for consistency

### Image Handling
**Assets location**: `public/images/{journal,blog,bg}/` - reference as `/images/...` in MDX.

**Next.js Image**: Use `<Image>` with `unoptimized` flag for TinaCMS-managed images:
```tsx
<Image src={image} alt={alt} width={800} height={600} unoptimized />
```

**Lazy Loading**: **ALL images must use lazy loading** for performance:
```tsx
// For Next.js Image component (default is lazy)
<Image src={image} alt={alt} width={800} height={600} unoptimized />

// For regular <img> tags, always add loading="lazy"
<img src={image} alt={alt} loading="lazy" />
```

## Common Pitfalls

1. **Don't use `@apply` with custom typography classes** - causes circular dependencies. Use component classes directly.
2. **Import tinaField from correct path**: `'tinacms/dist/react'` not `'tinacms'`.
3. **GraphQL queries**: Must match exact schema field names from `tina/__generated__/types.ts`.
4. **Language switching**: Update both URL (`/en/` → `/vi/`) and content query (`*_en.mdx` → `*_vi.mdx`).
5. **Missing `'use client'`**: Components using hooks (`useTina`, `useState`) must have directive at top.

## Documentation References
- Typography system: `TYPOGRAPHY_GUIDE.md`
- Journal layouts: `JOURNAL_TEMPLATE_GUIDE.md`
- Migration notes: `MIGRATION.md`
- Full AI guide: `.claude/CLAUDE.md`
