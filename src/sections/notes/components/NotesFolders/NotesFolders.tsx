import React from 'react';

import { NotesFolderItem } from '@notes/components/NotesFolders/NotesFolderItem/NotesFolderItem.tsx';
import { useNotes } from '@notes/hooks/useNotes.ts';

export const NotesFolders: React.FC = () => {
  const { foldersTree, isLoading, renameFolder, deleteFolder } = useNotes();

  return (
    <div className="space-y-4 px-4 py-5">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {foldersTree.map((folder) => (
            <NotesFolderItem
              key={folder.id}
              folder={folder}
              onRename={renameFolder}
              onDelete={deleteFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};
