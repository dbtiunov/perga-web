import { useState, useRef, KeyboardEvent } from 'react';
import * as React from 'react';

import type { PlannerItemStateDTO, PlannerAgendaItemDTO, PlannerAgendaDTO } from '@api/planner';
import { Dropdown, DropdownItem } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';
import { getNextDay, formatDateForDisplay } from '@common/utils/date_utils';
import { ITEM_TEXT_MAX_LENGTH } from '@planner/const';

interface AgendaItemProps {
  item: PlannerAgendaItemDTO;
  onDragStartItem?: () => void;
  onDragEndItem?: () => void;
  onUpdateItem: (
    itemId: number,
    changes: { text?: string; day?: string; state?: PlannerItemStateDTO },
  ) => void;
  onDeleteItem?: (itemId: number) => void;
  onCopyItem?: (itemId: number, toAgendaId: number) => void;
  onMoveItem?: (itemId: number, fromAgendaId: number, toAgendaId: number) => void;
  onCopyToDay?: (date: Date, text: string) => void;
  selectedDate?: Date;
  copyAgendasMap?: {
    currentMonth: PlannerAgendaDTO;
    nextMonth: PlannerAgendaDTO;
    customAgendas: PlannerAgendaDTO[];
  };
}

const AgendaItem = ({
  item,
  onDragStartItem,
  onDragEndItem,
  onUpdateItem,
  onDeleteItem,
  onCopyItem,
  onMoveItem,
  onCopyToDay,
  selectedDate,
  copyAgendasMap,
}: AgendaItemProps) => {
  const isEmptyItem: boolean = item.id === -1;

  const [isEditing, setIsEditing] = useState(isEmptyItem);
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const onToggleCheckbox = () => {
    let newState: PlannerItemStateDTO;

    if (item.state === 'todo') {
      newState = 'completed';
    } else {
      newState = 'todo';
    }

    onUpdateItem(item.id, { state: newState });
  };

  const onDropActionClick = () => {
    onUpdateItem(item.id, { state: 'dropped' });
  };

  const onDeleteActionClick = () => {
    onDeleteItem?.(item.id);
  };

  const handleCopyToAgenda = (toAgendaId: number | undefined) => {
    if (!toAgendaId) {
      return;
    }
    onCopyItem?.(item.id, toAgendaId);
  };

  const handleMoveToAgenda = (toAgendaId: number | undefined) => {
    if (!toAgendaId) {
      return;
    }
    onMoveItem?.(item.id, item.agenda_id, toAgendaId);
  };

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

  const canDrag: boolean = !isEmptyItem;
  const showCheckbox: boolean = !isEmptyItem;
  const showExtraActions: boolean = !isEmptyItem;

  const copyDates: Array<{ date: Date; label: string; key: string }> = [];
  if (selectedDate) {
    const today = new Date();
    const tomorrow = getNextDay(today);
    copyDates.push({
      date: today,
      label: formatDateForDisplay(today, true),
      key: 'today',
    });
    copyDates.push({
      date: tomorrow,
      label: formatDateForDisplay(tomorrow, true),
      key: 'tomorrow',
    });

    if (![today.toDateString(), tomorrow.toDateString()].includes(selectedDate.toDateString())) {
      copyDates.push({
        date: selectedDate,
        label: formatDateForDisplay(selectedDate, true),
        key: 'selected_date',
      });
    }

    const nextDate = getNextDay(selectedDate);
    if (![today.toDateString(), tomorrow.toDateString()].includes(nextDate.toDateString())) {
      copyDates.push({
        date: nextDate,
        label: formatDateForDisplay(nextDate, true),
        key: 'next_date',
      });
    }

    copyDates.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  const copyCustomAgendas = copyAgendasMap?.customAgendas.filter(
    (agenda) => agenda.id !== item.agenda_id,
  );

  return (
    <div
      className={`group flex items-center gap-2 min-h-[2.5rem] p-2
                     ${isDragging ? 'opacity-50' : 'opacity-100'}
                     transition-opacity duration-200 hover:bg-bg-hover rounded`}
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
          aria-checked={item.state === 'completed'}
          aria-label={item.state[0].toUpperCase() + item.state.slice(1)}
          title={item.state[0].toUpperCase() + item.state.slice(1)}
          role="checkbox"
        >
          {item.state === 'completed' && (
            <Icon name="checkboxCompleted" size={48} className="h-3 w-3 text-white" />
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
          placeholder={isEmptyItem ? 'Plan ahead for the month' : ''}
        />
      ) : (
        <div
          onClick={() => !isEmptyItem && setIsEditing(true)}
          className={`flex-1 px-1 cursor-text break-all
                           ${item.state === 'completed' ? 'line-through text-text-muted' : 'text-text-main'}`}
        >
          {item.text}
        </div>
      )}

      {showExtraActions && (
        <div className="flex-none relative opacity-100 md:opacity-0 md:group-hover:opacity-100 text-text-main p-1 bg-transparent transition-opacity">
          <Dropdown
            buttonIcon={<Icon name="copy" size={48} className="h-6 w-6" />}
            buttonTitle="Copy item"
            className="inline-flex ml-2"
            dropdownClassName="w-56 mt-8"
          >
            <div className="px-4 py-3 text-xs uppercase text-text-main">Copy to</div>
            <div>
              {copyDates.map((copyDate) => (
                <DropdownItem
                  key={copyDate.key}
                  onClick={() => onCopyToDay?.(copyDate.date, item.text)}
                >
                  {copyDate.label}
                </DropdownItem>
              ))}
            </div>
            <div className="border-t border-gray-200" />
            <div>
              {copyAgendasMap?.currentMonth.id !== item.agenda_id && (
                <DropdownItem
                  onClick={() => handleCopyToAgenda(copyAgendasMap?.currentMonth.id)}
                >
                  Current month ({copyAgendasMap?.currentMonth.name})
                </DropdownItem>
              )}
              {copyAgendasMap?.nextMonth.id !== item.agenda_id && (
                <DropdownItem
                  onClick={() => handleCopyToAgenda(copyAgendasMap?.nextMonth.id)}
                >
                  Next month ({copyAgendasMap?.nextMonth.name})
                </DropdownItem>
              )}
            </div>
            {copyCustomAgendas && copyCustomAgendas.length > 0 && (
              <div>
                {copyCustomAgendas.map((customAgenda) => (
                  <DropdownItem
                    key={customAgenda.id}
                    onClick={() => handleCopyToAgenda(customAgenda.id)}
                  >
                    {customAgenda.name}
                  </DropdownItem>
                ))}
              </div>
            )}
          </Dropdown>

          <Dropdown
            buttonIcon={<Icon name="move" size={48} className="h-6 w-6" />}
            buttonTitle="Move item"
            className="inline-flex ml-2"
            dropdownClassName="w-56 mt-8"
          >
            <div className="px-4 py-3 text-xs uppercase text-text-main">Move to</div>
              <div>
                {copyAgendasMap?.currentMonth.id !== item.agenda_id && (
                  <DropdownItem
                    onClick={() => handleMoveToAgenda(copyAgendasMap?.currentMonth.id)}
                  >
                    Current month ({copyAgendasMap?.currentMonth.name})
                  </DropdownItem>
                )}
                {copyAgendasMap?.nextMonth.id !== item.agenda_id && (
                  <DropdownItem
                    onClick={() => handleMoveToAgenda(copyAgendasMap?.nextMonth.id)}
                  >
                    Next month ({copyAgendasMap?.nextMonth.name})
                  </DropdownItem>
                )}
              </div>
              {copyCustomAgendas && copyCustomAgendas?.length > 0 && (
                <div>
                  {copyCustomAgendas.map((customAgenda) => (
                    <DropdownItem
                      key={customAgenda.id}
                      onClick={() => handleMoveToAgenda(customAgenda.id)}
                    >
                      {customAgenda.name}
                    </DropdownItem>
                  ))}
                </div>
              )}
          </Dropdown>

          <Dropdown
            buttonIcon={<Icon name="dots" size={20} className="h-6 w-6" />}
            buttonTitle="Extra actions"
            className="inline-flex ml-2"
            dropdownClassName="w-40 mt-8"
          >
            <DropdownItem
              onClick={onDropActionClick}
              title='Drop item'
            >
              <Icon name="drop" size={14} className="h-4 w-4 mr-2" /> Drop item
            </DropdownItem>
            <DropdownItem
              onClick={onDeleteActionClick}
              title='Delete item'
            >
              <Icon name="trash" size={14} className="h-4 w-4 mr-2" /> Delete item
            </DropdownItem>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default AgendaItem;
