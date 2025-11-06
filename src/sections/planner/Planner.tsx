import { useEffect, useMemo, useRef, useState } from 'react';
import PlannerAgendas from '@planner/components/PlannerAgendas/PlannerAgendas.tsx';
import PlannerDay from '@planner/components/PlannerDay/PlannerDay.tsx';
import { PlannerLocalStorage } from "@planner/const.ts";
import { usePlannerAgendas } from '@planner/hooks/usePlannerAgendas.ts';
import { usePlannerDays } from '@planner/hooks/usePlannerDays.ts';
import { useSelectedDate } from '@planner/hooks/useSelectedDate.ts';
import { getNextDay } from '@planner/utils/dateUtils';

const DEFAULT_LEFT_PANE_WIDTH_PERCENT = 66.6667; // w-2/3
const MIN_LEFT_PANE_WIDTH_PERCENT = 30;
const MAX_LEFT_PANE_WIDTH_PERCENT = 70;
const RESIZE_HANDLE_WIDTH_PX = 6;

const Planner = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate();

  const { plannerAgendas } = usePlannerAgendas(selectedDate);

  const {
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

  // Resizable split state
  const plannerContainerRef = useRef<HTMLDivElement | null>(null);
  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LEFT_PANE_WIDTH_PERCENT;
    }

    const savedWidthRaw = window.localStorage.getItem(PlannerLocalStorage.LeftPaneWidthKey);
    const savedWidthParsed = savedWidthRaw ? parseFloat(savedWidthRaw) : NaN;
    if (isNaN(savedWidthParsed)) {
      return DEFAULT_LEFT_PANE_WIDTH_PERCENT;
    }

    return Math.min(MAX_LEFT_PANE_WIDTH_PERCENT, Math.max(MIN_LEFT_PANE_WIDTH_PERCENT, savedWidthParsed));
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (clientX: number) => {
    const container = plannerContainerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const available = rect.width - RESIZE_HANDLE_WIDTH_PX;
    const xWithin = Math.min(Math.max(clientX - rect.left, 0), available);
    const percent = (xWithin / available) * 100;
    const clamped = Math.min(MAX_LEFT_PANE_WIDTH_PERCENT, Math.max(MIN_LEFT_PANE_WIDTH_PERCENT, percent));
    setLeftPaneWidthPercent(clamped);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !isDragging) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => handleMouseMove(e.clientX);
    const onMouseUp = () => {
      setIsDragging(false);

      try {
        window.localStorage.setItem(PlannerLocalStorage.LeftPaneWidthKey, String(leftPaneWidthPercent));
      } catch {
        /* ignore if localStorage is unavailable */
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);
    };
  }, [isDragging, leftPaneWidthPercent]);

  // Touch support
  useEffect(() => {
    if (typeof window === 'undefined' || !isDragging) {
      return;
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMouseMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      setIsDragging(false);

      try {
        window.localStorage.setItem(PlannerLocalStorage.LeftPaneWidthKey, String(leftPaneWidthPercent));
      } catch {
        /* ignore if localStorage is unavailable */
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDragging, leftPaneWidthPercent]);

  const leftPaneStyle = useMemo(
    () => ({width: `${leftPaneWidthPercent}%` }),[leftPaneWidthPercent]
  );

  return (
    <div ref={plannerContainerRef} className="h-screen flex flex-col md:flex-row w-full bg-white overflow-hidden">
      {/* Left pane (days) */}
      <div className="w-full md:flex-none md:overflow-auto md:min-h-0 flex flex-col" style={leftPaneStyle}>
        <PlannerDay date={selectedDate}
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
                    onDateChange={setSelectedDate} />
        <PlannerDay date={getNextDay(selectedDate)}
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
                    onSnoozeDayItem={handleSnoozeDayItem} />
      </div>

      {/* Separator with resize handle */}
      <div role="separator" aria-orientation="vertical" aria-label="Resize planner panes"
           className="hidden md:block md:shrink-0 md:cursor-col-resize md:bg-transparent"
           style={{ width: RESIZE_HANDLE_WIDTH_PX, touchAction: 'none' }}
           onMouseDown={() => setIsDragging(true)}
           onTouchStart={() => setIsDragging(true)}>
        <div className="h-full w-px mx-auto bg-gray-600" />
      </div>

      {/* Right pane (agendas) */}
      <div className="w-full md:flex-1 md:overflow-auto md:min-h-0 px-8 py-10">
        <PlannerAgendas plannerAgendas={plannerAgendas}
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
                        onCopyAgendaItemToToday={(text) => handleAddDayItem(selectedDate, text)}
                        onCopyAgendaItemToTomorrow={(text) => handleAddDayItem(getNextDay(selectedDate), text)}
                        copyAgendasMap={copyAgendasMap} />
      </div>
    </div>
  );
};

export default Planner;
