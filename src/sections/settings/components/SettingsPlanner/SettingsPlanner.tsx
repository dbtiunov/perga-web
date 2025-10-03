import React from 'react';

import { type PlannerAgenda } from '@api/planner_agendas.ts';
import { Icon } from '@common/Icon.tsx';
import { useSettingsAgendas } from "@planner/hooks/useSettingsAgendas.ts";
import AgendaLine from '@settings/components/SettingsPlanner/AgendaLine/AgendaLine.tsx';

const SettingsPlanner: React.FC = () => {
  const {
    settingsAgendas,
    handleCreateAgenda,
    handleUpdateAgenda,
    handleDeleteAgenda,
  } = useSettingsAgendas();

  const emptyAgendaLine: PlannerAgenda = {
    id: -1,
    name: '',
    agenda_type: 'custom',
    index: -1
  }

  const handleEmptyAgendaLineEdit = (_agendaId: number, changes: { name?: string }) => {
    if (changes.name?.trim()) {
      void handleCreateAgenda(changes.name);
    }
  };

  return (
    <div className="px-0 md:px-6 mb-4 w-full md:max-w-2/5">
      <fieldset className="border border-gray-400 rounded-md p-8 mb-6">
        <legend className="px-2 text-gray-600">Agendas</legend>

        <p className="text-sm text-gray-500 mb-4">
          Create and manage custom agendas to group tasks. The Monthly agendas is created automatically for each month.
        </p>

        <div className="space-y-1">
          <div className="group flex items-center gap-2 min-h-[2.5rem] hover:bg-gray-100 rounded">
            <div className="flex-1 px-2 text-gray-600 truncate">Monthly</div>
            <div className="flex-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2
                          text-gray-500 cursor-help"
                 aria-label="Created and managed automatically" title="Created and managed automatically">
              <Icon name="question" size={20} className="h-6 w-6" />
            </div>
          </div>

          {settingsAgendas.map((agenda: PlannerAgenda) => (
            <div key={agenda.id}>
              <AgendaLine agenda={agenda} onUpdateAgenda={handleUpdateAgenda} onDeleteAgenda={handleDeleteAgenda} />
            </div>
          ))}

          <AgendaLine agenda={emptyAgendaLine} onUpdateAgenda={handleEmptyAgendaLineEdit} />
        </div>
      </fieldset>
    </div>
  );
};

export default SettingsPlanner;
