/**
 * Returns the singular or plural form of a word based on the provided count.
 *
 * @param count - The number of items.
 * @param singular - The singular form of the word.
 * @param plural - The plural form of the word (optional, defaults to singular + 's').
 * @returns The appropriate form of the word.
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
};

/**
 * Removes internal Tiptap attributes like class="tight" and data-tight="true" from HTML.
 *
 * @param html - The HTML string to clean.
 * @returns The cleaned HTML string.
 */
export const cleanEditorHTML = (html: string): string => {
  return html
    .replace(/ class="tight"/g, '')
    .replace(/ data-tight="true"/g, '')
    .replace(/<li><p>(.*?)<\/p><\/li>/g, (match, content) => {
      // If content contains another <p>, it's not a simple tight list item
      if (content.includes('<p>')) {
        return match;
      }
      return `<li>${content}</li>`;
    });
};
