/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import type { NoteDTO } from '@api/notes/notes.dto';
import { useNotesDebounceUpdate } from './useNotesDebounceUpdate';

describe('useNotesDebounceUpdate', () => {
  const mockOnUpdate = vi.fn().mockResolvedValue(undefined);
  const initialNote: NoteDTO = {
    id: 1,
    folder_id: 1,
    title: 'Initial Title',
    body: 'Initial Body',
    updated_dt: '2021-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should not send body when only title is updated', async () => {
    const { result } = renderHook(() =>
      useNotesDebounceUpdate({ selectedNote: initialNote, onUpdate: mockOnUpdate }),
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
      useNotesDebounceUpdate({ selectedNote: initialNote, onUpdate: mockOnUpdate }),
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
      useNotesDebounceUpdate({ selectedNote: initialNote, onUpdate: mockOnUpdate }),
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
      ({ selectedNote }) => useNotesDebounceUpdate({ selectedNote, onUpdate: mockOnUpdate }),
      {
        initialProps: { selectedNote: initialNote as NoteDTO | null },
      },
    );

    act(() => {
      result.current.debounceUpdate('New Title', undefined);
    });

    // Switch note
    const secondNote: NoteDTO = {
      id: 2,
      folder_id: 1,
      title: 'Second Title',
      body: 'Second Body',
      updated_dt: '2021-01-01',
    };
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
      useNotesDebounceUpdate({ selectedNote: initialNote, onUpdate: mockOnUpdate }),
    );

    act(() => {
      result.current.debounceUpdate('New Title', undefined);
    });

    unmount();

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'New Title', undefined);
  });
});
