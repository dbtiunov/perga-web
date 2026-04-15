import React from 'react';

import type { PlannerItemStateDTO, PlannerDayItemDTO } from '@api/planner';
import { formatDateForDisplay, getNextDay } from '@common/utils/date_utils';
import DayItem from '@planner/components/PlannerDay/PlannerDayItem/PlannerDayItem';

interface PlannerDayProps {
  date: Date;
  daysItems: PlannerDayItemDTO[];
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
  useCompactActions?: boolean;
  isMergedWeekend?: boolean;
  extraClassName?: string;
}

const PlannerDay: React.FC<PlannerDayProps> = ({
  date,
  daysItems,
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
  useCompactActions,
  isMergedWeekend,
  extraClassName = '',
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
    <div className={`p-8 relative ${extraClassName}`}>
      <div className="flex justify-between items-center mb-4">
        <h3>
          {formatDateForDisplay(date, true)}
          {isMergedWeekend && ` & ${formatDateForDisplay(getNextDay(date), true)}`}
        </h3>
      </div>

      <div className="space-y-0">
        {getItemsForDate(date).map((item: PlannerDayItemDTO, index: number) => (
          <div
            key={item.id}
            onDragOver={(e) => {
              e.preventDefault();
              const draggingItemIndex = daysItems.findIndex((t) => t.id === dragDayItem?.id);
              if (draggingItemIndex === index) {
                return;
              }

              const newDayItems = [...daysItems];
              const [removed] = newDayItems.splice(draggingItemIndex, 1);
              newDayItems.splice(index, 0, removed);
              onReorderDayItems(newDayItems);
            }}
          >
            <DayItem
              item={item}
              onDragStartItem={() => onDragStartDayItem(item)}
              onDragEndItem={() => {
                onDragEndDayItem();
                onReorderDayItems(daysItems);
              }}
              onUpdateItem={onUpdateDayItem}
              onDeleteItem={onDeleteDayItem}
              onCopyItem={onCopyDayItem}
              onSnoozeItem={onSnoozeDayItem}
              useCompactActions={useCompactActions}
            />
          </div>
        ))}

        <DayItem
          item={emptyDayItem}
          onUpdateItem={handleEmptyItemEdit}
          useCompactActions={useCompactActions}
        />
      </div>
    </div>
  );
};

export default PlannerDay;
