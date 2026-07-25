/**
 * HTML -> Markdown conversion for imported WordPress post bodies.
 *
 * The source is WordPress classic-editor markup: bare text paragraphs separated
 * by blank lines, plus h2/h3/h5, strong/b, em/i, ul/ol/li, a, br, figure.
 * Only those constructs are handled on purpose - anything else is stripped.
 */

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  ndash: '–',
  mdash: '—',
  eacute: 'é',
  agrave: 'à',
};

export const decodeEntities = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name) => {
      const key = name.toLowerCase();
      return key in NAMED_ENTITIES ? NAMED_ENTITIES[key] : match;
    });

/** Strip editor noise that carries no content. */
export const stripNoise = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

const convertLists = (html) =>
  html.replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, body) => {
    const items = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(
      (match, index) => {
        const text = match[1].replace(/\s+/g, ' ').trim();
        return tag.toLowerCase() === 'ol'
          ? `${index + 1}. ${text}`
          : `- ${text}`;
      },
    );
    return `\n\n${items.join('\n')}\n\n`;
  });

const convertInline = (html) =>
  html
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');

const collapseBlankLines = (text) =>
  text
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/**
 * A few Vietnamese headings were typed with a space between every letter for
 * visual effect ("T Í N H C H Ấ T"), which reads as gibberish as a markdown
 * heading. The source spaces words and letters identically, so the word breaks
 * cannot be inferred - these are the ones that actually occur, spelled out.
 * Anything not listed is left exactly as authored rather than guessed at.
 */
const LETTER_SPACED_HEADINGS = new Map([
  ['TÍNHCHẤT', 'TÍNH CHẤT'],
  ['ĐIỂMMẠNH', 'ĐIỂM MẠNH'],
  ['ĐIỂMHẠNCHẾ', 'ĐIỂM HẠN CHẾ'],
  ['TẠMKẾT', 'TẠM KẾT'],
]);

const unspaceHeadings = (text) =>
  text.replace(/^(#{2,6} .*)$/gm, (line) =>
    line.replace(/(?:\p{L} ){2,}\p{L}(?!\p{L})/gu, (run) => {
      const welded = run.replace(/ /g, '');
      return LETTER_SPACED_HEADINGS.get(welded) ?? run;
    }),
  );

/**
 * Remove emphasis markers that ended up wrapping nothing. The inner pattern
 * requires real whitespace so that legitimate **bold** is left alone.
 */
const dropEmptyEmphasis = (text) =>
  text.replace(/\*\*\s*\*\*/g, '').replace(/(?<!\*)\*\s+\*(?!\*)/g, '');

export const htmlToMarkdown = (html) => {
  // Normalise CRLF and non-breaking spaces up front: both survive into the YAML
  // output otherwise, forcing escaped double-quoted scalars instead of readable
  // block scalars.
  let out = stripNoise(html).replace(/\r\n?/g, '\n').replace(/ /g, ' ');

  out = out.replace(/<br\s*\/?>/gi, '\n');
  out = out.replace(/<\/?figure[^>]*>/gi, '\n\n');
  out = convertLists(out);
  out = out.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
    // Newlines and tabs collapse, but runs of spaces are kept: they are the only
    // signal of word boundaries in letter-spaced headings.
    (_, level, body) =>
      `\n\n${'#'.repeat(Math.max(2, Number(level)))} ${body.replace(/[\n\t]+/g, ' ').trim()}\n\n`,
  );
  out = convertInline(out);
  out = out.replace(/<\/p\s*>/gi, '\n\n').replace(/<p[^>]*>/gi, '');
  out = out.replace(/<[^>]+>/g, '');
  out = decodeEntities(out).replace(/ /g, ' ');
  out = dropEmptyEmphasis(out);

  return unspaceHeadings(collapseBlankLines(out));
};

/** Plain text, for excerpts. */
export const markdownToPlain = (markdown) =>
  markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/(?<!\*)\*(?!\*)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[-\d]+[.)]?\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
