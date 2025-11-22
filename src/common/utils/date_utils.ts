/**
 * Formats date for API. Example: '2025-11-22'.
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats date, Example: 'Sat, November 22'.
 * withRelativeTag: if true, adds (today)/(yesterday)/(tomorrow) at the end of the result string.
 */
export const formatDateForDisplay = (date: Date, withRelativeTag: boolean = false): string => {
  let formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

  if (withRelativeTag) {
    const today = new Date();
    const yesterday = getPrevDay(today);
    const tomorrow = getNextDay(today);

    if (isSameDay(date, today)) {
      formattedDate += ' (Today)';
    } else if (isSameDay(today, yesterday)) {
      formattedDate += ' (Yesterday)';
    } else if (isSameDay(today, tomorrow)) {
      formattedDate += ' (Tomorrow)';
    }
  }

  return formattedDate;
};

export const formatDateMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const formatDateWeekDayShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getPrevDay = (date: Date): Date => {
  const prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() - 1);
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

export const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
