import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import * as React from 'react';

import { PlannerAgendaItem, PlannerAgendaType } from '@api/planner_agendas';
import { PlannerItemState } from '@api/planner_base';
import { Icon } from "@common/Icon.tsx";
import { ITEM_TEXT_MAX_LENGTH } from "@planner/const.ts";

interface AgendaItemProps {
  item: PlannerAgendaItem;
  agendaType?: PlannerAgendaType;
  onDragStartItem?: () => void;
  onDragEndItem?: () => void;
  onUpdateItem: (itemId: number, changes: { text?: string; day?: string; state?: PlannerItemState }) => void;
  onDeleteItem?: (itemId: number) => void;
}

const AgendaItem = ({
  item,
  agendaType,
  onDragStartItem,
  onDragEndItem,
  onUpdateItem,
  onDeleteItem
}: AgendaItemProps) => {
  const isBacklog = agendaType === 'backlog';
  const isEmptyItem: boolean = item.id === -1;

  const [isEditing, setIsEditing] = useState(isEmptyItem);
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(item.text);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onToggleCheckbox = () => {
    let newState: PlannerItemState

    if (item.state === 'todo') {
      newState = 'completed';
    } else {
      newState = 'todo';
    }

    onUpdateItem(item.id, { state: newState });
  };

  const onDropActionClick = () => {
    onUpdateItem(item.id, { state: 'dropped' });
    setIsDropdownOpen(false);
  };

  const onDeleteActionClick = () => {
    onDeleteItem?.(item.id);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isEmptyItem) {
        setIsEditing(false);
        onUpdateItem(item.id, { text: value });
      } else {
        // For empty item, update but stay in editing mode
        onUpdateItem(item.id, { text: value });
        setValue(''); // Clear the input after adding
      }
    }
    if (e.key === 'Escape') {
      if (!isEmptyItem) {
        setIsEditing(false);
        setValue(item.text);
      } else {
        // For empty item, just clear the input
        setValue('');
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStartItem?.();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    onDragEndItem?.();
  };

  const onExtraActionsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const canDrag: boolean = !isEmptyItem;
  const showCheckbox: boolean = !isEmptyItem;
  const showExtraActions: boolean = !isEmptyItem;

  return (
    <div className={`group flex items-center gap-2 min-h-[2.5rem] p-2
                     ${!isEmptyItem ? 'hover:bg-gray-100 rounded' : ''}
                     ${isDragging ? 'opacity-50' : 'opacity-100'}
                     transition-opacity duration-200`}
         draggable={canDrag}
         onDragStart={canDrag ? handleDragStart : undefined}
         onDragEnd={canDrag ? handleDragEnd : undefined}>
      {canDrag && (
        <div className="flex-none cursor-grab opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
             aria-label="Drag to reorder" title="Drag to reorder">
          <Icon name="drag" size={24} className="h-4 w-4 text-gray-600" />
        </div>
      )}

      {showCheckbox && (
        <div onClick={onToggleCheckbox}
             className={`flex-none w-5 h-5 rounded flex items-center justify-center cursor-pointer
                         ${item.state === 'todo' 
                           ? 'border border-gray-300 bg-white' 
                           : item.state === 'completed'
                           ? 'bg-green-500 border border-green-500' 
                           : 'bg-blue-500 border border-blue-500'}`}
             aria-checked={item.state === 'completed'}
             role="checkbox">
          {item.state === 'completed' && (
            <Icon name="checkboxCompleted" size={48} className="h-3 w-3 text-white" />
          )}
          {item.state === 'snoozed' && (
            <Icon name="checkboxSnoozed" size={48} className="h-3 w-3 text-white" />
          )}
          {item.state === 'dropped' && (
            <Icon name="checkboxDropped" size={48} className="h-3 w-3 text-white" />
          )}
        </div>
      )}

      {isEditing ? (
        <input ref={inputRef} type="text" value={value} autoFocus
               maxLength={ITEM_TEXT_MAX_LENGTH}
               onChange={(e) => setValue(e.target.value)}
               onBlur={() => {
                 if (!isEmptyItem) {
                   setIsEditing(false);
                   onUpdateItem(item.id, { text: value });
                 }
               }}
               onKeyDown={handleKeyDown}
               className={`min-w-0 flex-1 bg-transparent border-none focus:outline-none focus:ring-0 
                           ${isEmptyItem ? 'px-14' : 'px-1'}`}
               placeholder={isEmptyItem ? (isBacklog ? "Keep it here for the future" : "Plan ahead for the month") : ""} />
        ) : (
          <div onClick={() => !isEmptyItem && setIsEditing(true)}
               className={`flex-1 px-1 cursor-text break-all
                           ${item.state === 'completed' ? 'line-through text-gray-400' : 'text-gray-600'}`}>
            {item.text}
          </div>
        )
      }

      {showExtraActions && <div className="inline-flex ml-2 relative opacity-100 md:opacity-0
                                           md:group-hover:opacity-100 transition-opacity" ref={dropdownRef}>
        <button onClick={onExtraActionsClick}
                aria-label="Extra actions" title="Extra actions">
          <Icon name="dots" size={48} className="h-6 w-6" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-8 w-32 bg-white rounded-md shadow-lg z-10">
            <button onClick={onDropActionClick}
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-gray-100 flex items-center"
                    aria-label="Drop item" title="Drop item">
              <Icon name="drop" size={48} className="h-4 w-4 mr-2" /> Drop
            </button>

            <button onClick={onDeleteActionClick}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                    aria-label="Delete item" title="Delete item">
              <Icon name="delete" size={48} className="h-4 w-4 mr-2" /> Delete
            </button>
          </div>
        )}
      </div>}
    </div>
  );
};

export default AgendaItem;
