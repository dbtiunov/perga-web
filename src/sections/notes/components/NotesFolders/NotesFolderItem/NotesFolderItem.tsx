import React, { useState, useRef, useEffect } from 'react';

import type { NotesFolderResponseDTO } from '@api/notes';
import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';

interface NotesFolderItemProps {
  folder: NotesFolderResponseDTO;
  regularFolders: NotesFolderResponseDTO[];
  onRename: (id: number, name: string) => Promise<void>;
  onCreateSubfolder: (name: string, parentId: number) => Promise<void>;
  onCreateNote: (folderId: number) => Promise<void>;
  onMoveToTrash: (id: number) => Promise<void>;
  onMoveFolder: (folderId: number, parentId: number | null) => Promise<void>;
  onMoveNote: (noteId: number, folderId: number | null) => Promise<void>;
  wrapperClass?: string;
}

export const NotesFolderItem = ({
  folder,
  regularFolders,
  onRename,
  onCreateSubfolder,
  onCreateNote,
  onMoveToTrash,
  onMoveFolder,
  onMoveNote,
  wrapperClass = '',
}: NotesFolderItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreatingSubfolder, setIsCreatingSubfolder] = useState(false);
  const [isDragHover, setIsDragHover] = useState(false);
  const [renamevalue, setRenamevalue] = useState(folder.name);
  const [newSubfolderName, setNewSubfolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const subfolderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRenamevalue(folder.name);
  }, [folder.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isCreatingSubfolder && subfolderInputRef.current) {
      subfolderInputRef.current.focus();
    }
  }, [isCreatingSubfolder]);

  const handleRenameSubmit = async () => {
    if (renamevalue && renamevalue !== folder.name) {
      await onRename(folder.id, renamevalue);
    } else {
      setRenamevalue(folder.name);
    }
    setIsEditing(false);
  };

  const handleSubfolderSubmit = async () => {
    if (newSubfolderName.trim()) {
      await onCreateSubfolder(newSubfolderName.trim(), folder.id);
      setIsExpanded(true);
    }
    setNewSubfolderName('');
    setIsCreatingSubfolder(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setRenamevalue(folder.name);
    }
  };

  const handleSubfolderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleSubfolderSubmit();
    } else if (e.key === 'Escape') {
      setIsCreatingSubfolder(false);
      setNewSubfolderName('');
    }
  };

  const handleTrash = () => {
    void onMoveToTrash(folder.id);
  };

  const onDragStartFolder = (e: React.DragEvent) => {
    e.dataTransfer.setData('dragType', 'folder');
    e.dataTransfer.setData('dragId', folder.id.toString());
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

    if (dragType === 'folder' && dragId !== folder.id) {
      // Check if we are trying to move a folder into its own subfolder
      const isSubfolder = (parent: NotesFolderResponseDTO, childId: number): boolean => {
        if (parent.id === childId){
          return true;
        }
        if (parent.subfolders) {
          // recursively check subfolders tree
          return parent.subfolders.some((subfolder) => isSubfolder(subfolder, childId));
        }
        return false;
      };

      const findFolderInList = (id: number, folders: NotesFolderResponseDTO[]): NotesFolderResponseDTO | null => {
        for (const folder of folders) {
          const found = findFolderById(id, folder);
          if (found) {
            return found;
          }
        }
        return null;
      };

      const movingFolder = findFolderInList(dragId, regularFolders);
      if (movingFolder && isSubfolder(movingFolder, folder.id)) {
        return;
      }

      void onMoveFolder(dragId, folder.id);
    } else if (dragType === 'note') {
      void onMoveNote(dragId, folder.id);
    }
  };

  const findFolderById = (id: number, currentFolder: NotesFolderResponseDTO): NotesFolderResponseDTO | null => {
    if (currentFolder.id === id){
      return currentFolder;
    }
    if (currentFolder.subfolders) {
      for (const sub of currentFolder.subfolders) {
        const found = findFolderById(id, sub);
        if (found){
          return found;
        }
      }
    }
    return null;
  };

  return (
    <div
      className={wrapperClass}
    >
      <div
        draggable
        onDragStart={onDragStartFolder}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`mb-3 cursor-pointer flex items-center justify-between hover:bg-bg-hover rounded text-text-main group ${isDragHover ? 'bg-bg-hover ring-2 ring-blue-500' : ''}`}
      >
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
          <div className="flex items-center flex-1 p-2" onClick={() => setIsExpanded(!isExpanded)}>
            <div
              className={`mr-2 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            >
              <Icon name="rightChevron" size="24" className="h-4 w-4" />
            </div>
            <Icon
              name="folder"
              size="14"
              fill="currentColor"
              className="mr-2"
            />
            <span>{folder.name}</span>
          </div>
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
          <DropdownItem
            onClick={() => {
              setIsCreatingSubfolder(true);
              setIsExpanded(true);
            }}
          >
            <Icon name="folderPlus" size={14} className="h-4 w-4 mr-2" fill="currentColor" /> Add subfolder
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              void onCreateNote(folder.id);
              setIsExpanded(true);
            }}
          >
            <Icon name="notePlus" size={14} className="h-4 w-4 mr-2" fill="currentColor" /> Create note
          </DropdownItem>
          <DropdownItem onClick={handleTrash}>
            <Icon name="trash" size={14} className="h-4 w-4 mr-2" /> Move to trash
          </DropdownItem>
        </Dropdown>
      </div>

      {isExpanded &&
        (isCreatingSubfolder ||
          (folder.subfolders && folder.subfolders.length > 0) ||
          (folder.notes && folder.notes.length > 0)) && (
          <>
            {isCreatingSubfolder && (
              <div className="ml-6 mb-3 flex items-center bg-bg-hover rounded text-text-main">
                <input
                  ref={subfolderInputRef}
                  type="text"
                  value={newSubfolderName}
                  onChange={(e) => setNewSubfolderName(e.target.value)}
                  onKeyDown={handleSubfolderKeyDown}
                  onBlur={handleSubfolderSubmit}
                  placeholder="Subfolder name"
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-2"
                />
              </div>
            )}
            {folder.subfolders &&
              folder.subfolders.map((subfolder) => (
                <NotesFolderItem
                  key={subfolder.id}
                  folder={subfolder}
                  regularFolders={regularFolders}
                  onRename={onRename}
                  onCreateSubfolder={onCreateSubfolder}
                  onCreateNote={onCreateNote}
                  onMoveToTrash={onMoveToTrash}
                  onMoveFolder={onMoveFolder}
                  onMoveNote={onMoveNote}
                  wrapperClass="ml-6"
                />
              ))}
            {folder.notes &&
              folder.notes.map((note) => (
                <div
                  key={note.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('dragType', 'note');
                    e.dataTransfer.setData('dragId', note.id.toString());
                  }}
                  className="ml-6 mb-3 flex items-center p-2 hover:bg-bg-hover rounded text-text-main cursor-pointer"
                >
                  <Icon name="note" size={16} fill="currentColor" className="mr-2 text-text-main opacity-70" />
                  <span className="truncate">{note.title || 'Untitled Note'}</span>
                </div>
              ))}
        </>
      )}
    </div>
  );
};
