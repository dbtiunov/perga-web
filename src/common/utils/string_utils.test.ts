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

  it('should handle multiple paragraphs inside list item (only first one matched by simple regex)', () => {
    // Note: The current regex is simple and might only work for single-line/simple content.
    // If it has multiple <p> it might not match as intended or match too much if not careful.
    // However, for standard Tiptap "tight" lists, it's usually <li><p>content</p></li>.
    const html = '<li><p>Line 1</p><p>Line 2</p></li>';
    // Our regex: /<li><p>(.*?)<\/p><\/li>/g
    // It won't match <li><p>Line 1</p><p>Line 2</p></li> because of the extra </p> in the middle if it's not greedy,
    // or it might match too much if it is. (.*?) is non-greedy.
    // <li><p>Line 1</p> matches but then it expects </li> but finds <p>Line 2</p></li>.
    expect(cleanEditorHTML(html)).toBe('<li><p>Line 1</p><p>Line 2</p></li>');
  });
});
