import React, { ReactNode } from 'react';

import { useNotesState } from '@notes/hooks/useNotesState';
import { NotesContext } from './NotesContext.types';

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const notes = useNotesState();
  return <NotesContext.Provider value={notes}>{children}</NotesContext.Provider>;
};
