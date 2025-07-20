import { useState, useEffect, useCallback, useRef } from 'react';

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
import { formatDate } from "@planner/utils/dateUtils.ts";

export const usePlannerAgendas = (selectedDate: Date) => {
  const [plannerAgendas, setPlannerAgendas] = useState<PlannerAgenda[]>([]);
  const [plannerAgendaItems, setPlannerAgendaItems] = useState<Record<number, PlannerAgendaItem[]>>({});

  const [dragAgendaItem, setDragAgendaItem] = useState<PlannerAgendaItem | null>(null);

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
    fetchAgendasWithItems(selectedDate);
    setDragAgendaItem(null);
  };

  const handleReorderAgendaItems = async (agendaId: number, items: PlannerAgendaItem[]) => {
    const orderedItemIds = items.map(item => item.id);

    try {
      await reorderPlannerAgendaItems(agendaId, orderedItemIds);
      setPlannerAgendaItems({
        ...plannerAgendaItems,
        [agendaId]: items
      });
    } catch (error) {
      console.error('Error reordering planner agenda items:', error);
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
