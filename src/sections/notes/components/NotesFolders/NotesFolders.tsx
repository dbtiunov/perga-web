import React, { useState, useRef, useEffect } from 'react';

import { Icon } from '@common/Icon.tsx';
import { NotesFolderItem } from '@notes/components/NotesFolders/NotesFolderItem/NotesFolderItem.tsx';
import { useNotes } from '@notes/hooks/useNotes.ts';

export const NotesFolders: React.FC = () => {
  const { foldersTree, handleRenameFolder, handleMoveFolderToTrash, handleCreateFolder } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateSubmit = async () => {
    if (newFolderName.trim()) {
      await handleCreateFolder(newFolderName.trim());
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

  return (
    <div className="space-y-4 px-4 py-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider">Folders</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-bg-hover rounded transition-colors text-text-main"
          title="Create folder"
        >
          <Icon name="plus" size={18} />
        </button>
      </div>

      <div>
        {isCreating && (
          <div className="ml-4 mb-3 flex items-center bg-bg-hover rounded text-text-main">
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
        {foldersTree.map((folder) => (
          <NotesFolderItem
            key={folder.id}
            folder={folder}
            onRename={handleRenameFolder}
            onCreateSubfolder={handleCreateFolder}
            onMoveToTrash={handleMoveFolderToTrash}
          />
        ))}
      </div>
    </div>
  );
};
