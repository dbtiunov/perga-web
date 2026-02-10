import { useState, useEffect, useCallback } from 'react';

import type { NotesFolderTreeWithNotesDTO } from '@api/notes';
import {
  getFoldersTree,
  moveFolderToTrash,
  updateFolder,
  createFolder,
  createNote,
  emptyTrash,
} from '@api/notes';

export const useNotes = () => {
  const [foldersTree, setFoldersTree] = useState<NotesFolderTreeWithNotesDTO[]>([]);

  const regularFolders = foldersTree.filter((folder) => folder.folder_type === 'regular');
  const trashFolder = foldersTree.find((folder) => folder.folder_type === 'trash');

  const fetchFoldersTree = useCallback(async () => {
    try {
      const response = await getFoldersTree(true);
      setFoldersTree(response.data as NotesFolderTreeWithNotesDTO[]);
    } catch (error) {
      console.error('Error fetching notes folders tree:', error);
    }
  }, []);

  useEffect(() => {
    void fetchFoldersTree();
  }, [fetchFoldersTree]);

  const handleMoveFolderToTrash = useCallback(async (folderId: number) => {
    try {
      await moveFolderToTrash(folderId);
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error moving folder to trash:', error);
    }
  }, [fetchFoldersTree]);

  const handleRenameFolder = useCallback(async (folderId: number, name: string) => {
    try {
      await updateFolder(folderId, { name });
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  }, [fetchFoldersTree]);

  const handleCreateFolder = useCallback(async (name: string, parentId: number | null = null) => {
    try {
      await createFolder({ name, parent_id: parentId });
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  }, [fetchFoldersTree]);

  const handleCreateNote = useCallback(async (folderId: number | null = null) => {
    try {
      await createNote({ body: '', folder_id: folderId });
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, []);

  const handleEmptyTrash = useCallback(async () => {
    try {
      await emptyTrash();
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error emptying trash:', error);
    }
  }, [fetchFoldersTree]);

  return {
    foldersTree,
    regularFolders,
    trashFolder,
    fetchFoldersTree,
    handleRenameFolder,
    handleCreateFolder,
    handleMoveFolderToTrash,
    handleCreateNote,
    handleEmptyTrash,
  };
};
