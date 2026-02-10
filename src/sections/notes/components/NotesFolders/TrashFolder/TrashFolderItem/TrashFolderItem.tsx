import React, { useState } from 'react';

import type { NotesFolderTreeWithNotesDTO } from '@api/notes';
import { Icon } from '@common/components/Icon';

interface TrashFolderItemProps {
  folder: NotesFolderTreeWithNotesDTO;
}

export const TrashFolderItem: React.FC<TrashFolderItemProps> = ({ folder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ml-4">
      <div
        className="mb-3 cursor-pointer flex items-center p-2 hover:bg-bg-hover rounded text-text-main group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Icon name="folder" size="14" fill="currentColor" className="mr-2 opacity-70" />
        <span className="truncate">{folder.name}</span>
      </div>

      {isExpanded && (
        <>
          {folder.subfolders &&
            folder.subfolders.map((subfolder) => (
              <TrashFolderItem key={subfolder.id} folder={subfolder} />
            ))}
          {folder.notes &&
            folder.notes.map((note) => (
              <div
                key={note.id}
                className="ml-8 mb-3 flex items-center p-2 hover:bg-bg-hover rounded text-text-main cursor-pointer"
              >
                <Icon name="note" size="16" fill="currentColor" className="mr-2 opacity-70" />
                <span className="truncate">{note.title || 'Untitled Note'}</span>
              </div>
            ))}
        </>
      )}
    </div>
  );
};
