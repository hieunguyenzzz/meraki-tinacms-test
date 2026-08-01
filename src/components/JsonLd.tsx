interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Serialises a schema block for embedding in a `<script>` element.
 *
 * The payload is machine-built JSON, never author-supplied HTML, and
 * `JSON.stringify` already neutralises quotes and control characters. The only
 * remaining escape needed is `<`, which stops a content string containing
 * `</script>` from closing the element early. `<` is valid JSON and parses
 * back to `<`, so the data survives intact.
 */
const serialize = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

/**
 * Renders one `<script type="application/ld+json">` per schema block.
 *
 * Deliberately a server component with no `'use client'`: the markup has to be
 * in the HTML the crawler receives, not injected after hydration.
 *
 * Raw injection is unavoidable here — React escapes text children as HTML
 * entities, and entities are not decoded inside a `<script>` element, so an
 * ampersand in the content would reach the parser as the literal `&amp;`.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: serialize(block) }}
        />
      ))}
    </>
  );
}
