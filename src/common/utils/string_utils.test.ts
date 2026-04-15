import { describe, it, expect } from 'vitest';
import { pluralize, cleanEditorHTML } from './string_utils';

describe('pluralize', () => {
  it('should return singular form when count is 1', () => {
    expect(pluralize(1, 'note')).toBe('note');
  });

  it('should return plural form when count is 0', () => {
    expect(pluralize(0, 'note')).toBe('notes');
  });

  it('should return plural form when count is greater than 1', () => {
    expect(pluralize(5, 'note')).toBe('notes');
  });

  it('should return custom plural form when provided', () => {
    expect(pluralize(2, 'category', 'categories')).toBe('categories');
  });
});

describe('cleanEditorHTML', () => {
  it('should remove class="tight"', () => {
    const html = '<ul class="tight"><li>Item</li></ul>';
    expect(cleanEditorHTML(html)).toBe('<ul><li>Item</li></ul>');
  });

  it('should remove data-tight="true"', () => {
    const html = '<ul data-tight="true"><li>Item</li></ul>';
    expect(cleanEditorHTML(html)).toBe('<ul><li>Item</li></ul>');
  });

  it('should remove both attributes', () => {
    const html = '<ul class="tight" data-tight="true"><li>Item</li></ul>';
    expect(cleanEditorHTML(html)).toBe('<ul><li>Item</li></ul>');
  });

  it('should remove multiple occurrences', () => {
    const html =
      '<ul class="tight" data-tight="true"><li>1</li></ul><ol class="tight" data-tight="true"><li>2</li></ol>';
    expect(cleanEditorHTML(html)).toBe('<ul><li>1</li></ul><ol><li>2</li></ol>');
  });

  it('should remove class and data attributes from paragraph', () => {
    const html = '<p class="tight" data-tight="true">Text</p>';
    expect(cleanEditorHTML(html)).toBe('<p>Text</p>');
  });

  it('should remove paragraph inside list item', () => {
    const html = '<ul><li><p>First item</p></li><li><p>Second item</p></li></ul>';
    expect(cleanEditorHTML(html)).toBe('<ul><li>First item</li><li>Second item</li></ul>');
  });

  it('should not match multi-line content if it looks like multiple list items', () => {
    // Current non-greedy regex with /s would match across lines.
    // Without /s it should be fine.
    const html = '<li><p>First</p></li>\n<li><p>Second</p></li>';
    expect(cleanEditorHTML(html)).toBe('<li>First</li>\n<li>Second</li>');
  });

  it('should not break code blocks with newlines', () => {
    const html = '<pre><code>line 1\nline 2</code></pre>';
    expect(cleanEditorHTML(html)).toBe('<pre><code>line 1\nline 2</code></pre>');
  });
});
