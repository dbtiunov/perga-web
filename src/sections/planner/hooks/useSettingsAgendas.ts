import { useState, useEffect, useCallback, useRef } from 'react';

import {
  PlannerAgenda,
  PlannerAgendaUpdate,
  getPlannerAgendas,
  createPlannerAgenda,
  updatePlannerAgenda,
  deletePlannerAgenda,
  reorderPlannerAgendas,
} from '@api/planner_agendas';
import { REFRESH_EVENT } from '@common/events';
import { useToast } from '@contexts/hooks/useToast';

export const useSettingsAgendas = () => {
  const [settingsAgendas, setSettingsAgendas] = useState<PlannerAgenda[]>([]);

  const updatingItemsRef = useRef<Set<number>>(new Set());
  const { showError } = useToast();

  const fetchSettingsAgendas = useCallback(async () => {
    try {
      const response = await getPlannerAgendas(['custom']);
      const agendas = response.data;
      setSettingsAgendas(agendas);
    } catch (error) {
      console.error('Error fetching planner agendas:', error);
    }
  }, []);

  const handleCreateAgenda = async (name: string) => {
    if (!name) {
      return;
    }

    try {
      const response = await createPlannerAgenda({
        name,
        agenda_type: 'custom'
      });
      const newAgenda = response.data;
      setSettingsAgendas(prev => [...prev, newAgenda]);
    } catch (error) {
      console.error('Error creating planner agenda:', error);
      showError('Failed to create agenda');
    }
  };

  const handleUpdateAgenda = async (agendaId: number, changes: PlannerAgendaUpdate) => {
    // prevent multiple execution for the same item and empty name
    if (updatingItemsRef.current.has(agendaId) || !changes.name?.trim()) {
      return;
    }
    updatingItemsRef.current.add(agendaId);

   // use optimistic update for better ui interactivity
    const previousAgendas = settingsAgendas;
    const prevAgenda = previousAgendas.find((agenda) => agenda.id === agendaId);
    const optimisticAgenda = { ...prevAgenda, ...changes } as PlannerAgenda;
    setSettingsAgendas(settingsAgendas.map(agenda => agenda.id === agendaId ? optimisticAgenda : agenda));

    try {
      const response = await updatePlannerAgenda(agendaId, changes);
      const updated = response.data;
      setSettingsAgendas(prev => prev.map(
        agenda => (agenda.id === agendaId ? updated : agenda))
      );
      return updated;
    } catch (error) {
      console.error('Error updating planner agenda:', error);
      setSettingsAgendas(previousAgendas);
      showError('Failed to update agenda');
    } finally {
      updatingItemsRef.current.delete(agendaId);
    }
  };

  const handleDeleteAgenda = async (agendaId: number) => {
    const prevAgendas = [...settingsAgendas];
    setSettingsAgendas(prev => prev.filter(agenda => agenda.id !== agendaId));
    try {
      await deletePlannerAgenda(agendaId);
    } catch (error) {
      console.error('Error deleting planner agenda:', error);
      showError('Failed to delete agenda');
      // rollback
      setSettingsAgendas(prevAgendas);
    }
  };

  useEffect(() => {
    void fetchSettingsAgendas();
  }, [fetchSettingsAgendas]);

  // Refresh listener
  useEffect(() => {
    const handler = () => {
      void fetchSettingsAgendas();
    };
    window.addEventListener(REFRESH_EVENT, handler);
    return () => {
      window.removeEventListener(REFRESH_EVENT, handler);
    };
  }, [fetchSettingsAgendas]);

  const handleReorderAgendas = async (agendas: PlannerAgenda[]) => {
    const prev = [...settingsAgendas];
    setSettingsAgendas(agendas);
    try {
      await reorderPlannerAgendas(agendas.map(a => a.id));
    } catch (error) {
      console.error('Error reordering agendas:', error);
      showError('Failed to save new order, restoring…');
      setSettingsAgendas(prev);
    }
  };

  return {
    settingsAgendas,
    handleCreateAgenda,
    handleUpdateAgenda,
    handleDeleteAgenda,
    handleReorderAgendas,
  };
};
