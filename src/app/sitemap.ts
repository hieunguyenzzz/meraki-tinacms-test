import { client } from '../../tina/__generated__/client';
import { SITE_URL } from '../lib/siteUrl';
import type { MetadataRoute } from 'next';

// Match the ISR window used by the pages themselves.
export const revalidate = 3600;

type LocalisedPaths = { en: string; vi: string };

type Connection<TNode> = {
  edges?: ({ node?: TNode | null } | null)[] | null;
  pageInfo: { hasNextPage: boolean; endCursor?: string | null };
};

// Tina caps connection queries at 50 documents per page, so anything larger
// (journals) silently truncates unless every page is walked.
const PAGE_SIZE = 100;

// Every non-dynamic route under src/app/[lang].
const STATIC_PATHS = [
  '',
  '/about',
  '/blog',
  '/journal',
  '/lets-connect',
  '/love-notes',
  '/service',
  '/social-media',
];

async function fetchAllNodes<TNode>(
  fetchPage: (after?: string) => Promise<Connection<TNode>>
): Promise<TNode[]> {
  const nodes: TNode[] = [];
  let after: string | undefined;

  for (;;) {
    const connection = await fetchPage(after);

    for (const edge of connection.edges || []) {
      if (edge?.node) nodes.push(edge.node);
    }

    const { hasNextPage, endCursor } = connection.pageInfo;
    if (!hasNextPage || !endCursor || endCursor === after) break;
    after = endCursor;
  }

  return nodes;
}

// One entry per locale, each carrying the hreflang pair so the sitemap
// declares the en/vi relationship.
function localisedEntries(
  paths: LocalisedPaths,
  lastModified?: string
): MetadataRoute.Sitemap {
  // The homepage pair is the one case with a locale-neutral URL to fall back to:
  // `/` detects the browser language. Everywhere else English is the default.
  const isHome = paths.en === '/en';

  const languages = {
    en: `${SITE_URL}${paths.en}`,
    vi: `${SITE_URL}${paths.vi}`,
    'x-default': isHome ? `${SITE_URL}/` : `${SITE_URL}${paths.en}`,
  };

  return [
    { url: languages.en, lastModified, alternates: { languages } },
    { url: languages.vi, lastModified, alternates: { languages } },
  ];
}

async function journalEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const journals = await fetchAllNodes((after) =>
      client.queries
        .journalConnection({ first: PAGE_SIZE, after })
        .then((result) => result.data.journalConnection)
    );

    return journals.flatMap((node) => {
      // The journal route resolves by filename, and `slug` mirrors it.
      const slug = node.slug?.trim();
      if (!slug || !node.published) return [];

      return localisedEntries({
        en: `/en/journal/${slug}`,
        vi: `/vi/journal/${slug}`,
      });
    });
  } catch (error) {
    console.error('sitemap: failed to load journals', error);
    return [];
  }
}

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await fetchAllNodes((after) =>
      client.queries
        .blogConnection({ first: PAGE_SIZE, after })
        .then((result) => result.data.blogConnection)
    );

    return posts.flatMap((node) => {
      // Unpublished posts 404 on the blog route, so they must stay out.
      if (!node.published) return [];

      // Blog routes resolve by the `slug` / `slug_vi` fields, not the filename.
      const fallback = node._sys?.filename?.replace(/\.mdx$/, '').trim();
      const slugEn = node.slug?.trim() || fallback;
      if (!slugEn) return [];
      const slugVi = node.slug_vi?.trim() || slugEn;

      // Detail pages live under /posts, not under the /blog listing.
      return localisedEntries(
        { en: `/en/posts/${slugEn}`, vi: `/vi/posts/${slugVi}` },
        node.published_date || undefined
      );
    });
  } catch (error) {
    console.error('sitemap: failed to load blog posts', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [journals, posts] = await Promise.all([
    journalEntries(),
    blogEntries(),
  ]);

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    localisedEntries({ en: `/en${path}`, vi: `/vi${path}` })
  );

  return [...staticEntries, ...journals, ...posts];
}
