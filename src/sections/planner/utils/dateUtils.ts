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

  // Add "Today" or "Tomorrow" to the title when applicable
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return `${formattedDate} (Today)`;
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


/**
 * Get the next day from a given date
 */
export const getNextDate = (date: Date): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return date.toDateString() === new Date().toDateString();
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};
