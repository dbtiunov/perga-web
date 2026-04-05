import type { PlannerAgendaActionDTO } from '@api/planner';

export const WEEKDAY_SHORT_NAMES: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const DATE_SELECTOR_DAYS_COUNT: number = 5;
export const PLANNER_DAYS_COUNT: number = 7;

export const ITEM_TEXT_MAX_LENGTH: number = 256;
export const AGENDA_NAME_MAX_LENGTH: number = 64;

export const AGENDA_ACTION_LABELS: Record<PlannerAgendaActionDTO, string> = {
  delete_finished_items: 'Delete finished items',
  sort_items_by_state: 'Sort items by state',
};
