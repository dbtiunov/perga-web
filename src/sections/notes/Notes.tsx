import { TwoPaneLayout } from '@common/components/TwoPaneLayout';
import { StorageKeys } from '@common/utils/storage_keys';
import { NotesFolders } from '@notes/components/NotesFolders/NotesFolders';

const DEFAULT_LEFT_PANE_WIDTH_PERCENT = 20; // w-1/5
const MIN_LEFT_PANE_WIDTH_PERCENT = 10;
const MAX_LEFT_PANE_WIDTH_PERCENT = 30;

const Notes = () => {
  return (
    <TwoPaneLayout
      storageKey={StorageKeys.NotesLeftPaneWidth}
      defaultLeftWidthPercent={DEFAULT_LEFT_PANE_WIDTH_PERCENT}
      minLeftWidthPercent={MIN_LEFT_PANE_WIDTH_PERCENT}
      maxLeftWidthPercent={MAX_LEFT_PANE_WIDTH_PERCENT}
      leftPane={<NotesFolders />}
      rightPane={<h2>RIGHT PANE</h2>}
    />
  );
};

export default Notes;
