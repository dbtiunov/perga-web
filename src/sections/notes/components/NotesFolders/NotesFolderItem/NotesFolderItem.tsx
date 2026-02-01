import type { NotesFolderTreeDTO } from '@api/notes/notes.dto.ts';
import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/Icon.tsx';

interface NotesFolderItemProps {
  folder: NotesFolderTreeDTO;
  onRename: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const NotesFolderItem = ({ folder, onRename, onDelete }: NotesFolderItemProps) => {
  const handleRename = () => {
    const newName = prompt('Enter new folder name:', folder.name);
    if (newName && newName !== folder.name) {
      void onRename(folder.id, newName);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete folder "${folder.name}"?`)) {
      void onDelete(folder.id);
    }
  };

  return (
    <div className="ml-4">
      <div className="mb-3 cursor-pointer flex items-center justify-between hover:bg-bg-hover rounded text-text-main group">
        <span className="p-2">{folder.name}</span>

        <Dropdown
          buttonIcon={<Icon name="dots" size={16} />}
          buttonTitle="Folder actions"
          buttonClassName="opacity-0 group-hover:opacity-100 transition-opacity"
          dropdownClassName="w-32"
        >
          <DropdownItem onClick={handleRename}>
            <Icon name="edit" size={14} className="mr-2" /> Rename
          </DropdownItem>
          <DropdownItem onClick={handleDelete}>
            <Icon name="delete" size={14} className="mr-2" /> Delete
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
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
