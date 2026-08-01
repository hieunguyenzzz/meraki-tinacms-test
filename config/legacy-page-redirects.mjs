import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Permanent redirects for the retired top-level pages of the old site.
 *
 * Companion to legacy-post-redirects.mjs, which covers /posts/*. Same locale
 * scheme: the old site ran Next.js i18n with `defaultLocale: 'en'`, so English
 * pages were unprefixed and Vietnamese ones sat under /vi.
 *
 * Several sections were renamed in v2 — gallery became journal, kind-words became
 * love-notes, contact became lets-connect — so none of these paths resolve any
 * more. Every one of them still returns 200 on the old apex and is indexed.
 */

const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../content');

/** Old top-level path -> the v2 section it became, relative to /[lang]. */
const PAGE_MAP = {
  about: 'about',
  services: 'service',
  'kind-words': 'love-notes',
  contact: 'lets-connect',
  blog: 'blog',
  // The old site split its listing across /blog and /blog/all; v2 paginates one.
  'blog/all': 'blog',
  gallery: 'journal',
  // No v2 equivalent. Service is the nearest match in intent — a couple looking
  // for the planning checklist wants to know what Meraki does.
  planningchecklist: 'service',
};

/**
 * Wedding galleries the old site published at /gallery/<slug>. Only 5 of the 18
 * were carried into content/journal, and the rest are deliberately not being
 * migrated, so they land on the journal listing rather than 404.
 *
 * Kept as a literal list because the old site is frozen. The destination is still
 * resolved from content below rather than hardcoded, so the split stays correct if
 * a journal is ever added or renamed.
 */
const LEGACY_GALLERIES = [
  'ha-duy',
  'jamie-jeremy',
  'lana-duy',
  'lele-thomas',
  'lucia-qui',
  'lucy-sam',
  'mai-chris',
  'nhung-ken',
  'phong-hoang',
  'tess-andy',
  'thao-minh',
  'thu-son',
  'thuong-tung-anh',
  'trang-binh',
  'truc-huy',
  'tu-thao',
  'uyen-bill',
  'xu-hieu',
];

const LANGS = ['en', 'vi'];

/** The journal route resolves by filename, so existence is a file check. */
const journalExists = (slug) =>
  existsSync(join(CONTENT_DIR, 'journal', `${slug}.mdx`));

/** Old English pages were unprefixed; Vietnamese ones carried /vi. */
const legacySource = (lang, path) => (lang === 'vi' ? `/vi/${path}` : `/${path}`);

export const legacyPageRedirects = () => {
  const redirects = [];

  const add = (source, destination) => {
    // /vi/about and /vi/blog already point at the real v2 route, and redirects run
    // before routing — emitting them would be an infinite loop, not a no-op.
    if (source === destination) return;
    redirects.push({ source, destination, statusCode: 301 });
  };

  for (const lang of LANGS) {
    for (const [from, section] of Object.entries(PAGE_MAP)) {
      add(legacySource(lang, from), `/${lang}/${section}`);
    }

    // Only the galleries that became journals need a rule of their own — the rest
    // are covered by the catch-all below, which sends them to the same listing.
    for (const slug of LEGACY_GALLERIES.filter(journalExists)) {
      add(legacySource(lang, `gallery/${slug}`), `/${lang}/journal/${slug}`);
    }

    // Anything under /gallery not listed above. Must stay after the explicit
    // entries, which Next.js honours by array order.
    add(legacySource(lang, 'gallery/:slug'), `/${lang}/journal`);
  }

  return redirects;
};
