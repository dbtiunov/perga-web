import React, {KeyboardEvent, useRef, useState} from 'react';

import { PlannerAgenda, PlannerAgendaUpdate } from '@api/planner_agendas.ts';
import { Icon } from '@common/Icon.tsx';
import { AGENDA_NAME_MAX_LENGTH } from "@planner/const.ts";

interface AgendaLineProps {
  agenda: PlannerAgenda;
  onUpdateAgenda: (agendaId: number, changes: PlannerAgendaUpdate) => void;
  onDeleteAgenda?: (agendaId: number) => void;
}

const AgendaLine: React.FC<AgendaLineProps> = ({
  agenda,
  onUpdateAgenda,
  onDeleteAgenda
}) => {
  const isEmptyLine: boolean = agenda.id === -1;
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
  }

  return (
    <div className="group flex items-center gap-2 min-h-[2.5rem] hover:bg-gray-100 rounded">
      {isEditing ? (
        <input ref={inputRef} type="text" value={value} autoFocus
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
               placeholder={isEmptyLine ? "Add new agenda" : ""}
        />
      ) : (
        <div onClick={() => !isEmptyLine && setIsEditing(true)}
             className="flex-1 px-2 cursor-text text-gray-600 truncate hover:cursor-text">
          {agenda.name}
        </div>
      )}

      {!isEmptyLine && <div className="flex-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity
                                       p-2 text-gray-600">
        <button type="button"
                onClick={() => onDeleteAgenda?.(agenda.id)}
                aria-label="Delete agenda" title="Delete agenda"
                className="disabled:opacity-50">
          <Icon name="delete" size={24} className="h-5 w-5" />
        </button>
      </div>}
    </div>
  );
};

export default AgendaLine;
