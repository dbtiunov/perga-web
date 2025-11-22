import { useState, useEffect } from 'react';

import Storage from '@common/utils/storage';
import { Storage_keys } from '@common/utils/storage_keys.ts';

export const useCollapsedAgendas = () => {
  // Initialize collapsedAgendas from localStorage if available
  const [collapsedAgendas, setCollapsedAgendas] = useState<Record<number, boolean>>(() => {
    return Storage.getJSON<Record<number, boolean>>(Storage_keys.CollapsedAgendas, {});
  });

  // Save collapsed agendas state to localStorage whenever it changes
  useEffect(() => {
    Storage.setJSON(Storage_keys.CollapsedAgendas, collapsedAgendas);
  }, [collapsedAgendas]);

  return {
    collapsedAgendas,
    setCollapsedAgendas,
  };
};
