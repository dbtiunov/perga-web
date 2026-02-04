import { useState, useRef, useEffect } from 'react';

import type { NotesFolderTreeDTO } from '@api/notes/notes.dto.ts';
import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/Icon.tsx';

interface NotesFolderItemProps {
  folder: NotesFolderTreeDTO;
  onRename: (id: number, name: string) => Promise<void>;
  onMoveToTrash: (id: number) => Promise<void>;
}

export const NotesFolderItem = ({ folder, onRename, onMoveToTrash }: NotesFolderItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [renamevalue, setRenamevalue] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRenamevalue(folder.name);
  }, [folder.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRenameSubmit = async () => {
    if (renamevalue && renamevalue !== folder.name) {
      await onRename(folder.id, renamevalue);
    } else {
      setRenamevalue(folder.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setRenamevalue(folder.name);
    }
  };

  const handleTrash = () => {
    void onMoveToTrash(folder.id);
  };

  return (
    <div className="ml-4">
      <div className="mb-3 cursor-pointer flex items-center justify-between hover:bg-bg-hover rounded text-text-main group">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={renamevalue}
            onChange={(e) => setRenamevalue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRenameSubmit}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-2"
          />
        ) : (
          <span className="p-2 flex-1" onClick={() => setIsEditing(true)}>
            {folder.name}
          </span>
        )}

        <Dropdown
          buttonIcon={<Icon name="dots" size={20} className="h-6 w-6" />}
          buttonTitle="Folder actions"
          buttonClassName="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          dropdownClassName="w-40"
        >
          <DropdownItem onClick={() => setIsEditing(true)}>
            <Icon name="edit" size={14} className="h-4 w-4 mr-2" /> Rename
          </DropdownItem>
          <DropdownItem onClick={handleTrash}>
            <Icon name="delete" size={14} className="h-4 w-4 mr-2" /> Move to trash
          </DropdownItem>
        </Dropdown>
      </div>

      {folder.subfolders && folder.subfolders.length > 0 && (
        <div className="border-l border-gray-200 ml-2">
          {folder.subfolders.map((subfolder) => (
            <NotesFolderItem
              key={subfolder.id}
              folder={subfolder}
              onRename={onRename}
              onMoveToTrash={onMoveToTrash}
            />
          ))}
        </div>
      )}
    </div>
  );
};
