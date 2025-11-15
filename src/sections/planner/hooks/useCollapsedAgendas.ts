import { useState, useEffect } from 'react';

import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storageKeys';


export const useCollapsedAgendas = () => {
  // Initialize collapsedAgendas from localStorage if available
  const [collapsedAgendas, setCollapsedAgendas] = useState<Record<number, boolean>>(() => {
    return Storage.getJSON<Record<number, boolean>>(StorageKeys.CollapsedAgendas, {});
  });

  // Save collapsed agendas state to localStorage whenever it changes
  useEffect(() => {
    Storage.setJSON(StorageKeys.CollapsedAgendas, collapsedAgendas);
  }, [collapsedAgendas]);

  return {
    collapsedAgendas,
    setCollapsedAgendas,
  };
};
