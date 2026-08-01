/**
 * Shared between the listing server components and their client counterparts so
 * the page sliced into the server HTML matches what the client renders.
 */
export const LISTING_PAGE_SIZE = 12;

export function parsePageParam(
  value: string | string[] | undefined
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function totalListingPages(itemCount: number) {
  return Math.ceil(itemCount / LISTING_PAGE_SIZE);
}

export function listingPageUrl(basePath: string, page: number) {
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}
