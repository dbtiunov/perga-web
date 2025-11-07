import axios from 'axios';

import { PlannerItemState, BasePlannerItem } from './planner_base.ts';

export interface PlannerDayItem extends BasePlannerItem {
  day: string;
}

export interface PlannerDayItemCreate {
  day: string;
  text: string;
}

export interface PlannerDayItemUpdate {
  day?: string;
  text?: string;
  index?: number;
  state?: PlannerItemState;
}

// API base URLs
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/planner`;
const DAYS_API_URL = `${API_BASE_URL}/days/items`;

export const getItemsByDays = (days: string[]) =>
  axios.get<Record<string, PlannerDayItem[]>>(`${DAYS_API_URL}/`, {
    params: { days: days },
    paramsSerializer: {
      indexes: null, // Prevents using square brackets in array params
    },
  });

export const createPlannerDayItem = (item: PlannerDayItemCreate) =>
  axios.post<PlannerDayItem>(`${DAYS_API_URL}/`, item);

export const updatePlannerDayItem = (itemId: number, item: PlannerDayItemUpdate) =>
  axios.put<PlannerDayItem>(`${DAYS_API_URL}/${itemId}/`, item);

export const deletePlannerDayItem = (itemId: number) => axios.delete(`${DAYS_API_URL}/${itemId}/`);

export const reorderPlannerDayItems = (orderedItemIds: number[]) =>
  axios.post(`${DAYS_API_URL}/reorder/`, { ordered_item_ids: orderedItemIds });

export const copyPlannerDayItem = (itemId: number, day: string) =>
  axios.post<PlannerDayItem>(`${DAYS_API_URL}/${itemId}/copy/`, { day });

export const snoozePlannerDayItem = (itemId: number, day: string) =>
  axios.post<PlannerDayItem>(`${DAYS_API_URL}/${itemId}/snooze/`, { day });
