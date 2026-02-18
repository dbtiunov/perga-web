import { TwoPaneLayout } from '@common/components/TwoPaneLayout';
import { StorageKeys } from '@common/utils/storage_keys';
import { NotesProvider, useNotes } from '@notes/context';
import { NotesFolders } from '@notes/components/NotesFolders/NotesFolders';
import { NotesEditor } from '@notes/components/NotesEditor/NotesEditor';

const DEFAULT_LEFT_PANE_WIDTH_PERCENT = 20; // w-1/5
const MIN_LEFT_PANE_WIDTH_PERCENT = 15;
const MAX_LEFT_PANE_WIDTH_PERCENT = 30;

const NotesContent = () => {
  const { selectedNote, handleUpdateNote } = useNotes();

  return (
    <TwoPaneLayout
      storageKey={StorageKeys.NotesLeftPaneWidth}
      defaultLeftWidthPercent={DEFAULT_LEFT_PANE_WIDTH_PERCENT}
      minLeftWidthPercent={MIN_LEFT_PANE_WIDTH_PERCENT}
      maxLeftWidthPercent={MAX_LEFT_PANE_WIDTH_PERCENT}
      leftPane={<NotesFolders />}
      rightPane={<NotesEditor note={selectedNote} onUpdate={handleUpdateNote} />}
    />
  );
};

const Notes = () => {
  return (
    <NotesProvider>
      <NotesContent />
    </NotesProvider>
  );
};

export default Notes;
