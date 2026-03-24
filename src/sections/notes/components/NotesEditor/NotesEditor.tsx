import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Markdown } from 'tiptap-markdown';

import type { NoteDTO } from '@api/notes';
import { cleanEditorHTML } from '@common/utils/string_utils';
import { NotesEditorMenuBar } from '@notes/components/NotesEditor/NotesEditorMenuBar/NotesEditorMenuBar.tsx';
import { useNotesDebounceUpdate } from '@notes/components/NotesEditor/useNotesDebounceUpdate';
import '@notes/components/NotesEditor/notes_editor.css';

interface NotesEditorProps {
  note: NoteDTO | null;
  onUpdate: (id: number, title: string | undefined, body: string | undefined) => Promise<void>;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note?.title || '');
  const lastSyncedNoteIdRef = useRef<number | undefined>(undefined);
  const { debounceUpdate, hasPendingUpdate } = useNotesDebounceUpdate({
    selectedNote: note,
    onUpdate,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Markdown,
    ],
    content: note?.body || '',
    onUpdate: () => {
      handleBodyChange();
    },
    editorProps: {
      attributes: {
        class:
          'flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-text-main resize-none placeholder:text-text-main/30 leading-relaxed overflow-y-auto min-h-[200px]',
      },
    },
  });

  // extract note values for using in dependencies
  const editorHTML = editor?.getHTML();
  const noteId = note?.id;
  const noteTitle = note?.title;
  const noteBody = note?.body;

  // sync external changes to editor
  useEffect(() => {
    // update values if user switched note or there is no pending update
    if (lastSyncedNoteIdRef.current !== noteId || !hasPendingUpdate) {
      // normalize vars that can be various types for comparing
      const normalizedNoteTitle = noteTitle || '';
      const normalizedNoteBody = noteBody || '';
      const normalizedEditorHTML = editorHTML || '';

      setTitle(normalizedNoteTitle);
      if (editor && normalizedNoteBody !== normalizedEditorHTML) {
        editor.commands.setContent(normalizedNoteBody);
        lastSyncedNoteIdRef.current = noteId;
      }
    }
  }, [noteId, noteTitle, noteBody, editor, editorHTML, hasPendingUpdate]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debounceUpdate(newTitle, undefined);
  };

  const handleBodyChange = () => {
    if (!editor) {
      return;
    }

    const newBody = cleanEditorHTML(editor.getHTML());
    debounceUpdate(undefined, newBody);
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-text-main/40">
        <p>Select a note to edit</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-4 overflow-hidden">
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title"
        className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-text-main placeholder:text-text-main/30"
      />
      <NotesEditorMenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-hidden flex flex-col" />
    </div>
  );
};
