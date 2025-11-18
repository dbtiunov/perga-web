import React, { useEffect, useRef, useState } from 'react';

import { type PlannerAgenda } from '@api/planner_agendas.ts';
import { Icon } from '@common/Icon.tsx';
import { useSettingsAgendas } from '@planner/hooks/useSettingsAgendas.ts';
import AgendaLine from '@settings/components/SettingsPlanner/AgendaLine/AgendaLine.tsx';

const SettingsPlanner: React.FC = () => {
  const {
    settingsAgendas,
    handleCreateAgenda,
    handleUpdateAgenda,
    handleDeleteAgenda,
    handleReorderAgendas,
  } = useSettingsAgendas();

  const [showArchived, setShowArchived] = useState(false);

  const emptyAgendaLine: PlannerAgenda = {
    id: -1,
    name: '',
    agenda_type: 'custom',
    index: -1,
    todo_items_cnt: 0,
    completed_items_cnt: 0,
  };

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
      initialOrderRef.current = settingsAgendas.map((agenda) => agenda.id);
    }
  }, [settingsAgendas]);

  const handleDragStart = (agenda: PlannerAgenda) => {
    draggingAgendaRef.current = agenda;
    initialOrderRef.current = agendasView.map((agenda) => agenda.id);
  };

  const handleDragOverAgenda = (target: PlannerAgenda) => {
    const dragging = draggingAgendaRef.current;
    if (!dragging || dragging.id === target.id) {
      return;
    }

    setAgendasView((prev) => {
      const current = [...prev];
      const fromIndex = current.findIndex((agenda) => agenda.id === dragging.id);
      const toIndex = current.findIndex((agenda) => agenda.id === target.id);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return prev;
      }

      const updated = [...current];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleDragEnd = () => {
    const updatedOrder = agendasView.map((agenda) => agenda.id);
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
    <div className="w-full md:max-w-2/5">
      <fieldset className="border border-gray-400 rounded p-8">
        <legend className="px-2 text-text-main">Agendas</legend>

        <p className="text-sm text-text-main mb-10">
          Create and manage custom agendas to organize your tasks. A&nbsp;monthly agenda is created
          automatically for each month.
        </p>

        <div className="flex items-center justify-end mb-3">
          <button
            type="button"
            onClick={() => setShowArchived((prev) => !prev)}
            className="text-sm text-text-main hover:underline focus:outline-none focus-visible:ring-2
                           focus-visible:ring-gray-400"
          >
            <span className="inline-flex items-center gap-1">
              <Icon name="filter" size={16} className="h-4 w-4" />
              <span className="grid">
                <span
                  className={`col-start-1 row-start-1 ${showArchived ? 'opacity-0' : 'opacity-100'}`}
                  aria-hidden={showArchived}
                >
                  Show archived
                </span>
                <span
                  className={`col-start-1 row-start-1 ${showArchived ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden={!showArchived}
                >
                  Hide archived
                </span>
              </span>
            </span>
          </button>
        </div>

        <div className="space-y-1">
          {agendasView
            .filter((agenda) => agenda.agenda_type === 'custom')
            .map((agenda: PlannerAgenda) => (
              <div key={agenda.id}>
                <AgendaLine
                  agenda={agenda}
                  onUpdateAgenda={handleUpdateAgenda}
                  onDeleteAgenda={confirmAndDelete}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOverAgenda={handleDragOverAgenda}
                />
              </div>
            ))}
          {showArchived &&
            agendasView
              .filter((agenda) => agenda.agenda_type === 'archived')
              .map((agenda: PlannerAgenda) => (
                <div key={agenda.id}>
                  <AgendaLine
                    agenda={agenda}
                    onUpdateAgenda={handleUpdateAgenda}
                    onDeleteAgenda={confirmAndDelete}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOverAgenda={handleDragOverAgenda}
                  />
                </div>
              ))}

          <AgendaLine agenda={emptyAgendaLine} onUpdateAgenda={handleEmptyAgendaLineEdit} />
        </div>
      </fieldset>
    </div>
  );
};

export default SettingsPlanner;
