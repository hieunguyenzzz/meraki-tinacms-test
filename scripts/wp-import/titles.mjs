/**
 * WordPress titles were all stored in upper case ("AN EXPERT GUIDE TO GET THE
 * PERFECT WEDDING SUIT"). The v2 posts use normal casing, so shouting titles
 * are converted down.
 */

import { decodeEntities } from './html-to-markdown.mjs';

const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor',
  'of', 'on', 'or', 'the', 'to', 'up', 'vs', 'with',
]);

const isShouting = (title) => {
  const letters = title.replace(/[^A-Za-z]/g, '');
  if (letters.length < 4) {
    return false;
  }
  const upper = letters.replace(/[^A-Z]/g, '').length;
  return upper / letters.length > 0.8;
};

/** Capitalise a word, leaving any leading punctuation in place. */
const capitalise = (word) =>
  word.replace(/^(\W*)(\w)(.*)$/u, (_, lead, first, rest) =>
    `${lead}${first.toLocaleUpperCase()}${rest}`,
  );

const titleCase = (text) => {
  const words = text.toLocaleLowerCase().split(/(\s+)/);
  const lastWordIndex = words.reduce(
    (last, word, index) => (word.trim() ? index : last),
    0,
  );

  return words
    .map((word, index) => {
      if (!word.trim()) {
        return word;
      }
      const bare = word.replace(/\W/gu, '');
      const isEdge = index === 0 || index === lastWordIndex;
      if (!isEdge && MINOR_WORDS.has(bare)) {
        return word;
      }
      // Keep hyphenated compounds capitalised on both sides.
      return word.split('-').map(capitalise).join('-');
    })
    .join('');
};

/** Vietnamese does not use title case, so only the first letter is raised. */
const sentenceCase = (text) => capitalise(text.toLocaleLowerCase());

export const normaliseTitle = (rawTitle, language) => {
  const title = decodeEntities(rawTitle).replace(/\s+/g, ' ').trim();
  if (!isShouting(title)) {
    return title;
  }
  return language === 'vi' ? sentenceCase(title) : titleCase(title);
};
