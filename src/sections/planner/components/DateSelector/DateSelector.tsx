import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Icon } from '@common/Icon';
import {
  formatDateForDisplay,
  formatDateWeekDayShort,
  getNextDay,
  getPrevDay,
  isSameDay
} from '@common/utils/date_utils';
import Calendar from '@planner/components/Calendar/Calendar';
import { DATE_SELECTOR_DAYS_COUNT } from "@planner/const";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const datesList = useMemo(() => {
    const count = Math.max(1, DATE_SELECTOR_DAYS_COUNT);
    const half = Math.floor(count / 2);
    const dates: Date[] = [];

    // Start from selectedDate - half, move forward
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - half);
    for (let i = 0; i < count; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [selectedDate]);

  const handlePickDate = (date: Date) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  };

  return (
    <div className="p-5 flex items-center gap-3 text-text-main justify-center">
      {/* Left arrow */}
      <button
        onClick={() => onDateChange(getPrevDay(selectedDate))}
        className='mt-1 mr-2'
        aria-label="Previous day"
        title="Previous day"
      >
        <div className="transform rotate-180">
          <Icon name="rightChevron" size={20} />
        </div>
      </button>

      {/* Dates */}
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {datesList.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayLabel = formatDateWeekDayShort(date);
          const dateLabel = date.getDate();

          return (
            <button
              key={date.toLocaleDateString()}
              onClick={() => !isSameDay(date, selectedDate) && onDateChange(date)}
              className={
                `flex flex-col items-center justify-center h-12 w-12
                   ${isSelected ? 'text-text-main' : 'text-text-muted'
                }`
              }
              aria-current={isSelected ? 'date' : undefined}
              title={formatDateForDisplay(date)}
            >
              <span className={`text-2xs md:text-xs ${isSelected ? 'font-semibold' : ''}`}>{dayLabel}</span>
              <div className="flex items-center gap-1">
                <span className={`text-base md:text-lg leading-none ${isSelected ? 'font-semibold' : ''}`}>{dateLabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Calendar + Right arrow */}
      <div className="relative mt-2 mx-2" ref={calendarRef}>
        <button
          onClick={() => setIsCalendarOpen((value) => !value)}
          aria-label="Open calendar"
          title="Open calendar"
        >
          <Icon name="planner" size={20} fill="currentColor" />
        </button>

        {isCalendarOpen && (
          <Calendar
            selectedDate={selectedDate}
            onDateChange={handlePickDate}
            predefinedDates={[{ label: 'Today', date: new Date() }]}
          />
        )}
      </div>

      <button
        onClick={() => onDateChange(getNextDay(selectedDate))}
        className="mt-1 ml-4"
        aria-label="Next day"
        title="Next day"
      >
        <Icon name="rightChevron" size={20} />
      </button>
    </div>
  );
};

export default DateSelector;
