import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

import type { NoteDTO } from '@api/notes';
import { NotesEditorMenuBar } from './NotesEditorMenuBar/NotesEditorMenuBar.tsx';
import './notes_editor.css';

interface NotesEditorProps {
  note: NoteDTO | null;
  onUpdate: (id: number, title: string | null, body: string) => Promise<void>;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note?.title || '');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Underline,
    ],
    content: note?.body || '',
    onUpdate: ({ editor }) => {
      handleBodyChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-text-main resize-none placeholder:text-text-main/30 leading-relaxed overflow-y-auto min-h-[200px]',
      },
    },
  });

  useEffect(() => {
    setTitle(note?.title || '');
    if (editor && note?.body !== editor.getHTML()) {
      editor.commands.setContent(note?.body || '');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [note?.id, note?.title, note?.body, editor]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debounceUpdate(newTitle, editor?.getHTML() || '');
  };

  const handleBodyChange = (newBody: string) => {
    debounceUpdate(title, newBody);
  };

  const debounceUpdate = (newTitle: string, newBody: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (note) {
      timerRef.current = setTimeout(() => {
        void onUpdate(note.id, newTitle || null, newBody);
      }, 1000);
    }
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
