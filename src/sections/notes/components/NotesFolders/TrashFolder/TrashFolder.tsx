import React, { useState } from 'react';

import type { NotesFolderTreeWithNotesDTO } from '@api/notes';
import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';
import { TrashFolderItem } from './TrashFolderItem/TrashFolderItem';

interface TrashFolderProps {
  folder: NotesFolderTreeWithNotesDTO;
  onEmptyTrash: () => Promise<void>;
}

export const TrashFolder: React.FC<TrashFolderProps> = ({ folder, onEmptyTrash }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="mb-3 cursor-pointer flex items-center justify-between hover:bg-bg-hover rounded text-text-main group">
        <div className="flex items-center flex-1 p-2" onClick={() => setIsExpanded(!isExpanded)}>
          <Icon name="trash" size="16" className="mr-2" />
          <span>{folder.name}</span>
        </div>

        <Dropdown
          buttonIcon={<Icon name="dots" size={20} className="h-6 w-6" />}
          buttonTitle="Folder actions"
          buttonClassName="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          dropdownClassName="w-40"
        >
          <DropdownItem onClick={() => onEmptyTrash()}>
            <Icon name="trash" size="14" className="h-4 w-4 mr-2" /> Empty trash
          </DropdownItem>
        </Dropdown>
      </div>

      {isExpanded &&
        ((folder.subfolders && folder.subfolders.length > 0) ||
          (folder.notes && folder.notes.length > 0)) && (
          <>
            {folder.subfolders &&
              folder.subfolders.map((subfolder) => (
                <TrashFolderItem key={subfolder.id} folder={subfolder} />
              ))}
            {folder.notes &&
              folder.notes.map((note) => (
                <div
                  key={note.id}
                  className="ml-4 mb-3 flex items-center p-2 hover:bg-bg-hover rounded text-text-main cursor-pointer"
                >
                  <Icon name="note" size="16" fill="currentColor" className="mr-2 opacity-70" />
                  <span className="truncate">{note.title || 'Untitled Note'}</span>
                </div>
              ))}
          </>
        )}
    </>
  );
};
