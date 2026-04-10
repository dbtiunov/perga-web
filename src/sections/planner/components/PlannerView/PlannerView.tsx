import React from 'react';

import type { PlannerItemStateDTO, PlannerDayItemDTO } from '@api/planner';
import { getStartOfWeek } from '@common/utils/date_utils';
import PlannerDay from '@planner/components/PlannerDay/PlannerDay';
import { PLANNER_DAYS_COUNT } from '@planner/const';
import { PlannerViewMode} from '@planner/types';
import { UserDTO } from '@api/auth';


interface PlannerViewProps {
  viewMode: PlannerViewMode;
  selectedDate: Date;
  user: UserDTO | null;
  daysItems: PlannerDayItemDTO[];
  dragDayItem: PlannerDayItemDTO | null;
  handleDayItemDragStart: (item: PlannerDayItemDTO) => void;
  handleDayItemDragEnd: () => void;
  getItemsForDate: (date: Date) => PlannerDayItemDTO[];
  handleReorderDayItems: (items: PlannerDayItemDTO[]) => void;
  handleAddDayItem: (date: Date, itemText: string) => void;
  handleUpdateDayItem: (
    itemId: number,
    changes: { text?: string; day?: string; state?: PlannerItemStateDTO },
  ) => void;
  handleDeleteDayItem: (itemId: number) => void;
  handleCopyDayItem: (itemId: number, date: Date) => void;
  handleSnoozeDayItem: (itemId: number, date: Date) => void;
}

const PlannerView: React.FC<PlannerViewProps> = ({
  viewMode,
  selectedDate,
  user,
  daysItems,
  dragDayItem,
  handleDayItemDragStart,
  handleDayItemDragEnd,
  getItemsForDate,
  handleReorderDayItems,
  handleAddDayItem,
  handleUpdateDayItem,
  handleDeleteDayItem,
  handleCopyDayItem,
  handleSnoozeDayItem,
}) => {
  if (viewMode === 'weekly') {
    // Weekly View Mode
    const weekStartDay = user?.week_start_day || 'monday';
    const startDate = getStartOfWeek(selectedDate, weekStartDay);

    // weekly view has 6 cells (saturday and sunday in last cell) and always starts with monday
    const daysElements = [];
    for (let index = 0; index < 6; index++) {
      const plannerDay = new Date(startDate);
      plannerDay.setDate(startDate.getDate() + index);

      let cell: React.ReactNode;

      const isSaturday = plannerDay.getDay() === 6;
      if (isSaturday) {
        if (user?.merge_weekends) {
          // place saturday and sunday in single PlannerDay
          cell = (
            <PlannerDay
              key={plannerDay.toISOString()}
              date={plannerDay}
              daysItems={daysItems}
              dragDayItem={dragDayItem}
              onDragStartDayItem={handleDayItemDragStart}
              onDragEndDayItem={handleDayItemDragEnd}
              getItemsForDate={getItemsForDate}
              onReorderDayItems={handleReorderDayItems}
              onAddDayItem={handleAddDayItem}
              onUpdateDayItem={handleUpdateDayItem}
              onDeleteDayItem={handleDeleteDayItem}
              onCopyDayItem={handleCopyDayItem}
              onSnoozeDayItem={handleSnoozeDayItem}
              isMergedWeekend={true}
              extraClassName="min-h-[40vh]"
            />
          );
        } else {
          // place saturday and sunday in separate PlannerDays in one cell
          const sunday = new Date(plannerDay);
          sunday.setDate(plannerDay.getDate() + 1);

          cell = (
            <div key={plannerDay.toISOString() + '-column'} className="min-h-[45vh]">
              <PlannerDay
                date={plannerDay}
                daysItems={daysItems}
                dragDayItem={dragDayItem}
                onDragStartDayItem={handleDayItemDragStart}
                onDragEndDayItem={handleDayItemDragEnd}
                getItemsForDate={getItemsForDate}
                onReorderDayItems={handleReorderDayItems}
                onAddDayItem={handleAddDayItem}
                onUpdateDayItem={handleUpdateDayItem}
                onDeleteDayItem={handleDeleteDayItem}
                onCopyDayItem={handleCopyDayItem}
                onSnoozeDayItem={handleSnoozeDayItem}
              />
              <PlannerDay
                date={sunday}
                daysItems={daysItems}
                dragDayItem={dragDayItem}
                onDragStartDayItem={handleDayItemDragStart}
                onDragEndDayItem={handleDayItemDragEnd}
                getItemsForDate={getItemsForDate}
                onReorderDayItems={handleReorderDayItems}
                onAddDayItem={handleAddDayItem}
                onUpdateDayItem={handleUpdateDayItem}
                onDeleteDayItem={handleDeleteDayItem}
                onCopyDayItem={handleCopyDayItem}
                onSnoozeDayItem={handleSnoozeDayItem}
              />
            </div>
          );
        }
      } else {
        cell = (
          <PlannerDay
            key={plannerDay.toISOString()}
            date={plannerDay}
            daysItems={daysItems}
            dragDayItem={dragDayItem}
            onDragStartDayItem={handleDayItemDragStart}
            onDragEndDayItem={handleDayItemDragEnd}
            getItemsForDate={getItemsForDate}
            onReorderDayItems={handleReorderDayItems}
            onAddDayItem={handleAddDayItem}
            onUpdateDayItem={handleUpdateDayItem}
            onDeleteDayItem={handleDeleteDayItem}
            onCopyDayItem={handleCopyDayItem}
            onSnoozeDayItem={handleSnoozeDayItem}
            extraClassName="min-h-[45vh]"
          />
        );
      }

      daysElements.push(cell);
    }

    return <div className="grid grid-cols-3">{daysElements}</div>;
  }

  // Daily View Mode
  let days = Array.from({ length: PLANNER_DAYS_COUNT }, (_, index) => {
    const plannerDay = new Date(selectedDate);
    plannerDay.setDate(selectedDate.getDate() + index);
    return plannerDay;
  });
  if (user?.merge_weekends) {
    // exclude sundays from dates array
    days = days.filter(plannerDay => plannerDay.getDay() !== 0);
  }

  return (
    <>
      {days.map(plannerDay => {
        const isSaturday = plannerDay.getDay() === 6;
        const isMergedWeekend = user?.merge_weekends && isSaturday;

        return (
          <PlannerDay
            key={plannerDay.toISOString()}
            date={plannerDay}
            daysItems={daysItems}
            dragDayItem={dragDayItem}
            onDragStartDayItem={handleDayItemDragStart}
            onDragEndDayItem={handleDayItemDragEnd}
            getItemsForDate={getItemsForDate}
            onReorderDayItems={handleReorderDayItems}
            onAddDayItem={handleAddDayItem}
            onUpdateDayItem={handleUpdateDayItem}
            onDeleteDayItem={handleDeleteDayItem}
            onCopyDayItem={handleCopyDayItem}
            onSnoozeDayItem={handleSnoozeDayItem}
            isMergedWeekend={isMergedWeekend}
            extraClassName="min-h-[45vh]"
          />
        );
      })}
    </>
  );
};

export default PlannerView;
