import axios from "axios";

import { PlannerItemState, BasePlannerItem } from "./planner_base.ts";

export type PlannerAgendaType = 'monthly' | 'backlog' | 'custom';

export interface PlannerAgenda {
  id: number;
  name: string;
  agenda_type: PlannerAgendaType;
  index: number;
}

export interface PlannerAgendaItem extends BasePlannerItem {
  agenda_id: number;
}

export interface PlannerAgendaItemCreate {
  agenda_id: number;
  text: string;
}

export interface PlannerAgendaItemUpdate {
  text?: string;
  agenda_id?: number;
  index?: number;
  state?: PlannerItemState;
}


// API base URLs
const PLANNER_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/planner`;
const AGENDAS_API_URL = `${PLANNER_API_BASE_URL}/agendas/`;

// Planner agenda endpoints
export const getPlannerAgendasByDay = (day: string) =>
  axios.get<PlannerAgenda[]>(AGENDAS_API_URL, {
    params: { day },
  });

export const getItemsByAgendas = (agendaIds: number[]) =>
  axios.get<Record<number, PlannerAgendaItem[]>>(`${AGENDAS_API_URL}items/`, {
    params: { agenda_ids: agendaIds },
    paramsSerializer: {
      indexes: null // Prevents using square brackets in array params
    }
  });

export const createPlannerAgendaItem = (item: PlannerAgendaItemCreate) =>
  axios.post<PlannerAgendaItem>(`${AGENDAS_API_URL}items/`, item);

export const updatePlannerAgendaItem = (itemId: number, changes: PlannerAgendaItemUpdate) =>
  axios.put<PlannerAgendaItem>(`${AGENDAS_API_URL}items/${itemId}/`, changes);

export const deletePlannerAgendaItem = (itemId: number) =>
  axios.delete(`${AGENDAS_API_URL}items/${itemId}/`);

export const reorderPlannerAgendaItems = (agendaId: number, orderedItemIds: number[]) =>
  axios.post(`${AGENDAS_API_URL}items/reorder/`, { agenda_id: agendaId, ordered_item_ids: orderedItemIds });
