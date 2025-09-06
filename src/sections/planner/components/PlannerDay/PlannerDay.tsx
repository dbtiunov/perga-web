import React from 'react';

import { PlannerDayItem } from '@api/planner_days';
import DayItem from '@planner/components/PlannerDay/DayItem/DayItem.tsx';
import DateSelector from '@planner/components/DateSelector/DateSelector.tsx';
import { formatDateForDisplay } from '@planner/utils/dateUtils.ts';

interface PlannerDayProps {
  date: Date;
  dayItems: PlannerDayItem[];
  dragDayItem: PlannerDayItem | null;
  onDragStartDayItem: (item: PlannerDayItem) => void;
  onDragEndDayItem: () => void;
  getItemsForDate: (date: Date) => PlannerDayItem[];
  onReorderDayItems: (items: PlannerDayItem[]) => void;
  onAddDayItem: (date: Date, itemText: string) => void;
  onUpdateDayItem: (itemId: number, changes: { text?: string; day?: string }) => void;
  onDeleteDayItem: (itemId: number) => void;
  onCopyDayItem: (itemId: number, date: Date) => void;
  onSnoozeDayItem: (itemId: number, date: Date) => void;
  onDateChange?: (date: Date) => void;
}

const PlannerDay: React.FC<PlannerDayProps> = ({
  date,
  dayItems,
  dragDayItem,
  onDragStartDayItem,
  onDragEndDayItem,
  getItemsForDate,
  onReorderDayItems,
  onAddDayItem,
  onUpdateDayItem,
  onDeleteDayItem,
  onCopyDayItem,
  onSnoozeDayItem,
  onDateChange,
}) => {
  const emptyDayItem: PlannerDayItem = {
    id: -1,
    day: date.toISOString().split('T')[0],
    text: '',
    state: 'todo',
    index: -1
  };

  const handleEmptyItemEdit = (_itemId: number, changes: { text?: string }) => {
    if (changes.text && changes.text.trim()) {
      onAddDayItem(date, changes.text);
    }
  };

  return (
    <div className='px-8 py-10 flex-none basis-1/3 relative'>
      <div className="flex justify-between items-center mb-4 border-b-1 border-gray-600">
        <h3 className='text-lg font-semibold text-gray-600'>{formatDateForDisplay(date)}</h3>
        {onDateChange && <DateSelector selectedDate={date} onDateChange={onDateChange} />}
      </div>

      <div className="space-y-0">
        {getItemsForDate(date).map((item: PlannerDayItem, index: number) => (
          <div key={item.id}
               onDragOver={(e) => {
                 e.preventDefault();
                 const draggingItemIndex = dayItems.findIndex(t => t.id === dragDayItem?.id);
                 if (draggingItemIndex === index) {
                   return;
                 }

                 const newDayItems = [...dayItems];
                 const [removed] = newDayItems.splice(draggingItemIndex, 1);
                 newDayItems.splice(index, 0, removed);
                 onReorderDayItems(newDayItems);
               }}>
            <DayItem item={item}
                     onUpdateItem={onUpdateDayItem}
                     onDeleteItem={onDeleteDayItem}
                     onCopyItem={onCopyDayItem}
                     onSnoozeItem={onSnoozeDayItem}
                     onDragStartItem={() => onDragStartDayItem(item)}
                     onDragEndItem={() => {
                       onDragEndDayItem();
                       onReorderDayItems(dayItems);
                     }} />
          </div>
        ))}

        <DayItem item={emptyDayItem} onUpdateItem={handleEmptyItemEdit} />
      </div>
    </div>
  );
};

export default PlannerDay;
