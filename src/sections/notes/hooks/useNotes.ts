import { useState, useEffect, useCallback } from 'react';

import type { NotesFolderResponseDTO } from '@api/notes';
import {
  getFolders,
  moveFolderToTrash,
  moveNoteToTrash,
  updateFolder,
  updateNote,
  createFolder,
  createNote,
  emptyTrash,
} from '@api/notes';

export const useNotes = () => {
  const [rootFolder, setRootFolder] = useState<NotesFolderResponseDTO | null>(null);
  const [trashFolder, setTrashFolder] = useState<NotesFolderResponseDTO | null>(null);

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

  const handleMoveFolderToTrash = useCallback(async (folderId: number) => {
    try {
      await moveFolderToTrash(folderId);
      await fetchFolders();
    } catch (error) {
      console.error('Error moving folder to trash:', error);
    }
  }, [fetchFolders]);

  const handleRenameFolder = useCallback(async (folderId: number, name: string) => {
    try {
      await updateFolder(folderId, { name });
      await fetchFolders();
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  }, [fetchFolders]);

  const handleCreateFolder = useCallback(async (name: string, parentId: number | null = null) => {
    try {
      await createFolder({ name, parent_id: parentId });
      await fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  }, [fetchFolders]);

  const handleCreateNote = useCallback(async (folderId: number | null = null) => {
    try {
      await createNote({ body: '', folder_id: folderId });
      await fetchFolders();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, [fetchFolders]);

  const handleMoveNoteToTrash = useCallback(async (noteId: number) => {
    try {
      await moveNoteToTrash(noteId);
      await fetchFolders();
    } catch (error) {
      console.error('Error moving note to trash:', error);
    }
  }, [fetchFolders]);

  const handleEmptyTrash = useCallback(async () => {
    try {
      await emptyTrash();
      await fetchFolders();
    } catch (error) {
      console.error('Error emptying trash:', error);
    }
  }, [fetchFolders]);

  const handleMoveFolder = useCallback(async (folderId: number, parentId: number | null) => {
    try {
      await updateFolder(folderId, { parent_id: parentId });
      await fetchFolders();
    } catch (error) {
      console.error('Error moving folder:', error);
    }
  }, [fetchFolders]);

  const handleMoveNote = useCallback(async (noteId: number, folderId: number | null) => {
    try {
      await updateNote(noteId, { folder_id: folderId });
      await fetchFolders();
    } catch (error) {
      console.error('Error moving note:', error);
    }
  }, [fetchFolders]);

  return {
    rootFolder,
    trashFolder,
    fetchFolders,
    handleRenameFolder,
    handleCreateFolder,
    handleMoveFolderToTrash,
    handleCreateNote,
    handleMoveNoteToTrash,
    handleEmptyTrash,
    handleMoveFolder,
    handleMoveNote,
  };
};
