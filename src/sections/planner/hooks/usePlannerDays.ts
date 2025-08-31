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
import { formatDate, getNextDate } from '../utils/dateUtils';

export const usePlannerDays = (selectedDate: Date) => {
  const [daysItems, setDaysItems] = useState<PlannerDayItem[]>([]);
  const [todayItems, setTodayItems] = useState('');
  const [tomorrowItems, setTomorrowItems] = useState('');
  const [dragDayItem, setDragDayItem] = useState<PlannerDayItem | null>(null);

  // Lock to prevent multiple updates for the same item
  const updatingItemsRef = useRef<Set<number>>(new Set());
  const { showError } = useToast();

  // Fetch todos for today and tomorrow
  const fetchDaysItems = useCallback(async () => {
    try {
      const nextDate = getNextDate(selectedDate);
      const selectedDateStr = formatDate(selectedDate);
      const nextDateStr = formatDate(nextDate);

      const response = await getItemsByDays([selectedDateStr, nextDateStr]);

      const combinedItems = [
        ...(response.data[selectedDateStr] || []),
        ...(response.data[nextDateStr] || [])
      ];

      setDaysItems(combinedItems);
    } catch (error) {
      console.error('Error fetching all days:', error);
    }
  }, [selectedDate]);


  const handleAddDayItem = async (date: Date, itemText: string, setItemText: React.Dispatch<React.SetStateAction<string>>) => {
    if (!itemText.trim()) {
      return;
    }

    try {
      const response = await createPlannerDayItem({
        text: itemText,
        day: formatDate(date)
      });
      setDaysItems([...daysItems, response.data]);
      setItemText('');
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
    // prevent multiple execution for the same item
    if (updatingItemsRef.current.has(itemId)) {
      return;
    }
    updatingItemsRef.current.add(itemId);

    // use optimistic update for better ui interactivity
    const previousItems = daysItems;
    const prevItem = previousItems.find((item) => item.id === itemId);
    const optimisticItem = { ...prevItem, ...changes } as PlannerDayItem;
    setDaysItems(daysItems.map(item => item.id === itemId ? optimisticItem : item));

    try {
      const response = await updatePlannerDayItem(itemId, changes);
      setDaysItems(daysItems.map(item => item.id === itemId ? response.data : item));
    } catch (error) {
      console.error('Error updating day item:', error);
      setDaysItems(previousItems);  // restoring previous state
      showError('Failed to update item, please try again');
    } finally {
      updatingItemsRef.current.delete(itemId);
    }
  };

  const handleCopyDayItem = async (itemId: number, day: Date) => {
    try {
      const response = await copyPlannerDayItem(itemId, formatDate(day));

      const tomorrowDateStr = formatDate(getNextDate(selectedDate));
      if (response.data.day === tomorrowDateStr) {
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
        const todayDateStr = formatDate(selectedDate);
        const tomorrowDateStr = formatDate(getNextDate(selectedDate));

        if (response.data.day === todayDateStr || response.data.day === tomorrowDateStr) {
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
    fetchDaysItems();
    setDragDayItem(null);
  };

  const handleReorderDayItems = async (items: PlannerDayItem[]) => {
    const orderedItemIds: number[] = [];
    items.forEach((item) => {
      orderedItemIds.push(item.id);
    });

    try {
      await reorderPlannerDayItems(orderedItemIds);
      setDaysItems(items);
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return daysItems.filter(item => item.day === dateStr);
  };

  // Fetch items when selected date changes
  useEffect(() => {
    fetchDaysItems();
  }, [selectedDate, fetchDaysItems]);

  return {
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
  };
};
