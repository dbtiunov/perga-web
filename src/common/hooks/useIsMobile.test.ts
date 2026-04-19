import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useIsMobile } from './useIsMobile';

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1024);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return false when width is greater than breakpoint', () => {
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);
  });

  it('should return true when width is less than breakpoint', () => {
    vi.stubGlobal('innerWidth', 500);
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(true);
  });

  it('should update value when window is resized', () => {
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);

    act(() => {
      vi.stubGlobal('innerWidth', 500);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);

    act(() => {
      vi.stubGlobal('innerWidth', 1024);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(false);
  });
});
