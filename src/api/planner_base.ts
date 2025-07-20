export type PlannerItemState = 'todo' | 'completed' | 'snoozed' | 'dropped';

export interface BasePlannerItem {
  id: number;
  text: string;
  state: PlannerItemState;
  index: number;
}
