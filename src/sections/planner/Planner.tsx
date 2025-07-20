import { useSelectedDate } from '@planner/hooks/useSelectedDate.ts';
import { usePlannerDays } from '@planner/hooks/usePlannerDays.ts';
import { usePlannerAgendas } from '@planner/hooks/usePlannerAgendas.ts';
import { getNextDate } from '@planner/utils/dateUtils';
import PlannerDay from '@planner/components/PlannerDay/PlannerDay.tsx';
import PlannerAgendas from '@planner/components/PlannerAgendas/PlannerAgendas.tsx';

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
  } = usePlannerAgendas(selectedDate);

  const {
    daysItems,
    todayItems,
    setTodayItems,
    tomorrowItems,
    setTomorrowItems,
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
    <div className="flex flex-col md:flex-row w-full bg-white">
      <div className="w-full md:w-2/3 flex flex-col">
        <PlannerDay
          date={selectedDate}
          dayItems={daysItems}
          todayItems={todayItems}
          setTodayItems={setTodayItems}
          tomorrowItems={tomorrowItems}
          setTomorrowItems={setTomorrowItems}
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
          onDateChange={setSelectedDate}
        />
        <PlannerDay
          date={getNextDate(selectedDate)}
          dayItems={daysItems}
          todayItems={todayItems}
          setTodayItems={setTodayItems}
          tomorrowItems={tomorrowItems}
          setTomorrowItems={setTomorrowItems}
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

      <div className="w-full md:w-1/3 px-8 py-10 border-l-gray-600 border-l-0 md:border-l-1">
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
        />
      </div>
    </div>
  );
};

export default Planner;
