import React, { useState, useRef, useEffect } from 'react';

import { Icon } from '@common/components/Icon';
import { NotesFolderItem } from '@notes/components/NotesFolders/NotesFolderItem/NotesFolderItem';
import { TrashFolder } from '@notes/components/NotesFolders/TrashFolder/TrashFolder';
import { useNotes } from '@notes/hooks/useNotes';

export const NotesFolders: React.FC = () => {
  const {
    rootFolder,
    trashFolder,
    handleRenameFolder,
    handleMoveFolderToTrash,
    handleCreateFolder,
    handleCreateNote,
    handleMoveNoteToTrash,
    handleEmptyTrash,
    handleMoveFolder,
    handleMoveNote,
  } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragHover, setIsDragHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateSubmit = async () => {
    if (newFolderName.trim()) {
      await handleCreateFolder(newFolderName.trim(), rootFolder?.id);
    }
    setNewFolderName('');
    setIsCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleCreateSubmit();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFolderName('');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHover(true);
  };

  const onDragLeave = () => {
    setIsDragHover(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHover(false);
    const dragType = e.dataTransfer.getData('dragType');
    const dragId = parseInt(e.dataTransfer.getData('dragId'), 10);

    if (dragType === 'folder') {
      void handleMoveFolder(dragId, rootFolder ? rootFolder.id : null);
    } else if (dragType === 'note') {
      void handleMoveNote(dragId, rootFolder ? rootFolder.id : null);
    }
  };

  return (
    <div
      className={`space-y-4 px-4 py-5 h-full ${isDragHover ? 'bg-bg-hover ring-2 ring-blue-500 rounded' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => handleCreateNote(rootFolder?.id)}
          className="flex-1 flex items-center justify-center p-2 text-sm text-text-main hover:bg-bg-hover rounded border border-border-main transition-colors"
          title="Add Note"
          aria-label="Add Note"
        >
          <Icon name="plus" size={14} className="mr-2" fill="currentColor" />
          <span>Note</span>
        </button>
        <button
          onClick={() => setIsCreating(true)}
          className="flex-1 flex items-center justify-center p-2 text-sm text-text-main hover:bg-bg-hover rounded border border-border-main transition-colors"
          title="Add Folder"
          aria-label="Add Folder"
        >
          <Icon name="plus" size={14} className="mr-2" fill="currentColor" />
          <span>Folder</span>
        </button>
      </div>

      <div>
        {isCreating && (
          <div className="mb-3 flex items-center bg-bg-hover rounded text-text-main">
            <input
              ref={inputRef}
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleCreateSubmit}
              placeholder="Folder name"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-2"
            />
          </div>
        )}
        {!isCreating &&
          rootFolder &&
          rootFolder.subfolders.length === 0 &&
          rootFolder.notes.length === 0 && (
            <div className="">
              <p className="text-sm text-text-main/60">No notes here yet</p>
            </div>
          )}
        {rootFolder?.subfolders.map((folder) => (
          <NotesFolderItem
            key={folder.id}
            folder={folder}
            regularFolders={rootFolder.subfolders}
            onRename={handleRenameFolder}
            onCreateSubfolder={handleCreateFolder}
            onCreateNote={handleCreateNote}
            onMoveToTrash={handleMoveFolderToTrash}
            onMoveFolder={handleMoveFolder}
            onMoveNote={handleMoveNote}
          />
        ))}
        {rootFolder?.notes.map((note) => (
          <div
            key={note.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('dragType', 'note');
              e.dataTransfer.setData('dragId', note.id.toString());
            }}
            className="ml-6 mb-3 flex items-center p-2 hover:bg-bg-hover rounded text-text-main cursor-pointer"
          >
            <Icon name="note" size="16" fill="currentColor" className="mr-2 opacity-70" />
            <span className="truncate">{note.title || 'Untitled Note'}</span>
          </div>
        ))}
      </div>

      {trashFolder && (
        <TrashFolder
          folder={trashFolder}
          onEmptyTrash={handleEmptyTrash}
          onMoveFolderToTrash={handleMoveFolderToTrash}
          onMoveNoteToTrash={handleMoveNoteToTrash}
          onMoveFolder={handleMoveFolder}
          onMoveNote={handleMoveNote}
        />
      )}
    </div>
  );
};
