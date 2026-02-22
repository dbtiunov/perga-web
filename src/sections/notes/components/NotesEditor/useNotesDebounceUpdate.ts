import { useEffect, useRef } from 'react';

import type { NoteDTO } from '@api/notes';

interface UseNotesDebounceUpdateProps {
  note: NoteDTO | null;
  onUpdate: (id: number, title: string | undefined, body: string | undefined) => Promise<void>;
}

export const useNotesDebounceUpdate = ({ note, onUpdate }: UseNotesDebounceUpdateProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValuesRef = useRef({
    noteId: note?.id,
    title: note?.title || '',
    body: note?.body || '',
  });

  const noteId = note?.id;
  const noteTitle = note?.title;
  const noteBody = note?.body;

  // Update tracking ref on the note change
  useEffect(() => {
    if (lastValuesRef.current.noteId !== noteId) {
      // reset ref values if selected note changed
      lastValuesRef.current = {
        noteId: noteId,
        title: noteTitle || '',
        body: noteBody || '',
      };
    } else if (!timerRef.current) {
      // sync with props if there is no pending update
      lastValuesRef.current.title = noteTitle || '';
      lastValuesRef.current.body = noteBody || '';
    }
  }, [noteId, noteTitle, noteBody]);

  // Use debounce timer to reduce number of update api requests
  // send request only when user stopped typing for 1000ms
  const debounceUpdate = (newTitle: string | undefined, newBody: string | undefined) => {
    let changed = false;

    if (newTitle !== undefined && newTitle !== lastValuesRef.current.title) {
      lastValuesRef.current.title = newTitle;
      changed = true;
    }
    if (newBody !== undefined && newBody !== lastValuesRef.current.body) {
      lastValuesRef.current.body = newBody;
      changed = true;
    }

    if (note && (changed || timerRef.current)) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const {
          noteId: currentNoteId,
          title: currentTitle,
          body: currentBody,
        } = lastValuesRef.current;

        // Ensure we are still editing the same note
        if (currentNoteId === note.id) {
          void onUpdate(note.id, currentTitle !== undefined ? currentTitle : undefined, currentBody !== undefined ? currentBody : undefined);
        }
        timerRef.current = null;
      }, 1000);
    }
  };

  // If there is a pending update when the selected note changes or component unmounts,
  // execute it immediately to ensure no data is lost.
  useEffect(() => {
    return () => {
      if (timerRef.current && note) {
        clearTimeout(timerRef.current);
        const {
          noteId: currentNoteId,
          title: currentTitle,
          body: currentBody,
        } = lastValuesRef.current;

        // Ensure we are still editing the same note
        if (currentNoteId === note.id) {
          void onUpdate(note.id, currentTitle !== undefined ? currentTitle : undefined, currentBody !== undefined ? currentBody : undefined);
        }
        timerRef.current = null;
      }
    };
  }, [noteId, note, onUpdate]);

  return {
    debounceUpdate,
    hasPendingUpdate: !!timerRef.current,
    clearDebounceTimer: () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
  };
};
