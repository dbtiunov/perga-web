import React from 'react';

import { NotesFolderItem } from '@notes/components/NotesFolders/NotesFolderItem/NotesFolderItem.tsx';
import { useNotes } from '@notes/hooks/useNotes.ts';

export const NotesFolders: React.FC = () => {
  const { foldersTree, handleRenameFolder, handleMoveFolderToTrash } = useNotes();

  return (
    <div className="space-y-4 px-4 py-5">
      <div>
        {foldersTree.map((folder) => (
          <NotesFolderItem
            key={folder.id}
            folder={folder}
            onRename={handleRenameFolder}
            onMoveToTrash={handleMoveFolderToTrash}
          />
        ))}
      </div>
    </div>
  );
};
