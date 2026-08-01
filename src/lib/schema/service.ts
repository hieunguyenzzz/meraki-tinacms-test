import { resolveImageUrl } from '../image';
import { organizationReference } from './organization';

export interface ServiceSchemaInput {
  lang: string;
  name: string;
  /**
   * Stable key for the graph node id, e.g. `city`. The footer links to
   * `#city-wedding` anchors that do not exist in the rendered page, so `url`
   * stays on the page itself and only `@id` is fragment-qualified.
   */
  key: string;
  /** Multi-paragraph copy from the content file; collapsed to one line. */
  description?: string | null;
  /** Absolute URL of the page describing this service. */
  url: string;
  image?: string | null;
}

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

export function buildServiceSchema({
  lang,
  name,
  key,
  description,
  url,
  image,
}: ServiceSchemaInput) {
  const text = description ? collapseWhitespace(description) : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service-${key}`,
    name,
    serviceType: name,
    ...(text ? { description: text } : {}),
    url,
    ...(image ? { image: resolveImageUrl(image) } : {}),
    provider: organizationReference(lang),
  };
}
