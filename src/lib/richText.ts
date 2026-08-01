/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Flattens a TinaCMS rich-text AST into plain text, for use in meta tags
 * where markup can't be rendered.
 */
export function richTextToPlainText(value: unknown): string {
  const walk = (node: any): string => {
    if (!node || typeof node !== 'object') return '';
    if (typeof node.text === 'string') return node.text;
    if (Array.isArray(node.children)) return node.children.map(walk).join('');
    return '';
  };

  const root = value as any;
  if (!root) return '';

  const blocks = Array.isArray(root.children) ? root.children : [root];
  return blocks.map(walk).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/** Trims text to maxLength on a word boundary, appending an ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}
