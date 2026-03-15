/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useNotesDebounceUpdate } from './useNotesDebounceUpdate';

describe('useNotesDebounceUpdate', () => {
  const mockOnUpdate = vi.fn().mockResolvedValue(undefined);
  const initialNote = { id: 1, title: 'Initial Title', body: 'Initial Body' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should not send body when only title is updated', async () => {
    const { result } = renderHook(() =>
      useNotesDebounceUpdate({ selectedNote: initialNote as any, onUpdate: mockOnUpdate }),
    );

    act(() => {
      result.current.debounceUpdate('New Title', undefined);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'New Title', undefined);
  });

  it('should not send title when only body is updated', async () => {
    const { result } = renderHook(() =>
      useNotesDebounceUpdate({ selectedNote: initialNote as any, onUpdate: mockOnUpdate }),
    );

    act(() => {
      result.current.debounceUpdate(undefined, 'New Body');
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(1, undefined, 'New Body');
  });

  it('should send both when both are updated within debounce period', async () => {
    const { result } = renderHook(() =>
      useNotesDebounceUpdate({ selectedNote: initialNote as any, onUpdate: mockOnUpdate }),
    );

    act(() => {
      result.current.debounceUpdate('New Title', undefined);
    });

    act(() => {
      vi.advanceTimersByTime(500);
      result.current.debounceUpdate(undefined, 'New Body');
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'New Title', 'New Body');
  });

  it('should reset pending changes when switching notes', async () => {
    const { result, rerender } = renderHook(
      ({ selectedNote }) =>
        useNotesDebounceUpdate({ selectedNote: selectedNote as any, onUpdate: mockOnUpdate }),
      {
        initialProps: { selectedNote: initialNote },
      },
    );

    act(() => {
      result.current.debounceUpdate('New Title', undefined);
    });

    // Switch note
    const secondNote = { id: 2, title: 'Second Title', body: 'Second Body' };
    rerender({ selectedNote: secondNote });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should NOT have called update for the first note because it was cleared on switch
    // AND should NOT have called update for the second note because it was just switched
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('should send pending changes on unmount', async () => {
    const { result, unmount } = renderHook(() =>
      useNotesDebounceUpdate({ selectedNote: initialNote as any, onUpdate: mockOnUpdate }),
    );

    act(() => {
      result.current.debounceUpdate('New Title', undefined);
    });

    unmount();

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'New Title', undefined);
  });
});
