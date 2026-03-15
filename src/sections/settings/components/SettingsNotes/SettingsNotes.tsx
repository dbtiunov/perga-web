import React, { useState } from 'react';

import { useNotes } from '@notes/context';
import { Icon } from '@common/components/Icon';

export const SettingsNotes: React.FC = () => {
  const { handleExportNotes } = useNotes();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const onExport = async (type: 'markdown' | 'html' | 'pdf') => {
    setIsExporting(true);
    try {
      await handleExportNotes(type, 'all_notes');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full md:max-w-2/5 text-text-main">
      <fieldset className="border border-border-main rounded p-8">
        <legend className="px-2">Export Notes</legend>
        <div className="flex flex-col space-y-4">
          <p className="text-sm opacity-60">
            Export all your notes from all folders as a single archive.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => onExport('markdown')}
              disabled={isExporting}
              className="flex items-center justify-center p-2 px-4 text-sm hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed rounded border border-border-main transition-colors"
              title="Export as Markdown"
            >
              <Icon name="download" size={14} className="mr-2" fill="currentColor" />
              <span>Markdown</span>
            </button>
            <button
              onClick={() => onExport('html')}
              disabled={isExporting}
              className="flex items-center justify-center p-2 px-4 text-sm hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed rounded border border-border-main transition-colors"
              title="Export as HTML"
            >
              <Icon name="download" size={14} className="mr-2" fill="currentColor" />
              <span>HTML</span>
            </button>
            <button
              onClick={() => onExport('pdf')}
              disabled={isExporting}
              className="flex items-center justify-center p-2 px-4 text-sm hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed rounded border border-border-main transition-colors"
              title="Export as PDF"
            >
              <Icon name="download" size={14} className="mr-2" fill="currentColor" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};
