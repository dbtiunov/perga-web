import { TwoPaneLayout } from '@common/components/TwoPaneLayout';
import { StorageKeys } from '@common/utils/storage_keys';
import PlannerAgendas from '@planner/components/PlannerAgendas/PlannerAgendas';
import PlannerDay from '@planner/components/PlannerDay/PlannerDay';
import PlannerDateSelector from '@planner/components/PlannerDateSelector/PlannerDateSelector';
import { PLANNER_DAYS_COUNT } from '@planner/const.ts';
import { usePlannerAgendas } from '@planner/hooks/usePlannerAgendas';
import { usePlannerDays } from '@planner/hooks/usePlannerDays';
import { useSelectedDate } from '@planner/hooks/useSelectedDate';

const DEFAULT_LEFT_PANE_WIDTH_PERCENT = 66.6667; // w-2/3
const MIN_LEFT_PANE_WIDTH_PERCENT = 30;
const MAX_LEFT_PANE_WIDTH_PERCENT = 70;

const Planner = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate();

  const {
    plannerAgendas,
    plannerAgendaItems,
    dragAgendaItem,
    handleDragStartAgendaItem,
    handleDragEndAgendaItem,
    handleReorderAgendaItems,
    handleAddAgendaItem,
    handleUpdateAgendaItem,
    handleDeleteAgendaItem,
    handleCopyAgendaItem,
    handleMoveAgendaItem,
    copyAgendasMap,
    fetchAgendaItems,
  } = usePlannerAgendas(selectedDate);

  const {
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
  } = usePlannerDays(selectedDate);

  return (
    <TwoPaneLayout
      storageKey={StorageKeys.PlannerLeftPaneWidth}
      defaultLeftWidthPercent={DEFAULT_LEFT_PANE_WIDTH_PERCENT}
      minLeftWidthPercent={MIN_LEFT_PANE_WIDTH_PERCENT}
      maxLeftWidthPercent={MAX_LEFT_PANE_WIDTH_PERCENT}
      leftPane={
        <>
          <PlannerDateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

          {Array.from({ length: PLANNER_DAYS_COUNT }).map((_, index) => {
            const plannerDate = new Date(selectedDate);
            plannerDate.setDate(selectedDate.getDate() + index);

            return (
              <PlannerDay
                key={plannerDate.toISOString()}
                date={plannerDate}
                dayItems={daysItems}
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
            );
          })}
        </>
      }
      rightPane={
        <PlannerAgendas
          plannerAgendas={plannerAgendas}
          plannerAgendaItems={plannerAgendaItems}
          dragAgendaItem={dragAgendaItem}
          onDragStartAgendaItem={handleDragStartAgendaItem}
          onDragEndAgendaItem={handleDragEndAgendaItem}
          onReorderAgendaItems={handleReorderAgendaItems}
          onAddAgendaItem={handleAddAgendaItem}
          onUpdateAgendaItem={handleUpdateAgendaItem}
          onDeleteAgendaItem={handleDeleteAgendaItem}
          onCopyAgendaItem={handleCopyAgendaItem}
          onMoveAgendaItem={handleMoveAgendaItem}
          onCopyAgendaItemToDay={(date: Date, text: string) => handleAddDayItem(date, text)}
          selectedDate={selectedDate}
          copyAgendasMap={copyAgendasMap}
          fetchAgendaItems={fetchAgendaItems}
        />
      }
    />
  );
};

export default Planner;
