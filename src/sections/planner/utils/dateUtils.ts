// Date utility functions for the Planner component

/**
 * Format date to YYYY-MM-DD for API
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date for display with day of the week and optional Today/Tomorrow label
 */
export const formatDateForDisplay = (date: Date): string => {
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

  // Add "Today", "Yesterday", "Tomorrow" to the title when applicable
  const today = new Date();
  const yesterday = getPrevDay(today);
  const tomorrow = getNextDay(today);

  if (date.toDateString() === today.toDateString()) {
    return `${formattedDate} (Today)`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `${formattedDate} (Yesterday)`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `${formattedDate} (Tomorrow)`;
  }

  return formattedDate;
};

/**
 * Format date for calendar dropdown
 */
export const formatDateForDisplayShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
};

export const getPrevDay = (date: Date): Date => {
  const prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() + 1);
  return prevDay;
};

export const getNextDay = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
};

export const getNextWeek = (date: Date): Date => {
  const nextWeek = new Date(date);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek;
};

export const getNextMonth = (date: Date): Date => {
  const nextMonth = new Date(date);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth;
};
