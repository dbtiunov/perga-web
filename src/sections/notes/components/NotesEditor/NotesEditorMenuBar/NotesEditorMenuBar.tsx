import React from 'react';
import type { Editor } from '@tiptap/react';

import { editorIcons } from '../notes_editor_icons.tsx';

interface MenuBarProps {
  editor: Editor | null;
}

export const NotesEditorMenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: 'bold' as keyof typeof editorIcons,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: 'italic' as keyof typeof editorIcons,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: 'strike' as keyof typeof editorIcons,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: 'h1' as keyof typeof editorIcons,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: 'h2' as keyof typeof editorIcons,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: 'bulletList' as keyof typeof editorIcons,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: 'orderedList' as keyof typeof editorIcons,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: 'blockquote' as keyof typeof editorIcons,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: 'codeBlock' as keyof typeof editorIcons,
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      icon: 'undo' as keyof typeof editorIcons,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: 'redo' as keyof typeof editorIcons,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
    {
      icon: 'underline' as keyof typeof editorIcons,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 pb-4 border-b border-border-main">
      {buttons.map((btn) => (
        <button
          key={btn.title}
          onClick={btn.action}
          title={btn.title}
          className={`p-1.5 rounded hover:bg-bg-hover transition-colors ${
            btn.isActive ? 'bg-bg-hover text-text-main' : 'text-text-muted'
          }`}
        >
          {React.cloneElement(editorIcons[btn.icon], {
            size: 18,
          })}
        </button>
      ))}
    </div>
  );
};
