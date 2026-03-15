import { useState, useEffect, useCallback, useRef } from 'react';
import { StorageKeys } from '@common/utils/storage_keys';

import type { NotesFolderResponseDTO, NoteDTO, NotesExportTypeDTO, NotesExportTargetDTO } from '@api/notes';
import {
  getFolders,
  createFolder,
  updateFolder,
  getNote,
  createNote,
  updateNote,
  emptyTrash,
  exportNotes,
} from '@api/notes';
import { REFRESH_EVENT } from '@common/events';
import { downloadFile } from '@common/utils/download_utils';
import { NOTES_DEFAULT_EXTENSION, NOTES_EXTENSION_MAP } from '@notes/const.ts';

export const useNotesState = () => {
  const [rootFolder, setRootFolder] = useState<NotesFolderResponseDTO | null>(null);
  const [trashFolder, setTrashFolder] = useState<NotesFolderResponseDTO | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(() => {
    const saved = localStorage.getItem(StorageKeys.NotesSelectedNoteId);
    return saved ? parseInt(saved, 10) : null;
  });
  const [selectedNote, setSelectedNote] = useState<NoteDTO | null>(null);

  // use ref to avoid infinite loop when updating selectedNote in handleUpdateNote
  const selectedNoteRef = useRef(selectedNote);
  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await getFolders();
      setRootFolder(response.data.root_folder);
      setTrashFolder(response.data.trash_folder);
    } catch (error) {
      console.error('Error fetching notes folders:', error);
    }
  }, []);

  const fetchNoteContent = useCallback(async (noteId: number) => {
    try {
      const response = await getNote(noteId);
      setSelectedNote(response.data);
    } catch (error) {
      console.error('Error fetching note content:', error);
    }
  }, []);

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

  const handleUpdateNote = useCallback(
    async (noteId: number, title: string | undefined, body: string | undefined) => {
      try {
        const response = await updateNote(noteId, { title, body });
        if (selectedNoteRef.current?.id === noteId) {
          setSelectedNote(response.data);
        }
        await fetchFolders();
      } catch (error) {
        console.error('Error updating note:', error);
      }
    },
    [fetchFolders],
  );

  const handleExportNotes = useCallback(
    async (exportType: NotesExportTypeDTO, exportTarget: NotesExportTargetDTO, exportTargetId?: number | null) => {
      try {
        const response = await exportNotes({
          export_type: exportType,
          export_target: exportTarget,
          export_target_id: exportTargetId,
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = '';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename=(.+)/);
          if (filenameMatch?.[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        if (!filename) {
          // generate filename as a fallback
          const extension = NOTES_EXTENSION_MAP[exportType] || NOTES_DEFAULT_EXTENSION;
          filename = `notes_export_${new Date().getTime()}.${extension}`;
        }

        downloadFile(response.data, filename);
      } catch (error) {
        console.error('Error exporting notes:', error);
      }
    },
    [],
  );

  // initial fetch for folders
  useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  // fetch selected note
  useEffect(() => {
    if (selectedNoteId) {
      void fetchNoteContent(selectedNoteId);
    } else {
      setSelectedNote(null);
    }
  }, [selectedNoteId, fetchNoteContent]);

  // save selectedNoteId to localStorage
  useEffect(() => {
    if (selectedNoteId) {
      localStorage.setItem(StorageKeys.NotesSelectedNoteId, selectedNoteId.toString());
    } else {
      localStorage.removeItem(StorageKeys.NotesSelectedNoteId);
    }
  }, [selectedNoteId]);

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
    handleExportNotes,
    setSelectedNoteId,
    selectedNote,
    selectedNoteId,
  };
};
