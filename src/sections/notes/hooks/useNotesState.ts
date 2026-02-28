import { useState, useEffect, useCallback } from 'react';
import { StorageKeys } from '@common/utils/storage_keys';

import type { NotesFolderResponseDTO, NoteDTO, NoteMetaDTO } from '@api/notes';
import {
  getFolders,
  createFolder,
  updateFolder,
  getNote,
  createNote,
  updateNote,
  emptyTrash,
} from '@api/notes';
import { REFRESH_EVENT } from '@common/events';

export const useNotesState = () => {
  const [rootFolder, setRootFolder] = useState<NotesFolderResponseDTO | null>(null);
  const [trashFolder, setTrashFolder] = useState<NotesFolderResponseDTO | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(() => {
    const saved = localStorage.getItem(StorageKeys.NotesSelectedNoteId);
    return saved ? parseInt(saved, 10) : null;
  });
  const [fetchedNote, setFetchedNote] = useState<NoteDTO | null>(null);

  useEffect(() => {
    if (selectedNoteId) {
      localStorage.setItem(StorageKeys.NotesSelectedNoteId, selectedNoteId.toString());
    } else {
      localStorage.removeItem(StorageKeys.NotesSelectedNoteId);
    }
  }, [selectedNoteId]);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await getFolders();
      setRootFolder(response.data.root_folder);
      setTrashFolder(response.data.trash_folder);
    } catch (error) {
      console.error('Error fetching notes folders:', error);
    }
  }, []);

  useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  const fetchNoteContent = useCallback(async (noteId: number) => {
    try {
      const response = await getNote(noteId);
      setFetchedNote(response.data);
    } catch (error) {
      console.error('Error fetching note content:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedNoteId) {
      void fetchNoteContent(selectedNoteId);
    } else {
      setFetchedNote(null);
    }
  }, [selectedNoteId, fetchNoteContent]);

  const handleMoveFolderToTrash = useCallback(
    async (folderId: number) => {
      if (!trashFolder) {
        return;
      }

      try {
        await updateFolder(folderId, { parent_id: trashFolder.id });
        await fetchFolders();
      } catch (error) {
        console.error('Error moving folder to trash:', error);
      }
    },
    [fetchFolders, trashFolder],
  );

  const handleRenameFolder = useCallback(
    async (folderId: number, name: string) => {
      try {
        await updateFolder(folderId, { name });
        await fetchFolders();
      } catch (error) {
        console.error('Error renaming folder:', error);
      }
    },
    [fetchFolders],
  );

  const handleCreateFolder = useCallback(
    async (name: string, parentId: number) => {
      try {
        await createFolder({ name, parent_id: parentId });
        await fetchFolders();
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    },
    [fetchFolders],
  );

  const handleCreateNote = useCallback(
    async (folderId: number) => {
      try {
        await createNote({ body: '', folder_id: folderId });
        await fetchFolders();
      } catch (error) {
        console.error('Error creating note:', error);
      }
    },
    [fetchFolders],
  );

  const handleMoveNoteToTrash = useCallback(
    async (noteId: number) => {
      if (!trashFolder) {
        return;
      }

      try {
        await updateNote(noteId, { folder_id: trashFolder.id });
        await fetchFolders();
      } catch (error) {
        console.error('Error moving note to trash:', error);
      }
    },
    [fetchFolders, trashFolder],
  );

  const handleEmptyTrash = useCallback(async () => {
    try {
      await emptyTrash();
      await fetchFolders();
    } catch (error) {
      console.error('Error emptying trash:', error);
    }
  }, [fetchFolders]);

  const handleMoveFolder = useCallback(
    async (folderId: number, parentId: number) => {
      try {
        await updateFolder(folderId, { parent_id: parentId });
        await fetchFolders();
      } catch (error) {
        console.error('Error moving folder:', error);
      }
    },
    [fetchFolders],
  );

  const handleMoveNote = useCallback(
    async (noteId: number, folderId: number) => {
      try {
        await updateNote(noteId, { folder_id: folderId });
        await fetchFolders();
      } catch (error) {
        console.error('Error moving note:', error);
      }
    },
    [fetchFolders],
  );

  const handleRenameNote = useCallback(
    async (noteId: number, title: string) => {
      try {
        await updateNote(noteId, { title });
        await fetchFolders();
      } catch (error) {
        console.error('Error renaming note:', error);
      }
    },
    [fetchFolders],
  );

  const findNoteById = useCallback(
    (folder: NotesFolderResponseDTO, id: number): NoteMetaDTO | null => {
      const note = folder.notes.find((n) => n.id === id);
      if (note){
        return note;
      }

      for (const subfolder of folder.subfolders) {
        const found = findNoteById(subfolder, id);
        if (found){
          return found;
        }
      }

      return null;
    },
    [],
  );

  const selectedNote =
    selectedNoteId === fetchedNote?.id
      ? fetchedNote
      : null;

  const handleUpdateNote = useCallback(
    async (noteId: number, title: string | undefined, body: string | undefined) => {
      try {
        const response = await updateNote(noteId, { title, body });
        if (fetchedNote?.id === noteId) {
          setFetchedNote(response.data);
        }
        await fetchFolders();
      } catch (error) {
        console.error('Error updating note:', error);
      }
    },
    [fetchFolders, fetchedNote],
  );

  // Refresh listener
  useEffect(() => {
    const handler = () => {
      void fetchFolders();
    };
    window.addEventListener(REFRESH_EVENT, handler);
    return () => {
      window.removeEventListener(REFRESH_EVENT, handler);
    };
  }, [fetchFolders]);

  return {
    rootFolder,
    trashFolder,
    handleCreateFolder,
    handleRenameFolder,
    handleMoveFolder,
    handleMoveFolderToTrash,
    handleCreateNote,
    handleRenameNote,
    handleUpdateNote,
    handleMoveNote,
    handleMoveNoteToTrash,
    handleEmptyTrash,
    setSelectedNoteId,
    selectedNote,
    selectedNoteId,
  };
};
