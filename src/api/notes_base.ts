export type NoteItemState = 'todo' | 'completed' | 'archived';

export interface BaseNoteItem {
  id: number;
  text: string;
  state: NoteItemState;
  index: number;
}
