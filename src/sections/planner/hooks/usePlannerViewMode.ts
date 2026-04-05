import { useState, useEffect } from 'react';

import { StorageKeys } from '@common/utils/storage_keys';
import { PlannerViewMode } from '@planner/types.ts';

export const usePlannerViewMode = () => {
  const [viewMode, setViewMode] = useState<PlannerViewMode>(() => {
    const saved = localStorage.getItem(StorageKeys.PlannerViewMode);
    return (saved as PlannerViewMode) || 'daily';
  });

  useEffect(() => {
    localStorage.setItem(StorageKeys.PlannerViewMode, viewMode);
  }, [viewMode]);

  return {
    viewMode,
    setViewMode,
  };
};
