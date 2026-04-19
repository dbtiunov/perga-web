import { useState, useEffect, useMemo } from 'react';

import { useIsMobile } from '@common/hooks/useIsMobile';
import { StorageKeys } from '@common/utils/storage_keys';
import { PlannerViewMode } from '@planner/types';

export const usePlannerViewMode = () => {
  const isMobile = useIsMobile();
  const [viewModeState, setViewModeState] = useState<PlannerViewMode>(() => {
    const saved = localStorage.getItem(StorageKeys.PlannerViewMode);
    return (saved as PlannerViewMode) || 'daily';
  });

  useEffect(() => {
    localStorage.setItem(StorageKeys.PlannerViewMode, viewModeState);
  }, [viewModeState]);

  const viewMode = useMemo(() => (isMobile ? 'daily' : viewModeState), [isMobile, viewModeState]);

  return {
    viewMode,
    setViewMode: setViewModeState,
  };
};
