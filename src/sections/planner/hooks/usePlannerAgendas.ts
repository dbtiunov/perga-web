import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@contexts/hooks/useToast';

import {
  PlannerAgenda,
  PlannerAgendaItem,
  getPlannerAgendasByDay,
  getItemsByAgendas,
  createPlannerAgendaItem,
  updatePlannerAgendaItem,
  deletePlannerAgendaItem,
  reorderPlannerAgendaItems,
} from '@api/planner_agendas';
import { REFRESH_EVENT } from '@common/events';
import { formatDate } from "@planner/utils/dateUtils.ts";

export const usePlannerAgendas = (selectedDate: Date) => {
  const [plannerAgendas, setPlannerAgendas] = useState<PlannerAgenda[]>([]);
  const [plannerAgendaItems, setPlannerAgendaItems] = useState<Record<number, PlannerAgendaItem[]>>({});

  const [dragAgendaItem, setDragAgendaItem] = useState<PlannerAgendaItem | null>(null);

  // Lock to prevent multiple updates for the same item
  const updatingItemsRef = useRef<Set<number>>(new Set());
  const { showError } = useToast();

  // Reorder management refs (per-agenda) for optimistic reorder + single commit
  const currentItemsOrder = useRef<Map<number, number[]>>(new Map());
  const updatedItemsOrder = useRef<Map<number, number[]>>(new Map());

  // Fetch planner agendas and their items
  const fetchAgendasWithItems = useCallback(async (date: Date) => {
    try {
      const response = await getPlannerAgendasByDay(formatDate(date));
      const agendas = response.data;
      setPlannerAgendas(agendas);

      if (agendas.length > 0) {
        const agendaIds = agendas.map(agenda => agenda.id);
        const itemsResponse = await getItemsByAgendas(agendaIds);
        setPlannerAgendaItems(itemsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching planner agendas:', error);
    }
  }, []);

  const handleAddAgendaItem = async (agendaId: number, text: string) => {
    if (!text.trim()) {
      return;
    }

    try {
      const response = await createPlannerAgendaItem({
        agenda_id: agendaId,
        text
      });
      setPlannerAgendaItems({
        ...plannerAgendaItems,
        [agendaId]: [...(plannerAgendaItems[agendaId] || []), response.data]
      });
    } catch (error) {
      console.error('Error adding planner agenda item:', error);
    }
  };

  const handleUpdateAgendaItem = async (itemId: number, agendaId: number, changes: { text?: string }) => {
    // prevent multiple execution for the same item
    if (updatingItemsRef.current.has(itemId)) {
      return;
    }
    updatingItemsRef.current.add(itemId);

    // use optimistic update for better ui interactivity
    const previousAgendaItems = plannerAgendaItems[agendaId];
    const previousState = { ...plannerAgendaItems };
    const previousItem = previousAgendaItems.find((item) => item.id === itemId);
    const optimisticItem = { ...previousItem, ...changes } as PlannerAgendaItem;
    setPlannerAgendaItems({
      ...plannerAgendaItems,
      [agendaId]: previousAgendaItems.map(item => (item.id === itemId ? optimisticItem : item))
    });

    try {
      const response = await updatePlannerAgendaItem(itemId, { agenda_id: agendaId, ...changes });
      setPlannerAgendaItems({
        ...plannerAgendaItems,
        [agendaId]: plannerAgendaItems[agendaId].map(item =>
          item.id === itemId ? response.data : item
        )
      });
    } catch (error) {
      console.error('Error updating planner agenda item:', error);
      setPlannerAgendaItems(previousState);  // restoring previous state
      showError('Failed to update item, please try again');
    } finally {
      updatingItemsRef.current.delete(itemId);
    }
  };

  const handleDeleteAgendaItem = async (itemId: number, agendaId: number) => {
    try {
      await deletePlannerAgendaItem(itemId);
      setPlannerAgendaItems({
        ...plannerAgendaItems,
        [agendaId]: plannerAgendaItems[agendaId].filter(item => item.id !== itemId)
      });
    } catch (error) {
      console.error('Error deleting planner agenda item:', error);
    }
  };

  const handleDragStartAgendaItem = (item: PlannerAgendaItem) => {
    setDragAgendaItem(item);
  };

  const handleDragEndAgendaItem = () => {
    if (!dragAgendaItem) {
      return;
    }

    setDragAgendaItem(null);
    void applyUpdatedItemsOrder(dragAgendaItem.agenda_id);
  };

  // Optimistic reorder that is called frequently during item drag
  // Update state without API request and save it to ref
  const handleReorderAgendaItems = (agendaId: number, items: PlannerAgendaItem[]) => {
    currentItemsOrder.current.set(agendaId, (plannerAgendaItems[agendaId] || []).map(item => item.id));
    setPlannerAgendaItems({
      ...plannerAgendaItems,
      [agendaId]: items,
    });
    updatedItemsOrder.current.set(agendaId, items.map(item => item.id));
  };

  const applyUpdatedItemsOrder = async (agendaId: number) => {
    const updatedOrder = updatedItemsOrder.current.get(agendaId);
    if (!updatedOrder) {
        return;
    }

    // Skip if items order hasn't changed
    const currentOrder = currentItemsOrder.current.get(agendaId);
    if (
        currentOrder
        && currentOrder.length === updatedOrder.length
        && currentOrder.every((id, index) => id === updatedOrder[index])
    ){
        return;
    }

    try {
      await reorderPlannerAgendaItems(agendaId, updatedOrder);
      currentItemsOrder.current.set(agendaId, updatedOrder);
    } catch (error) {
      console.error('Error reordering planner agenda items:', error);
      showError('Failed to save agenda order, restoring…');
      await fetchAgendasWithItems(selectedDate);
    }
  };

  const previousMonthRef = useRef(0);
  useEffect(() => {
    const currentMonth = selectedDate.getMonth();
    const previousMonth = previousMonthRef.current;

    // Do not refetch agendas, if month hasn't changed
    if (currentMonth === previousMonth) {
      return;
    }

    fetchAgendasWithItems(selectedDate);

    // Update the previous month ref
    previousMonthRef.current = currentMonth;
  }, [selectedDate, fetchAgendasWithItems]);

  // Refresh listener
  useEffect(() => {
    const handler = () => {
      void fetchAgendasWithItems(selectedDate);
    };
    window.addEventListener(REFRESH_EVENT, handler);
    return () => {
      window.removeEventListener(REFRESH_EVENT, handler);
    };
  }, [selectedDate, fetchAgendasWithItems]);

  return {
    plannerAgendas,
    plannerAgendaItems,
    dragAgendaItem,
    handleDragStartAgendaItem,
    handleDragEndAgendaItem,
    handleReorderAgendaItems,
    handleAddAgendaItem,
    handleUpdateAgendaItem,
    handleDeleteAgendaItem,
  };
};
