import axios from 'axios';

import { getConfig } from '@/config.ts';
import { BaseNoteItem, NoteItemState } from './notes_base.ts';

// Types for Notes domain
export interface Note extends BaseNoteItem {
  // Extend later with domain-specific fields
}

export interface NoteCreate {
  text: string;
}

export interface NoteUpdate {
  text?: string;
  index?: number;
  state?: NoteItemState;
}

// API base URLs
const { API_BASE_URL } = getConfig();
const NOTES_API_URL = `${API_BASE_URL}/notes`;

// Endpoints (scaffolding only, no business logic assumptions)
export const getNotes = () => axios.get<Note[]>(`${NOTES_API_URL}/`);

export const createNote = (note: NoteCreate) => axios.post<Note>(`${NOTES_API_URL}/`, note);

export const updateNote = (noteId: number, changes: NoteUpdate) =>
  axios.put<Note>(`${NOTES_API_URL}/${noteId}/`, changes);

export const deleteNote = (noteId: number) => axios.delete(`${NOTES_API_URL}/${noteId}/`);

export const reorderNotes = (orderedNoteIds: number[]) =>
  axios.post(`${NOTES_API_URL}/reorder/`, { ordered_note_ids: orderedNoteIds });
