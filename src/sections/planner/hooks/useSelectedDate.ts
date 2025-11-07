import { useState, useEffect } from 'react';

export const useSelectedDate = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      return new Date(savedDate);
    }
    return new Date();
  });

  // Save selectedDate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate.toISOString());
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
  };
};
