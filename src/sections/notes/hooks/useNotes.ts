import { useState, useEffect, useCallback } from 'react';

import type { NotesFolderTreeDTO } from '@api/notes';
import {
  getFoldersTree,
  moveFolderToTrash,
  updateFolder,
  createFolder,
} from '@api/notes';

export const useNotes = () => {
  const [foldersTree, setFoldersTree] = useState<NotesFolderTreeDTO[]>([]);

  const fetchFoldersTree = useCallback(async () => {
    try {
      const response = await getFoldersTree();
      setFoldersTree(response.data as NotesFolderTreeDTO[]);
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

  return {
    foldersTree,
    fetchFoldersTree,
    handleRenameFolder,
    handleCreateFolder,
    handleMoveFolderToTrash,
  };
};
