import { useState, useEffect } from 'react';

import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storage_keys';

export const useCollapsedAgendas = () => {
  // Initialize collapsedAgendas from localStorage if available
  const [collapsedAgendas, setCollapsedAgendas] = useState<Record<number, boolean>>(() => {
    return Storage.getJSON<Record<number, boolean>>(StorageKeys.PlannerCollapsedAgendas, {});
  });

  // Save collapsed agendas state to localStorage whenever it changes
  useEffect(() => {
    Storage.setJSON(StorageKeys.PlannerCollapsedAgendas, collapsedAgendas);
  }, [collapsedAgendas]);

  return {
    collapsedAgendas,
    setCollapsedAgendas,
  };
};
