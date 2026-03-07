import { createContext } from 'react';

import { useNotesState } from '@notes/hooks/useNotesState.ts';

export type NotesContextType = ReturnType<typeof useNotesState>;

export const NotesContext = createContext<NotesContextType | undefined>(undefined);
