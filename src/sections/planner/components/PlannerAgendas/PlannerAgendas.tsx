import React, { useEffect } from 'react';

import { PlannerAgenda, PlannerAgendaItem } from '@api/planner_agendas';
import { PlannerItemState } from '@/api/planner_base.ts';
import { Icon } from '@common/Icon.tsx';
import AgendaItem from '@planner/components/PlannerAgendas/AgendaItem/AgendaItem.tsx';
import { useCollapsedAgendas } from '@planner/hooks/useCollapsedAgendas.ts';
import AgendaActionsDropdown from '@planner/components/PlannerAgendas/AgendaActionsDropdown';

interface PlannerAgendasProps {
  plannerAgendas: PlannerAgenda[];
  plannerAgendaItems: Record<number, PlannerAgendaItem[]>;
  dragAgendaItem: PlannerAgendaItem | null;
  onDragStartAgendaItem: (item: PlannerAgendaItem) => void;
  onDragEndAgendaItem: () => void;
  onReorderAgendaItems: (agendaId: number, items: PlannerAgendaItem[]) => void;
  onAddAgendaItem: (agendaId: number, text: string) => void;
  onUpdateAgendaItem: (
    itemId: number,
    agendaId: number,
    changes: { text?: string; state?: PlannerItemState },
  ) => void;
  onDeleteAgendaItem: (itemId: number, agendaId: number) => void;
  onCopyAgendaItem: (itemId: number, toAgendaId: number) => void;
  onMoveAgendaItem: (itemId: number, fromAgendaId: number, toAgendaId: number) => void;
  onCopyAgendaItemToDay?: (date: Date, text: string) => void;
  selectedDate?: Date;
  copyAgendasMap: {
    currentMonth: PlannerAgenda;
    nextMonth: PlannerAgenda;
    customAgendas: PlannerAgenda[];
  };
  fetchAgendaItems: (agendaIds: number[]) => Promise<void> | void;
}

const PlannerAgendas: React.FC<PlannerAgendasProps> = ({
  plannerAgendas,
  plannerAgendaItems,
  dragAgendaItem,
  onDragStartAgendaItem,
  onDragEndAgendaItem,
  onReorderAgendaItems,
  onAddAgendaItem,
  onUpdateAgendaItem,
  onDeleteAgendaItem,
  onCopyAgendaItem,
  onMoveAgendaItem,
  onCopyAgendaItemToDay,
  selectedDate,
  copyAgendasMap,
  fetchAgendaItems,
}) => {
  const { collapsedAgendas, setCollapsedAgendas } = useCollapsedAgendas();

  // Ensure that newly created custom agendas are collapsed by default
  useEffect(() => {
    if (!plannerAgendas?.length) {
      return;
    }

    const updates: Record<number, boolean> = {};
    for (const agenda of plannerAgendas) {
      if (agenda.agenda_type === 'custom' && collapsedAgendas[agenda.id] === undefined) {
        updates[agenda.id] = true;
      }
    }

    if (Object.keys(updates).length > 0) {
      setCollapsedAgendas({ ...collapsedAgendas, ...updates });
    }
  }, [plannerAgendas, collapsedAgendas, setCollapsedAgendas]);

  const toggleAgendaCollapse = (agendaId: number) => {
    setCollapsedAgendas({
      ...collapsedAgendas,
      [agendaId]: !collapsedAgendas[agendaId],
    });
  };

  return (
    <div className="space-y-4">
      {plannerAgendas
        .filter((agenda) => agenda.id !== copyAgendasMap.nextMonth.id)
        .map((agenda) => (
          <div key={agenda.id}>
            <div className="flex items-center justify-between mb-3 group">
              <button
                type="button"
                className="flex items-center cursor-pointer focus:outline-none"
                onClick={() => toggleAgendaCollapse(agenda.id)}
                aria-expanded={!collapsedAgendas[agenda.id]}
                aria-controls={`agenda-${agenda.id}`}
              >
                <div
                  className={`mr-2 transform transition-transform ${collapsedAgendas[agenda.id] ? '' : 'rotate-90'}`}
                >
                  <Icon name="rightChevron" size="24" className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-gray-600">{agenda.name}</h3>
              </button>

              <div className="pl-2 text-gray-600 hover:text-gray-800 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <AgendaActionsDropdown agenda={agenda} fetchAgendaItems={fetchAgendaItems} />
              </div>
            </div>

            {!collapsedAgendas[agenda.id] && (
              <div id={`agenda-${agenda.id}`}>
                <div className="space-y-0">
                  {plannerAgendaItems[agenda.id]?.map((item, index) => (
                    <div
                      key={item.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (!dragAgendaItem || dragAgendaItem.agenda_id !== agenda.id) return;

                        const draggingItemIndex = plannerAgendaItems[agenda.id].findIndex(
                          (t) => t.id === dragAgendaItem.id,
                        );
                        if (draggingItemIndex === index) {
                          return;
                        }

                        const newItems = [...plannerAgendaItems[agenda.id]];
                        const [removed] = newItems.splice(draggingItemIndex, 1);
                        newItems.splice(index, 0, removed);

                        onReorderAgendaItems(agenda.id, newItems);
                      }}
                    >
                      <AgendaItem
                        item={item}
                        onUpdateItem={(itemId, changes) => {
                          onUpdateAgendaItem(itemId, agenda.id, changes);
                        }}
                        onDeleteItem={() => onDeleteAgendaItem(item.id, agenda.id)}
                        onDragStartItem={() => onDragStartAgendaItem(item)}
                        onDragEndItem={() => {
                          onDragEndAgendaItem();
                          onReorderAgendaItems(agenda.id, plannerAgendaItems[agenda.id]);
                        }}
                        onCopyItem={(itemId, toAgendaId) => onCopyAgendaItem(itemId, toAgendaId)}
                        onMoveItem={(itemId, fromAgendaId, toAgendaId) =>
                          onMoveAgendaItem(itemId, fromAgendaId, toAgendaId)
                        }
                        onCopyToDay={onCopyAgendaItemToDay}
                        selectedDate={selectedDate}
                        copyAgendasMap={copyAgendasMap}
                      />
                    </div>
                  ))}

                  <div>
                    <AgendaItem
                      item={{
                        id: -1,
                        agenda_id: agenda.id,
                        text: '',
                        state: 'todo',
                        index: -1,
                      }}
                      onUpdateItem={(_, changes) => {
                        if (changes.text?.trim()) {
                          onAddAgendaItem(agenda.id, changes.text);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default PlannerAgendas;
