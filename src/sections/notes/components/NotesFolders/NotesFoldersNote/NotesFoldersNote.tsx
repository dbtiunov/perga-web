import React, { useState, useRef, useEffect } from 'react';

import type { NoteDTO } from '@api/notes';
import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';

interface FoldersNoteProps {
  note: NoteDTO;
  onRename: (id: number, title: string) => Promise<void>;
  onMoveToTrash: (id: number) => Promise<void>;
  className?: string;
}

export const NotesFoldersNote = ({
  note,
  onRename,
  onMoveToTrash,
  className = '',
}: FoldersNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [renameValue, setRenameValue] = useState(note.title || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRenameValue(note.title || '');
  }, [note.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRenameSubmit = async () => {
    if (renameValue !== note.title) {
      await onRename(note.id, renameValue);
    }
    setIsEditing(false);
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setRenameValue(note.title || '');
    }
  };

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('dragType', 'note');
    e.dataTransfer.setData('dragId', note.id.toString());
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`mb-1 flex items-center justify-between hover:bg-bg-hover rounded text-text-main cursor-pointer group ${className}`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleRenameSubmit}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-2"
        />
      ) : (
        <div className="flex items-center flex-1 p-2">
          <Icon name="note" size="16" fill="currentColor" className="mr-2 opacity-70" />
          <span className="truncate">{note.title || 'Untitled Note'}</span>
        </div>
      )}

      <Dropdown
        buttonIcon={<Icon name="dots" size={20} className="h-6 w-6" />}
        buttonTitle="Note actions"
        buttonClassName="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        dropdownClassName="w-40"
      >
        <DropdownItem onClick={handleRenameClick}>
          <Icon name="edit" size={14} className="h-4 w-4 mr-2" /> Rename
        </DropdownItem>
        <DropdownItem onClick={(e) => { e.stopPropagation(); void onMoveToTrash(note.id); }}>
          <Icon name="trash" size={14} className="h-4 w-4 mr-2" /> Move to trash
        </DropdownItem>
      </Dropdown>
    </div>
  );
};
