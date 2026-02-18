import React, { useState, useEffect, useRef } from 'react';

import type { NoteDTO } from '@api/notes';

interface NotesEditorProps {
  note: NoteDTO | null;
  onUpdate: (id: number, title: string | null, body: string) => Promise<void>;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [body, setBody] = useState(note?.body || '');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setBody(note?.body || '');

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [note?.id, note?.title, note?.body]);

  const handleChange = (newTitle: string, newBody: string) => {
    setTitle(newTitle);
    setBody(newBody);

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
        onChange={(e) => handleChange(e.target.value, body)}
        placeholder="Note title"
        className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-text-main placeholder:text-text-main/30"
      />
      <textarea
        value={body}
        onChange={(e) => handleChange(title, e.target.value)}
        placeholder="Start writing..."
        className="flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-text-main resize-none placeholder:text-text-main/30 leading-relaxed"
      />
    </div>
  );
};
