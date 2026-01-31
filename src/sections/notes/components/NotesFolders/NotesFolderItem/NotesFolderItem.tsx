import { useState, useRef, useEffect } from 'react';

import type { NotesFolderTreeDTO } from '@api/notes/notes.dto.ts';
import { Icon } from '@common/Icon.tsx';

interface NotesFolderItemProps {
  folder: NotesFolderTreeDTO;
  onRename: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const NotesFolderItem = ({ folder, onRename, onDelete }: NotesFolderItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRename = () => {
    const newName = prompt('Enter new folder name:', folder.name);
    if (newName && newName !== folder.name) {
      void onRename(folder.id, newName);
    }
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete folder "${folder.name}"?`)) {
      void onDelete(folder.id);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="ml-4">
      <div className="mb-3 cursor-pointer flex items-center justify-between hover:bg-bg-hover rounded text-text-main group">
        <span className="p-2">{folder.name}</span>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon name="dots" size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
              >
                <Icon name="edit" size={14} className="mr-2" /> Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center"
              >
                <Icon name="delete" size={14} className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {folder.subfolders && folder.subfolders.length > 0 && (
        <div className="border-l border-gray-200 ml-2">
          {folder.subfolders.map((subfolder) => (
            <NotesFolderItem
              key={subfolder.id}
              folder={subfolder}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
