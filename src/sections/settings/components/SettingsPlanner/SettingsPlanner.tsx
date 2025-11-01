import React, { useEffect, useRef, useState } from 'react';

import { type PlannerAgenda } from '@api/planner_agendas.ts';
import { useSettingsAgendas } from "@planner/hooks/useSettingsAgendas.ts";
import AgendaLine from '@settings/components/SettingsPlanner/AgendaLine/AgendaLine.tsx';

const SettingsPlanner: React.FC = () => {
  const {
    settingsAgendas,
    handleCreateAgenda,
    handleUpdateAgenda,
    handleDeleteAgenda,
    handleReorderAgendas,
  } = useSettingsAgendas();

  const emptyAgendaLine: PlannerAgenda = {
    id: -1,
    name: '',
    agenda_type: 'custom',
    index: -1,
    todo_items_cnt: 0,
    completed_items_cnt: 0,
  }

  const handleEmptyAgendaLineEdit = (_agendaId: number, changes: { name?: string }) => {
    if (changes.name?.trim()) {
      void handleCreateAgenda(changes.name);
    }
  };

  const confirmAndDelete = (agendaId: number) => {
    if (window.confirm('Delete this agenda? This cannot be undone.')) {
      void handleDeleteAgenda(agendaId);
    }
  };

  // Local view state for optimistic drag-and-drop reorder without spamming API
  const [agendasView, setAgendasView] = useState<PlannerAgenda[]>(settingsAgendas);
  const draggingAgendaRef = useRef<PlannerAgenda | null>(null);
  const initialOrderRef = useRef<number[] | null>(null);

  // Keep local view in sync with server when not dragging
  useEffect(() => {
    if (!draggingAgendaRef.current) {
      setAgendasView(settingsAgendas);
      initialOrderRef.current = settingsAgendas.map(a => a.id);
    }
  }, [settingsAgendas]);

  const handleDragStart = (agenda: PlannerAgenda) => {
    draggingAgendaRef.current = agenda;
    initialOrderRef.current = agendasView.map(a => a.id);
  };

  const handleDragOverAgenda = (target: PlannerAgenda) => {
    const dragging = draggingAgendaRef.current;
    if (!dragging || dragging.id === target.id) return;

    setAgendasView(prev => {
      const current = [...prev];
      const fromIndex = current.findIndex(a => a.id === dragging.id);
      const toIndex = current.findIndex(a => a.id === target.id);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;
      const updated = [...current];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleDragEnd = () => {
    const updatedOrder = agendasView.map(a => a.id);
    const initialOrder = initialOrderRef.current;
    draggingAgendaRef.current = null;

    if (
      initialOrder &&
      (initialOrder.length !== updatedOrder.length ||
        !initialOrder.every((id, idx) => id === updatedOrder[idx]))
    ) {
      void handleReorderAgendas(agendasView);
    } else {
      // ensure we reflect latest server order
      setAgendasView(settingsAgendas);
    }
  };

  return (
    <div className="px-0 md:px-6 mb-4 w-full md:max-w-2/5">
      <fieldset className="border border-gray-400 rounded-md p-8 mb-6">
        <legend className="px-2 text-gray-600">Agendas</legend>

        <p className="text-sm text-gray-500 mb-4">
          Create and manage custom agendas to organize your tasks. A Monthly agenda is created automatically for each
          month. Below is a list of your custom agendas showing how many items each contains.
        </p>

        <div className="space-y-1">
          {agendasView.map((agenda: PlannerAgenda) => (
            <div key={agenda.id}>
              <AgendaLine agenda={agenda}
                          onUpdateAgenda={handleUpdateAgenda}
                          onDeleteAgenda={confirmAndDelete}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onDragOverAgenda={handleDragOverAgenda} />
            </div>
          ))}

          <AgendaLine agenda={emptyAgendaLine} onUpdateAgenda={handleEmptyAgendaLineEdit} />
        </div>
      </fieldset>
    </div>
  );
};

export default SettingsPlanner;
