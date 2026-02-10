import React, { useState, useRef, useEffect } from 'react';

import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';
import { NotesFolderItem } from '@notes/components/NotesFolders/NotesFolderItem/NotesFolderItem';
import { TrashFolder } from '@notes/components/NotesFolders/TrashFolder/TrashFolder';
import { useNotes } from '@notes/hooks/useNotes';

export const NotesFolders: React.FC = () => {
  const {
    regularFolders,
    trashFolder,
    handleRenameFolder,
    handleMoveFolderToTrash,
    handleCreateFolder,
    handleCreateNote,
    handleEmptyTrash,
  } = useNotes();
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
        <Dropdown
          buttonIcon={<Icon name="plus" size={18} />}
          buttonTitle="Create"
          buttonClassName="p-1 hover:bg-bg-hover rounded transition-colors text-text-main"
          dropdownClassName="w-40"
        >
          <DropdownItem onClick={() => setIsCreating(true)}>
            <Icon name="folderPlus" size={14} className="h-4 w-4 mr-2" fill="currentColor" /> Create folder
          </DropdownItem>
          <DropdownItem onClick={() => handleCreateNote()}>
            <Icon name="notePlus" size={14} className="h-4 w-4 mr-2" fill="currentColor" /> Create note
          </DropdownItem>
        </Dropdown>
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
        {regularFolders.map((folder) => (
          <NotesFolderItem
            key={folder.id}
            folder={folder}
            onRename={handleRenameFolder}
            onCreateSubfolder={handleCreateFolder}
            onCreateNote={handleCreateNote}
            onMoveToTrash={handleMoveFolderToTrash}
          />
        ))}
      </div>

      {trashFolder && (
        <TrashFolder
          folder={trashFolder}
          onEmptyTrash={handleEmptyTrash}
        />
      )}
    </div>
  );
};
