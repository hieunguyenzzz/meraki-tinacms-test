/**
 * Builds the bilingual content_blocks array for one topic.
 *
 * The English and Vietnamese WordPress posts are separate documents, but they
 * were translated paragraph-for-paragraph, so their text runs line up by index.
 * Structure (where images sit) is taken from the English post; the Vietnamese
 * text is slotted into the matching run.
 */

import { htmlToMarkdown, markdownToPlain, stripNoise } from './html-to-markdown.mjs';

const IMG_SPLIT = /(<img[^>]*>)/i;

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
};

/** Split a post body into an ordered list of text and image runs. */
export const parseRuns = (html) => {
  const runs = [];

  for (const chunk of stripNoise(html).split(IMG_SPLIT)) {
    if (!chunk) {
      continue;
    }

    if (/^<img/i.test(chunk)) {
      const src = attr(chunk, 'src');
      if (src) {
        runs.push({ type: 'image', src, alt: attr(chunk, 'alt') });
      }
      continue;
    }

    const markdown = htmlToMarkdown(chunk);
    if (markdownToPlain(markdown).length > 0) {
      runs.push({ type: 'text', markdown });
    }
  }

  return runs;
};

const textRunsOf = (runs) => runs.filter((run) => run.type === 'text');

/**
 * @param {object} params
 * @param {Array} params.enRuns  runs of the English post (drives structure)
 * @param {Array} params.viRuns  runs of the Vietnamese post (text only)
 * @param {Map}   params.images  original src -> { url, width, height } | null
 */
export const buildContentBlocks = ({ enRuns, viRuns, images }) => {
  const viTexts = textRunsOf(viRuns).map((run) => run.markdown);
  const warnings = [];
  const blocks = [];

  let textIndex = 0;
  let pendingImages = [];

  const flushImages = () => {
    if (pendingImages.length === 0) {
      return;
    }
    blocks.push({
      images: pendingImages,
      columns: pendingImages.length > 1 ? '2' : '1',
      _template: 'imageGallery',
    });
    pendingImages = [];
  };

  for (const run of enRuns) {
    if (run.type === 'image') {
      const resolved = images.get(run.src);
      if (!resolved) {
        warnings.push(`unrecoverable image dropped: ${run.src}`);
        continue;
      }
      pendingImages.push({
        src: resolved.url,
        width: resolved.width,
        height: resolved.height,
        alt_en: run.alt || '',
        alt_vi: run.alt || '',
      });
      continue;
    }

    flushImages();

    const contentVi = viTexts[textIndex];
    if (contentVi === undefined) {
      warnings.push(
        `no Vietnamese text run for English run #${textIndex + 1}; left empty`,
      );
    }

    blocks.push({
      content_en: run.markdown,
      content_vi: contentVi ?? '',
      _template: 'richTextBlock',
    });
    textIndex += 1;
  }

  flushImages();

  // Vietnamese article longer than the English one: keep the remainder rather
  // than silently discarding translated copy.
  if (textIndex < viTexts.length) {
    const leftover = viTexts.slice(textIndex);
    warnings.push(
      `${leftover.length} extra Vietnamese text run(s) appended as a trailing block`,
    );
    blocks.push({
      content_en: '',
      content_vi: leftover.join('\n\n'),
      _template: 'richTextBlock',
    });
  }

  return { blocks, warnings };
};

const comparable = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Several posts opened by restating their own headline, so the excerpt would
 * read "How to throw the perfect bachelorette party Not all bachelorette
 * parties...". The old site stripped this too.
 */
const stripLeadingTitle = (text, title) => {
  if (!title) {
    return text;
  }
  const words = comparable(title).split(' ').length;
  const head = text.split(/\s+/).slice(0, words).join(' ');
  if (comparable(head) !== comparable(title)) {
    return text;
  }
  return text.slice(head.length).replace(/^[\s\p{P}]+/u, '');
};

/** First substantial paragraph, used as the excerpt. */
export const firstParagraph = (runs, { title = '', maxLength = 480 } = {}) => {
  for (const run of textRunsOf(runs)) {
    const plain = stripLeadingTitle(markdownToPlain(run.markdown), title);
    if (plain.length < 60) {
      continue;
    }
    if (plain.length <= maxLength) {
      return plain;
    }
    const cut = plain.slice(0, maxLength);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
  }
  return '';
};
