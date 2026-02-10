export interface NoteDTO {
  id: number;
  index: number;
  created_dt: string;
  updated_dt: string;
  title: string | null;
  body: string;
  folder_id: number | null;
}

export interface NotesFolderDTO {
  id: number;
  index: number;
  created_dt: string;
  updated_dt: string;
  name: string;
  parent_id: number | null;
  folder_type: 'regular' | 'trash' | 'archive';
}

export interface NotesFolderTreeDTO extends NotesFolderDTO {
  subfolders: NotesFolderTreeDTO[];
}

export interface NotesFolderTreeWithNotesDTO extends NotesFolderDTO {
  subfolders: NotesFolderTreeWithNotesDTO[];
  notes: NoteDTO[];
}

export interface NoteCreateDTO {
  title?: string | null;
  body: string;
  folder_id?: number | null;
}

export interface NoteUpdateDTO {
  title?: string | null;
  body?: string | null;
  index?: number | null;
  folder_id?: number | null;
}

export interface NotesFolderCreateDTO {
  name: string;
  parent_id?: number | null;
}

export interface NotesFolderUpdateDTO {
  name?: string | null;
  index?: number | null;
  parent_id?: number | null;
}
