import React, { useEffect, useRef, useState } from 'react';

import {
  type PlannerAgenda,
  type PlannerAgendaAction,
  actionPlannerAgenda,
} from '@api/planner_agendas';
import { Icon } from '@common/Icon.tsx';
import { useToast } from '@contexts/hooks/useToast';

const ACTION_LABELS: Record<PlannerAgendaAction, string> = {
  delete_finished_items: 'Delete finished items',
  sort_items_by_state: 'Sort items by state',
};

interface AgendaActionsDropdownProps {
  agenda: PlannerAgenda;
  fetchAgendaItems: (agendaIds: number[]) => Promise<void> | void;
}

const AgendaActionsDropdown: React.FC<AgendaActionsDropdownProps> = ({
  agenda,
  fetchAgendaItems,
}) => {
  const [open, setOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<PlannerAgendaAction | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { showError } = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleAction = async (action: PlannerAgendaAction) => {
    try {
      setLoadingAction(action);
      await actionPlannerAgenda(agenda.id, action);
      await fetchAgendaItems([agenda.id]);
    } catch (e) {
      console.error('Agenda action failed', e);
      showError('Failed to perform action');
    } finally {
      setLoadingAction(null);
      setOpen(false);
    }
  };

  return (
    <div className="inline-flex relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="inline-flex"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        aria-label="Agenda actions"
        title="Agenda actions"
      >
        <Icon name="dots" size={48} className="h-6 w-6" />
      </button>

      {open && (
        <div className="absolute right-0 mt-8 w-56 bg-bg-main rounded shadow-lg z-10 border-border-main border-1">
          {(Object.keys(ACTION_LABELS) as PlannerAgendaAction[]).map((action) => (
            <button
              key={action}
              type="button"
              className="w-full text-left px-4 py-3 text-text-main text-sm bg-bg-main hover:bg-bg-hover flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAction(action)}
              disabled={!!loadingAction}
            >
              {loadingAction === action ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                  {ACTION_LABELS[action]}
                </span>
              ) : (
                ACTION_LABELS[action]
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgendaActionsDropdown;
