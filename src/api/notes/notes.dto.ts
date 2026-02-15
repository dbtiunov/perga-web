export interface NoteDTO {
  id: number;
  index: number;
  title: string | null;
  body: string;
  folder_id: number | null;
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

export interface NotesFolderDTO {
  id: number;
  index: number;
  name: string;
  parent_id: number | null;
  folder_type: 'regular' | 'root' | 'trash';
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

export interface NotesFolderResponseDTO {
  id: number;
  parent_id: number;
  folder_type: string;
  name: string;
  index: number;
  notes: NoteDTO[];
  subfolders: NotesFolderResponseDTO[];
}

export interface NotesFoldersResponseSchemaDTO {
  root_folder: NotesFolderResponseDTO;
  trash_folder: NotesFolderResponseDTO;
}
