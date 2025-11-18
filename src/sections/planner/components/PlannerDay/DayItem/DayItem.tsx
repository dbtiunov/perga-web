import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import * as React from 'react';
import Calendar from '@planner/components/Calendar/Calendar';

import { PlannerItemState } from '@api/planner_base';
import { PlannerDayItem } from '@api/planner_days';
import { Icon } from '@common/Icon.tsx';
import { ITEM_TEXT_MAX_LENGTH } from '@planner/const.ts';
import { getNextDay, getNextMonth, getNextWeek } from '@planner/utils/dateUtils.ts';

interface DayItemProps {
  item: PlannerDayItem;
  onDragStartItem?: () => void;
  onDragEndItem?: () => void;
  onUpdateItem: (
    itemId: number,
    changes: { text?: string; day?: string; state?: PlannerItemState },
  ) => void;
  onDeleteItem?: (itemId: number) => void;
  onCopyItem?: (itemId: number, date: Date) => void;
  onSnoozeItem?: (itemId: number, date: Date) => void;
}

const DayItem = ({
  item,
  onDragStartItem,
  onDragEndItem,
  onUpdateItem,
  onDeleteItem,
  onCopyItem,
  onSnoozeItem,
}: DayItemProps) => {
  const itemDate = new Date(item.day);
  const isEmptyItem: boolean = item.id === -1;

  const [isEditing, setIsEditing] = useState(isEmptyItem);
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(item.text);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopyDropdownOpen, setIsCopyDropdownOpen] = useState(false);
  const [isSnoozeDropdownOpen, setIsSnoozeDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const copyDropdownRef = useRef<HTMLDivElement>(null);
  const snoozeDropdownRef = useRef<HTMLDivElement>(null);

  const onToggleCheckbox = () => {
    let newState: PlannerItemState;

    if (item.state === 'todo') {
      newState = 'completed';
    } else {
      newState = 'todo';
    }

    onUpdateItem(item.id, { state: newState });
  };

  const onCopyActionClick = () => {
    setIsCopyDropdownOpen(!isCopyDropdownOpen);
    setIsSnoozeDropdownOpen(false);
    setIsDropdownOpen(false);
  };

  const onSnoozeActionClick = () => {
    setIsSnoozeDropdownOpen(!isSnoozeDropdownOpen);
    setIsCopyDropdownOpen(false);
    setIsDropdownOpen(false);
  };

  const predefinedDates: Array<{ label: string; date: Date }> = [
    { label: 'Next day', date: getNextDay(itemDate) },
    { label: 'Next week', date: getNextWeek(itemDate) },
    { label: 'Next month', date: getNextMonth(itemDate) },
  ];

  const handleCopyItem = (day: Date) => {
    onCopyItem?.(item.id, day);
    setIsCopyDropdownOpen(false);
  };

  const handleSnoozeItem = (day: Date) => {
    onSnoozeItem?.(item.id, day);
    setIsSnoozeDropdownOpen(false);
  };

  const onExtraActionsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsCopyDropdownOpen(false);
    setIsSnoozeDropdownOpen(false);
  };

  const onDropActionClick = () => {
    onUpdateItem(item.id, { state: 'dropped' });
    setIsDropdownOpen(false);
  };

  const onDeleteActionClick = () => {
    onDeleteItem?.(item.id);
    setIsDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (copyDropdownRef.current && !copyDropdownRef.current.contains(event.target as Node)) {
        setIsCopyDropdownOpen(false);
      }
      if (snoozeDropdownRef.current && !snoozeDropdownRef.current.contains(event.target as Node)) {
        setIsSnoozeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (item.id >= 0) {
        setIsEditing(false);
        onUpdateItem(item.id, { text: value });
      } else {
        // For empty item, update but stay in editing mode
        onUpdateItem(item.id, { text: value });
        setValue(''); // Clear the input after adding
      }
    } else if (e.key === 'Escape') {
      if (item.id >= 0) {
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

  const canDrag: boolean = !isEmptyItem;
  const showCheckbox: boolean = !isEmptyItem;
  const showActions: boolean = !isEmptyItem;
  const showExtraActions: boolean = !isEmptyItem;

  return (
    <div
      className={`group flex items-center gap-2 min-h-[2.5rem] transition-opacity duration-200 hover:bg-bg-hover rounded
                     ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      draggable={canDrag}
      onDragStart={canDrag ? handleDragStart : undefined}
      onDragEnd={canDrag ? handleDragEnd : undefined}
    >
      {canDrag && (
        <div
          className="flex-none cursor-grab opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <Icon name="drag" size={24} className="h-4 w-4 text-text-main" />
        </div>
      )}

      {showCheckbox && (
        <div
          onClick={onToggleCheckbox}
          className={`flex-none w-5 h-5 rounded flex items-center justify-center cursor-pointer
                         ${
                           item.state === 'todo'
                             ? 'bg-bg-main border border-border-main'
                             : item.state === 'completed'
                               ? 'bg-bg-green border border-border-green'
                               : 'bg-bg-blue border border-border-blue'
                         }`}
          role="checkbox"
          aria-checked={item.state === 'completed'}
        >
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
        <input
          ref={inputRef}
          type="text"
          value={value}
          autoFocus
          maxLength={ITEM_TEXT_MAX_LENGTH}
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            if (isEmptyItem) {
              return;
            }
            setIsEditing(false);
            onUpdateItem(item.id, { text: value });
          }}
          className={`min-w-0 flex-1 bg-transparent border-none focus:outline-none focus:ring-0
                        ${isEmptyItem ? 'px-15' : 'px-2'}`}
          placeholder={isEmptyItem ? 'Jot something...' : ''}
        />
      ) : (
        <div
          onClick={() => !isEmptyItem && setIsEditing(true)}
          className={`flex-1 px-2 cursor-text 
                         ${item.state === 'todo' ? 'text-text-main' : 'line-through text-text-muted'}`}
        >
          {item.text}
        </div>
      )}

      {showActions && (
        <div className="flex-none relative opacity-100 md:opacity-0 md:group-hover:opacity-100 text-text-main p-2 bg-transparent transition-opacity">
          <div className="inline-flex relative" ref={copyDropdownRef}>
            <button
              onClick={onCopyActionClick}
              className="inline-flex"
              aria-label="Copy item"
              title="Copy item"
            >
              <Icon name="copy" size={48} className="h-6 w-6" />
            </button>

            {isCopyDropdownOpen && (
              <div className="absolute right-0 mt-8 w-40 bg-bg-main rounded shadow-lg z-10">
                <Calendar
                  selectedDate={new Date()}
                  onDateChange={handleCopyItem}
                  title="Copy to"
                  predefinedDates={predefinedDates}
                />
              </div>
            )}
          </div>

          <div className="inline-flex relative ml-2" ref={snoozeDropdownRef}>
            <button
              onClick={onSnoozeActionClick}
              className="inline-flex"
              aria-label="Snooze item"
              title="Snooze item"
            >
              <Icon name="snooze" size={48} className="h-6 w-6" />
            </button>

            {isSnoozeDropdownOpen && (
              <div className="absolute right-0 mt-8 w-40 bg-bg-main rounded shadow-lg z-10">
                <Calendar
                  selectedDate={new Date()}
                  onDateChange={handleSnoozeItem}
                  title="Snooze to"
                  predefinedDates={predefinedDates}
                />
              </div>
            )}
          </div>

          {showExtraActions && (
            <div className="inline-flex relative ml-2" ref={dropdownRef}>
              <button
                onClick={onExtraActionsClick}
                aria-label="Extra actions"
                title="Extra actions"
              >
                <Icon name="dots" size={48} className="h-6 w-6" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-8 w-36 bg-bg-main rounded shadow-lg z-10 border-border-main border-1">
                  <button
                    onClick={onDropActionClick}
                    className="w-full text-left px-4 py-3 text-sm  hover:bg-bg-hover flex items-center"
                    aria-label="Drop item"
                    title="Drop item"
                  >
                    <Icon name="drop" size={48} className="h-4 w-4 mr-2" />
                    Drop item
                  </button>

                  <button
                    onClick={onDeleteActionClick}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-bg-hover flex items-center"
                    aria-label="Delete item"
                    title="Delete item"
                  >
                    <Icon name="delete" size={48} className="h-4 w-4 mr-2" />
                    Delete item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayItem;
