import React from 'react';

import { PlannerAgenda, PlannerAgendaItem } from '@api/planner_agendas';
import { Icon } from '@common/Icon.tsx';
import AgendaItem from '@planner/components/PlannerAgendas/AgendaItem/AgendaItem.tsx';
import { useCollapsedAgendas } from '@planner/hooks/useCollapsedAgendas.ts';

interface PlannerAgendasProps {
  plannerAgendas: PlannerAgenda[];
  plannerAgendaItems: Record<number, PlannerAgendaItem[]>;
  dragAgendaItem: PlannerAgendaItem | null;
  onDragStartAgendaItem: (item: PlannerAgendaItem) => void;
  onDragEndAgendaItem: () => void;
  onReorderAgendaItems: (agendaId: number, items: PlannerAgendaItem[]) => void;
  onAddAgendaItem: (agendaId: number, text: string) => void;
  onUpdateAgendaItem: (itemId: number, agendaId: number, changes: { text?: string }) => void;
  onDeleteAgendaItem: (itemId: number, agendaId: number) => void;
  onCopyAgendaItem: (itemId: number, toAgendaId: number) => void;
  onSnoozeAgendaItem: (itemId: number, fromAgendaId: number, toAgendaId: number) => void;
  currentMonthAgenda?: PlannerAgenda;
  nextMonthAgenda?: PlannerAgenda;
  customAgendas: PlannerAgenda[];
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
  onSnoozeAgendaItem,
  currentMonthAgenda,
  nextMonthAgenda,
  customAgendas,
}) => {
  const { collapsedAgendas, setCollapsedAgendas } = useCollapsedAgendas();

  const toggleAgendaCollapse = (agendaId: number) => {
    setCollapsedAgendas({
      ...collapsedAgendas,
      [agendaId]: !collapsedAgendas[agendaId]
    });
  };

  return (
    <div className="space-y-4">
      {plannerAgendas.map(agenda => (
        <div key={agenda.id}>
          <div className="flex items-center mb-3 cursor-pointer"
               onClick={() => toggleAgendaCollapse(agenda.id)}>
            <div className="flex items-center">
              <div className={`mr-2 transform transition-transform ${collapsedAgendas[agenda.id] ? '' : 'rotate-90'}`}>
                <Icon name="rightChevron" size="24" className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className='font-medium'>
                {agenda.name} ({agenda.completed_items_cnt}/{agenda.completed_items_cnt + agenda.todo_items_cnt})
              </h3>
            </div>
          </div>

          {!collapsedAgendas[agenda.id] && (
            <div>
              <div className="space-y-0">
                {plannerAgendaItems[agenda.id]?.map((item, index) => (
                  <div key={item.id}
                       onDragOver={(e) => {
                         e.preventDefault();
                         if (!dragAgendaItem || dragAgendaItem.agenda_id !== agenda.id) return;

                         const draggingItemIndex = plannerAgendaItems[agenda.id].findIndex(t => t.id === dragAgendaItem.id);
                         if (draggingItemIndex === index) {
                           return;
                         }

                         const newItems = [...plannerAgendaItems[agenda.id]];
                         const [removed] = newItems.splice(draggingItemIndex, 1);
                         newItems.splice(index, 0, removed);

                         onReorderAgendaItems(agenda.id, newItems);
                      }}>
                    <AgendaItem item={item}
                                onUpdateItem={(itemId, changes) => {
                                  onUpdateAgendaItem(itemId, agenda.id, changes)
                                }}
                                onDeleteItem={() => onDeleteAgendaItem(item.id, agenda.id)}
                                onDragStartItem={() => onDragStartAgendaItem(item)}
                                onDragEndItem={() => {
                                  onDragEndAgendaItem();
                                  onReorderAgendaItems(agenda.id, plannerAgendaItems[agenda.id]);
                                }}
                                onCopyItem={(itemId, toAgendaId) => onCopyAgendaItem(itemId, toAgendaId)}
                                onSnoozeItem={(itemId, fromAgendaId, toAgendaId) => onSnoozeAgendaItem(itemId, fromAgendaId, toAgendaId)}
                                currentMonthAgenda={currentMonthAgenda}
                                nextMonthAgenda={nextMonthAgenda}
                                customAgendas={customAgendas} />
                  </div>
                ))}

                <div>
                  <AgendaItem item={{
                                id: -1,
                                agenda_id: agenda.id,
                                text: '',
                                state: 'todo',
                                index: -1
                              }}
                              onUpdateItem={(_, changes) => {
                                if (changes.text?.trim()) {
                                  onAddAgendaItem(agenda.id, changes.text);
                                }
                              }} />
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
