export interface BaseNoteItem {
  id: number;
  index: number;
  created_dt: string;
  updated_dt: string;
}

export interface NoteSchema extends BaseNoteItem {
  title: string | null;
  body: string;
  folder_id: number | null;
}

export interface NotesFolderSchema extends BaseNoteItem {
  name: string;
  parent_id: number | null;
}

export interface NotesFolderTreeSchema extends NotesFolderSchema {
  subfolders: NotesFolderTreeSchema[];
}

export interface NotesFolderTreeWithNotesSchema extends NotesFolderTreeSchema {
  notes: NoteSchema[];
}
