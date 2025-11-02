import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@contexts/hooks/useToast';

import { PlannerItemState } from '@api/planner_base';
import {
  PlannerDayItem,
  getItemsByDays,
  createPlannerDayItem,
  updatePlannerDayItem,
  deletePlannerDayItem,
  reorderPlannerDayItems,
  copyPlannerDayItem,
  snoozePlannerDayItem
} from '@api/planner_days';
import { REFRESH_EVENT } from '@common/events';
import { formatDate, getNextDay } from '@planner/utils/dateUtils';

export const usePlannerDays = (selectedDate: Date) => {
  const [daysItems, setDaysItems] = useState<PlannerDayItem[]>([]);
  const [dragDayItem, setDragDayItem] = useState<PlannerDayItem | null>(null);

  // Lock to prevent multiple updates for the same item
  const updatingItemsRef = useRef<Set<number>>(new Set());
  const { showError } = useToast();

  // Reorder management refs (for optimistic reorder + single API request)
  const currentItemsOrder = useRef<number[] | null>(null);
  const updatedItemsOrder = useRef<number[] | null>(null);

  // Fetch todos for selected date and next day
  const fetchDaysItems = useCallback(async () => {
    try {
      const nextDay = getNextDay(selectedDate);
      const selectedDateStr = formatDate(selectedDate);
      const nextDayStr = formatDate(nextDay);

      const response = await getItemsByDays([selectedDateStr, nextDayStr]);

      const combinedItems = [
        ...(response.data[selectedDateStr] || []),
        ...(response.data[nextDayStr] || [])
      ];

      setDaysItems(combinedItems);
    } catch (error) {
      console.error('Error fetching all days:', error);
    }
  }, [selectedDate]);


  const handleAddDayItem = async (date: Date, itemText: string) => {
    if (!itemText.trim()) {
      return;
    }

    try {
      const response = await createPlannerDayItem({
        text: itemText,
        day: formatDate(date)
      });
      setDaysItems([...daysItems, response.data]);
    } catch (error) {
      console.error('Error adding day item:', error);
    }
  };

  const handleDeleteDayItem = async (id: number) => {
    try {
      await deletePlannerDayItem(id);
      setDaysItems(daysItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting day item:', error);
    }
  };

  const handleUpdateDayItem = async (itemId: number, changes: { text?: string; day?: string, state?: PlannerItemState }) => {
    // prevent multiple execution for the same item and empty text
    if (updatingItemsRef.current.has(itemId) || !changes.text?.trim()) {
      return;
    }
    updatingItemsRef.current.add(itemId);

    // use optimistic update for better ui interactivity
    const prev = [...daysItems];
    const prevItem = prev.find((item) => item.id === itemId);
    const optimisticItem = { ...prevItem, ...changes } as PlannerDayItem;
    setDaysItems(
      daysItems.map((item) => item.id === itemId ? optimisticItem : item)
    );

    try {
      const response = await updatePlannerDayItem(itemId, changes);
      setDaysItems(
        daysItems.map((item) => item.id === itemId ? response.data : item)
      );
    } catch (error) {
      console.error('Error updating day item:', error);
      setDaysItems(prev);  // restoring previous state
      showError('Failed to update item, please try again');
    } finally {
      updatingItemsRef.current.delete(itemId);
    }
  };

  const handleCopyDayItem = async (itemId: number, day: Date) => {
    try {
      const response = await copyPlannerDayItem(itemId, formatDate(day));

      const nextDayStr = formatDate(getNextDay(selectedDate));
      if (response.data.day === nextDayStr) {
        setDaysItems([...daysItems, response.data]);
      }
    } catch (error) {
      console.error('Error copying day item:', error);
    }
  };

  const handleSnoozeDayItem = async (itemId: number, day: Date) => {
    try {
      const response = await snoozePlannerDayItem(itemId, formatDate(day));

      // Update the original item's state to 'snoozed'
      const updatedItems = daysItems.map(item =>
        item.id === itemId ? { ...item, state: 'snoozed' as PlannerItemState } : item
      );

      // Add the new item to the current state if its date is currently shown
      const selectedDateStr = formatDate(selectedDate);
      const nextDayStr = formatDate(getNextDay(selectedDate));

      if (response.data.day === selectedDateStr || response.data.day === nextDayStr) {
        setDaysItems([...updatedItems, response.data]);
      } else {
        setDaysItems(updatedItems);
      }
    } catch (error) {
      console.error('Error snoozing day item:', error);
    }
  };

  const handleDayItemDragStart = (item: PlannerDayItem) => {
    setDragDayItem(item);
  };

  const handleDayItemDragEnd = () => {
    if (!dragDayItem) {
      return;
    }

    setDragDayItem(null);
    void applyUpdatedItemsOrder();
  };

  // Optimistic reorder that is called frequently during item drag
  // Update state without API request and save it to ref
  const handleReorderDayItems = (items: PlannerDayItem[]) => {
    currentItemsOrder.current = daysItems.map(item => item.id);
    setDaysItems(items);
    updatedItemsOrder.current = items.map(item => item.id);
  };

  const applyUpdatedItemsOrder = async () => {
    const updatedOrder = updatedItemsOrder.current;
    if (!updatedOrder) {
      return;
    }

    // Skip if items order hasn't changed
    const currentOrder = currentItemsOrder.current;
    if (
        currentOrder
        && currentOrder.length === updatedOrder.length
        && currentOrder.every((id, index) => id === updatedOrder[index])
    ) {
      return;
    }

    try {
      await reorderPlannerDayItems(updatedOrder);
      currentItemsOrder.current = updatedOrder;
    } catch (error) {
      console.error('Error reordering items:', error);
      showError('Failed to save new order, restoring…');
      await fetchDaysItems();
    }
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return daysItems.filter(item => item.day === dateStr);
  };

  // Fetch items when selected date changes
  useEffect(() => {
    void fetchDaysItems();
  }, [selectedDate, fetchDaysItems]);

  // Refresh listener
  useEffect(() => {
    const handler = () => {
      void fetchDaysItems();
    };
    window.addEventListener(REFRESH_EVENT, handler);
    return () => {
      window.removeEventListener(REFRESH_EVENT, handler);
    };
  }, [fetchDaysItems]);

  return {
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
  };
};
