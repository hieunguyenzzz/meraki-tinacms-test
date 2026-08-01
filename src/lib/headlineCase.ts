/**
 * Presentation casing for journal album headlines.
 *
 * 47 of 60 journals store `main_headline_*` in ALL CAPS, because the hero
 * renders it through a CSS `uppercase` class — the caps in the CMS field are
 * cosmetically redundant on the page. They are not redundant in a `<title>`,
 * where they read as shouting and invite Google to rewrite the snippet with
 * text of its own. Normalise for metadata and structured data only; the stored
 * field and the rendered hero stay exactly as the editor typed them.
 *
 * Headlines already written in mixed case pass through untouched, so an editor
 * who deliberately capitalises a stylised name keeps it.
 */

/**
 * Which convention to apply is decided by the *text*, not by the route locale.
 * Every `main_headline_vi` in `content/journal` is currently identical to its
 * `_en` twin — album names are English by design, with one Vietnamese
 * exception — so keying off `[lang]` would render the same string as
 * "Sky of Love" on /en and "Sky of love" on /vi.
 *
 * These code points are effectively Vietnamese-only: the Latin Extended
 * Additional block plus ơ/ư/đ. Shared accents like é and à are deliberately
 * excluded, since they also occur in names the site treats as English.
 */
function isVietnamese(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= 0x1ea0 && code <= 0x1ef9) return true;
    // ơ Ơ ư Ư đ Đ
    if (
      code === 0x01a1 ||
      code === 0x01a0 ||
      code === 0x01b0 ||
      code === 0x01af ||
      code === 0x0111 ||
      code === 0x0110
    ) {
      return true;
    }
  }
  return false;
}

/** True for a character that has distinct upper and lower forms. */
function isCased(char: string): boolean {
  return char.toLowerCase() !== char.toUpperCase();
}

function firstCasedIndex(value: string): number {
  for (let i = 0; i < value.length; i += 1) {
    if (isCased(value.charAt(i))) return i;
  }
  return -1;
}

/**
 * Whether the headline carries no case information worth preserving — every
 * cased letter is uppercase. Avoids Unicode property escapes, which the ES5
 * target rejects; `toUpperCase`/`toLowerCase` are Unicode-aware anyway, so
 * Vietnamese diacritics compare correctly.
 */
export function isAllCaps(value: string): boolean {
  return value === value.toUpperCase() && value !== value.toLowerCase();
}

/**
 * Lowercased inside a title, unless first or last. Deliberately excludes
 * `is`/`are`/`be`, which conventional title case capitalises.
 */
const SMALL_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'from',
  'in',
  'into',
  'nor',
  'of',
  'on',
  'or',
  'over',
  'the',
  'to',
  'up',
  'via',
  'with',
]);

/**
 * Uppercase the first cased letter, lowercase the rest. Leading punctuation
 * such as an opening quote is stepped over, so `"STORMBORN"` → `"Stormborn"`.
 */
function capitalise(word: string): string {
  const index = firstCasedIndex(word);
  if (index === -1) return word;

  return (
    word.slice(0, index) +
    word.charAt(index).toUpperCase() +
    word.slice(index + 1).toLowerCase()
  );
}

/** The bare letters of a token, for matching against SMALL_WORDS. */
function wordCore(word: string): string {
  let core = '';
  for (let i = 0; i < word.length; i += 1) {
    const char = word.charAt(i);
    if (isCased(char)) core += char;
  }
  return core.toLowerCase();
}

/** Hyphenated compounds capitalise both halves: `GROWN-UPS` → `Grown-Ups`. */
function capitaliseCompound(word: string): string {
  return word.split('-').map(capitalise).join('-');
}

/** English convention: capitalise every word except interior small words. */
function toTitleCase(value: string): string {
  const words = value.split(/\s+/);

  return words
    .map((word, index) => {
      const isEdge = index === 0 || index === words.length - 1;
      if (!isEdge && SMALL_WORDS.has(wordCore(word))) {
        return word.toLowerCase();
      }
      return capitaliseCompound(word);
    })
    .join(' ');
}

/**
 * Vietnamese convention: only the opening word is capitalised. Applied to the
 * whole string rather than per sentence — these headlines are single phrases.
 */
function toSentenceCase(value: string): string {
  const lower = value.toLowerCase();
  const index = firstCasedIndex(lower);
  if (index === -1) return lower;

  return (
    lower.slice(0, index) +
    lower.charAt(index).toUpperCase() +
    lower.slice(index + 1)
  );
}

/**
 * Normalise a headline for display in metadata. Returns '' for blank input so
 * callers can fall back with `||`.
 */
export function displayHeadline(value: string | null | undefined): string {
  const trimmed = (value ?? '').replace(/\s+/g, ' ').trim();
  if (!trimmed || !isAllCaps(trimmed)) return trimmed;

  return isVietnamese(trimmed) ? toSentenceCase(trimmed) : toTitleCase(trimmed);
}
