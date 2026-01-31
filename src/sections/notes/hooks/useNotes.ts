import { useState, useEffect, useCallback } from 'react';
import {
  getFoldersTree,
  deleteFolder as apiDeleteFolder,
  updateFolder as apiUpdateFolder,
} from '@api/notes/notes.service';
import type { NotesFolderTreeDTO } from '@api/notes/notes.dto';

export const useNotes = () => {
  const [foldersTree, setFoldersTree] = useState<NotesFolderTreeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFoldersTree = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getFoldersTree();
      setFoldersTree(response.data as NotesFolderTreeDTO[]);
    } catch (error) {
      console.error('Error fetching notes folders tree:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFoldersTree();
  }, [fetchFoldersTree]);

  const deleteFolder = useCallback(async (folderId: number) => {
    try {
      await apiDeleteFolder(folderId);
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  }, [fetchFoldersTree]);

  const renameFolder = useCallback(async (folderId: number, name: string) => {
    try {
      await apiUpdateFolder(folderId, { name });
      await fetchFoldersTree();
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  }, [fetchFoldersTree]);

  return {
    foldersTree,
    isLoading,
    refreshFolders: fetchFoldersTree,
    deleteFolder,
    renameFolder,
  };
};
