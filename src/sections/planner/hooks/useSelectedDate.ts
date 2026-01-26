import { useState, useEffect } from 'react';

import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storage_keys.ts';

export const useSelectedDate = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = Storage.get(StorageKeys.PlannerSelectedDate, null);
    if (savedDate) {
      return new Date(savedDate);
    }
    return new Date();
  });

  // Save selectedDate to localStorage whenever it changes
  useEffect(() => {
    Storage.set(StorageKeys.PlannerSelectedDate, selectedDate.toISOString());
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
  };
};
