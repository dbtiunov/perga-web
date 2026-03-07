import React from 'react';

import type { PlannerItemStateDTO, PlannerDayItemDTO } from '@api/planner';
import { formatDateForDisplay } from '@common/utils/date_utils';
import DayItem from '@planner/components/PlannerDay/PlannerDayItem/PlannerDayItem';

interface PlannerDayProps {
  date: Date;
  dayItems: PlannerDayItemDTO[];
  dragDayItem: PlannerDayItemDTO | null;
  onDragStartDayItem: (item: PlannerDayItemDTO) => void;
  onDragEndDayItem: () => void;
  getItemsForDate: (date: Date) => PlannerDayItemDTO[];
  onReorderDayItems: (items: PlannerDayItemDTO[]) => void;
  onAddDayItem: (date: Date, itemText: string) => void;
  onUpdateDayItem: (
    itemId: number,
    changes: { text?: string; day?: string; state?: PlannerItemStateDTO },
  ) => void;
  onDeleteDayItem: (itemId: number) => void;
  onCopyDayItem: (itemId: number, date: Date) => void;
  onSnoozeDayItem: (itemId: number, date: Date) => void;
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
}) => {
  const emptyDayItem: PlannerDayItemDTO = {
    id: -1,
    day: date.toISOString().split('T')[0],
    text: '',
    state: 'todo',
    index: -1,
  };

  const handleEmptyItemEdit = (_itemId: number, changes: { text?: string }) => {
    if (changes.text?.trim()) {
      onAddDayItem(date, changes.text);
    }
  };

  return (
    <div className="p-8 flex-none basis-1/3 relative">
      <div className="flex justify-between items-center mb-4">
        <h3>{formatDateForDisplay(date, true)}</h3>
      </div>

      <div className="space-y-0">
        {getItemsForDate(date).map((item: PlannerDayItemDTO, index: number) => (
          <div
            key={item.id}
            onDragOver={(e) => {
              e.preventDefault();
              const draggingItemIndex = dayItems.findIndex((t) => t.id === dragDayItem?.id);
              if (draggingItemIndex === index) {
                return;
              }

              const newDayItems = [...dayItems];
              const [removed] = newDayItems.splice(draggingItemIndex, 1);
              newDayItems.splice(index, 0, removed);
              onReorderDayItems(newDayItems);
            }}
          >
            <DayItem
              item={item}
              onUpdateItem={onUpdateDayItem}
              onDeleteItem={onDeleteDayItem}
              onCopyItem={onCopyDayItem}
              onSnoozeItem={onSnoozeDayItem}
              onDragStartItem={() => onDragStartDayItem(item)}
              onDragEndItem={() => {
                onDragEndDayItem();
                onReorderDayItems(dayItems);
              }}
            />
          </div>
        ))}

        <DayItem item={emptyDayItem} onUpdateItem={handleEmptyItemEdit} />
      </div>
    </div>
  );
};

export default PlannerDay;
