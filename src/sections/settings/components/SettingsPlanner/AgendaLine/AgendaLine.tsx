import React, { KeyboardEvent, useRef, useState } from 'react';

import { PlannerAgenda, PlannerAgendaUpdate } from '@api/planner_agendas.ts';
import { Icon } from '@common/Icon.tsx';
import { AGENDA_NAME_MAX_LENGTH } from '@planner/const.ts';

interface AgendaLineProps {
  agenda: PlannerAgenda;
  onUpdateAgenda: (agendaId: number, changes: PlannerAgendaUpdate) => void;
  onDeleteAgenda?: (agendaId: number) => void;
  onDragStart?: (agenda: PlannerAgenda) => void;
  onDragEnd?: () => void;
  onDragOverAgenda?: (agenda: PlannerAgenda) => void;
}

const AgendaLine: React.FC<AgendaLineProps> = ({
  agenda,
  onUpdateAgenda,
  onDeleteAgenda,
  onDragStart,
  onDragEnd,
  onDragOverAgenda,
}) => {
  const isEmptyLine: boolean = agenda.id === -1;
  const isArchived: boolean = agenda.agenda_type === 'archived';
  const [isEditing, setIsEditing] = useState(isEmptyLine);
  const [value, setValue] = useState(agenda.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isEmptyLine) {
        setIsEditing(false);
        onUpdateAgenda(agenda.id, { name: value });
      } else {
        // For empty line, update but stay in editing mode
        onUpdateAgenda(agenda.id, { name: value });
        setValue(''); // Clear the input after adding
      }
    }
    if (e.key === 'Escape') {
      if (!isEmptyLine) {
        setIsEditing(false);
        setValue(agenda.name);
      } else {
        // For empty item, just clear the input
        setValue('');
      }
    }
  };

  return (
    <div
      className={`group flex items-center gap-2 min-h-[2.5rem] rounded 
                  ${isArchived ? 'bg-gray-100 italic opacity-80' : ''}`}
      draggable={!isEmptyLine && !isArchived}
      onDragStart={!isEmptyLine && !isArchived ? () => onDragStart?.(agenda) : undefined}
      onDragEnd={!isEmptyLine && !isArchived ? () => onDragEnd?.() : undefined}
      onDragOver={
        !isEmptyLine && !isArchived
          ? (e) => {
              e.preventDefault();
              onDragOverAgenda?.(agenda);
            }
          : undefined
      }
    >
      {!isEmptyLine && !isArchived && (
        <div
          className="flex-none cursor-grab opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <Icon name="drag" size={24} className="h-4 w-4 text-gray-600" />
        </div>
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          autoFocus
          maxLength={AGENDA_NAME_MAX_LENGTH}
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            if (isEmptyLine) {
              return;
            }
            setIsEditing(false);
            onUpdateAgenda(agenda.id, { name: value });
          }}
          className="min-w-0 flex-1 bg-transparent rounded px-2 py-1 text-gray-600 focus:outline-none
                          focus:ring-0"
          placeholder={isEmptyLine ? 'Add new agenda' : ''}
        />
      ) : (
        <div
          onClick={() => !isEmptyLine && setIsEditing(true)}
          className={`flex-1 px-2 cursor-text truncate hover:cursor-text ${isArchived ? 'text-gray-500' : 'text-gray-600'}`}
        >
          {agenda.name} ({agenda.completed_items_cnt}/
          {agenda.completed_items_cnt + agenda.todo_items_cnt})
        </div>
      )}

      {!isEmptyLine && (
        <div className="flex-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 text-gray-600 flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateAgenda(agenda.id, { agenda_type: isArchived ? 'custom' : 'archived' })
            }
            aria-label={isArchived ? 'Unarchive agenda' : 'Archive agenda'}
            title={isArchived ? 'Unarchive agenda' : 'Archive agenda'}
            className="text-sm text-current hover:underline focus:outline-none focus-visible:ring-2
                          focus-visible:ring-gray-400 rounded"
          >
            {isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            type="button"
            onClick={() => onDeleteAgenda?.(agenda.id)}
            aria-label="Delete agenda"
            title="Delete agenda"
            className="disabled:opacity-50"
          >
            <Icon name="delete" size={24} className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AgendaLine;
