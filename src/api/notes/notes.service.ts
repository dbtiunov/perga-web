import axios from 'axios';

import { getConfig } from '@/config';
import type {
  NoteDTO, NoteCreateDTO, NoteUpdateDTO,
  NotesFolderDTO, NotesFolderCreateDTO, NotesFolderUpdateDTO,
  NotesFolderTreeDTO, NotesFolderTreeWithNotesDTO
} from './notes.dto';


// API URLs
const { API_BASE_URL } = getConfig();
const NOTES_API_URL = `${API_BASE_URL}/notes`;

// Notes API methods
export const getNotes = (folderId?: number) =>
  axios.get<NoteDTO[]>(`${NOTES_API_URL}/`, { params: { folder_id: folderId } });

export const createNote = (note: NoteCreateDTO) => axios.post<NoteDTO>(`${NOTES_API_URL}/`, note);

export const updateNote = (noteId: number, changes: NoteUpdateDTO) =>
  axios.patch<NoteDTO>(`${NOTES_API_URL}/${noteId}/`, changes);

export const moveNoteToTrash = (noteId: number) =>
  axios.post<NoteDTO>(`${NOTES_API_URL}/${noteId}/move-to-trash/`);

export const reorderNotes = (orderedNoteIds: number[]) =>
  axios.post(`${NOTES_API_URL}/reorder/`, { ordered_note_ids: orderedNoteIds });

// Notes Folders API methods
export const getFoldersTree = (includeNotes: boolean = false) =>
  axios.get<(NotesFolderTreeDTO | NotesFolderTreeWithNotesDTO)[]>(
    `${NOTES_API_URL}/folders/tree/`,
    { params: { include_notes: includeNotes } }
  );

export const createFolder = (folder: NotesFolderCreateDTO) =>
  axios.post<NotesFolderDTO>(`${NOTES_API_URL}/folders/`, folder);

export const updateFolder = (folderId: number, changes: NotesFolderUpdateDTO) =>
  axios.patch<NotesFolderDTO>(`${NOTES_API_URL}/folders/${folderId}/`, changes);

export const moveFolderToTrash = (folderId: number) =>
  axios.post<NotesFolderDTO>(`${NOTES_API_URL}/folders/${folderId}/move-to-trash/`);

export const reorderFolders = (orderedFolderIds: number[]) =>
  axios.post(`${NOTES_API_URL}/folders/reorder/`, { ordered_folder_ids: orderedFolderIds });
