import axios from 'axios';

import { getConfig } from '@/config.ts';
import {
  NoteSchema,
  NotesFolderSchema,
  NotesFolderTreeSchema,
  NotesFolderTreeWithNotesSchema,
} from './notes_base.ts';

// Types for Notes domain
export type Note = NoteSchema;
export type NotesFolder = NotesFolderSchema;

export interface NoteCreate {
  title?: string | null;
  body: string;
  folder_id?: number | null;
}

export interface NoteUpdate {
  title?: string | null;
  body?: string | null;
  index?: number | null;
  folder_id?: number | null;
}

export interface NotesFolderCreate {
  name: string;
  parent_id?: number | null;
}

export interface NotesFolderUpdate {
  name?: string | null;
  index?: number | null;
  parent_id?: number | null;
}

// API base URLs
const { API_BASE_URL } = getConfig();
const NOTES_API_URL = `${API_BASE_URL}/notes`;

// Notes Endpoints
export const getNotes = (folderId?: number) =>
  axios.get<Note[]>(`${NOTES_API_URL}/`, { params: { folder_id: folderId } });

export const createNote = (note: NoteCreate) => axios.post<Note>(`${NOTES_API_URL}/`, note);

export const updateNote = (noteId: number, changes: NoteUpdate) =>
  axios.patch<Note>(`${NOTES_API_URL}/${noteId}/`, changes);

export const deleteNote = (noteId: number) => axios.delete(`${NOTES_API_URL}/${noteId}/`);

export const reorderNotes = (orderedNoteIds: number[]) =>
  axios.post(`${NOTES_API_URL}/reorder/`, { ordered_note_ids: orderedNoteIds });

// Folders Endpoints
export const getFoldersTree = (includeNotes: boolean = false) =>
  axios.get<(NotesFolderTreeSchema | NotesFolderTreeWithNotesSchema)[]>(
    `${NOTES_API_URL}/folders/tree/`,
    { params: { include_notes: includeNotes } }
  );

export const createFolder = (folder: NotesFolderCreate) =>
  axios.post<NotesFolder>(`${NOTES_API_URL}/folders/`, folder);

export const updateFolder = (folderId: number, changes: NotesFolderUpdate) =>
  axios.patch<NotesFolder>(`${NOTES_API_URL}/folders/${folderId}/`, changes);

export const deleteFolder = (folderId: number) =>
  axios.delete(`${NOTES_API_URL}/folders/${folderId}/`);

export const reorderFolders = (orderedFolderIds: number[]) =>
  axios.post(`${NOTES_API_URL}/folders/reorder/`, { ordered_folder_ids: orderedFolderIds });
