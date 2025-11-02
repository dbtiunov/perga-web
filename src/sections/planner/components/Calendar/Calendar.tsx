import React, { useState, useMemo } from 'react';

import { Icon } from '@common/Icon';
import { useAuth } from '@contexts/hooks/useAuth.ts';
import { DAY_NAMES } from '@planner/const.ts';
import { formatDateForDisplayShort, formatDateMonthName } from '@planner/utils/dateUtils.ts';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  title?: string;
  predefinedDates?: Array<{
    label: string;
    date: Date;
  }>;
}

const Calendar: React.FC<CalendarProps> = ({ 
  selectedDate, 
  onDateChange,
  title,
  predefinedDates
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date(selectedDate));
  const { user } = useAuth();

  // Reorder day names based on user's week start day preference
  const orderedDayNames = useMemo(() => {
    if (user?.week_start_day === 'monday') {
      // Start with Monday: move Sunday to the end
      return [...DAY_NAMES.slice(1), DAY_NAMES[0]];
    }
    // Default to Sunday start
    return DAY_NAMES;
  }, [user?.week_start_day]);

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    onDateChange(newDate);
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month adjusted for week start preference
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfWeek = new Date(year, month, 1).getDay();

    // If week starts on Monday, adjust the day of week
    if (user?.week_start_day === 'monday') {
      // Convert from 0-6 (Sun-Sat) to 1-7 (Mon-Sun)
      // Sunday (0) becomes 7, Monday (1) becomes 1, etc.
      return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    }

    return dayOfWeek;
  };

  return <div className="bg-white absolute right-0 mt-1 shadow-lg z-10 w-64 origin-top-right border-gray-200 border-1">
    {(title || predefinedDates?.length) && <div className="border-gray-200 border-b-1">
      {title && <div className="p-4 pb-2 text-xs uppercase text-gray-500">{title}</div>}

      {predefinedDates?.length && <div className="p-2 grid grid-cols-1 gap-2">
        {predefinedDates.map((predefinedDate: {label: string; date: Date}) => (
          <button key={predefinedDate.label}
                  onClick={() => onDateChange(predefinedDate.date)}
                  className="text-sm p-2 hover:bg-gray-100 rounded text-left">
            {predefinedDate.label} ({formatDateForDisplayShort(predefinedDate.date)})
          </button>
        ))}
      </div>}
    </div>}

    <div className="p-4 w-64 origin-top-right">
      <div className="flex justify-between items-center mb-2 text-gray-600">
        <button onClick={handlePreviousMonth} className="p-1">
          <div className="transform rotate-180">
            <Icon name="rightChevron" size={16} />
          </div>
        </button>

        <div>{formatDateMonthName(currentMonth)}</div>

        <button onClick={handleNextMonth} className="p-1">
          <Icon name="rightChevron" size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {orderedDayNames.map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-600 py-1">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
          <div key={`empty-${index}`} className="h-8"></div>
        ))}

        {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth);
          date.setDate(day);

          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();

          return (
            <button key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md text-sm
                        ${isSelected 
                            ? 'bg-blue-500 text-white' 
                            : 'hover:bg-gray-200 text-gray-600 transition-colors'}`}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  </div>;
};

export default Calendar;
