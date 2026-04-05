import React, { useMemo } from 'react';

import { Dropdown } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';
import {
  formatDateForDisplay,
  formatDateWeekDayShort,
  getNextDay,
  getPrevDay,
  isSameDay,
} from '@common/utils/date_utils';
import PlannerCalendar from '@planner/components/PlannerCalendar/PlannerCalendar';
import { DATE_SELECTOR_DAYS_COUNT } from '@planner/const';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const PlannerDateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const datesList = useMemo(() => {
    const count = Math.max(1, DATE_SELECTOR_DAYS_COUNT);
    const half = Math.floor(count / 2);
    const dates: Date[] = [];

    // Start from selectedDate - half, move forward
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - half);
    for (let i = 0; i < count; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [selectedDate]);

  const handlePickDate = (date: Date) => {
    onDateChange(date);
  };

  return (
    <>
      {/* Left arrow */}
      <button
        onClick={() => onDateChange(getPrevDay(selectedDate))}
        className="mt-1 text-text-muted hover:text-text-main transition-colors"
        aria-label="Previous day"
        title="Previous day"
      >
        <div className="transform rotate-180">
          <Icon name="rightChevron" size={20} />
        </div>
      </button>

      {/* Dates */}
      <div className="flex items-center justify-center gap-2">
        {datesList.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayLabel = formatDateWeekDayShort(date);
          const dateLabel = date.getDate();
          const selectedColor = isSelected ? 'text-text-main' : 'text-text-muted';

          return (
            <button
              key={date.toLocaleDateString()}
              onClick={() => !isSameDay(date, selectedDate) && onDateChange(date)}
              className={`flex flex-col items-center justify-center h-12 w-10
                   ${selectedColor} hover:text-text-main transition-colors`}
              aria-current={isSelected ? 'date' : undefined}
              title={formatDateForDisplay(date)}
            >
              <span className={`text-2xs md:text-xs ${isSelected ? 'font-semibold' : ''}`}>
                {dayLabel}
              </span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-base md:text-lg leading-none ${isSelected ? 'font-semibold' : ''}`}
                >
                  {dateLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Dropdown
        buttonIcon={<Icon name="planner" size={20} fill="currentColor" />}
        buttonTitle="Open calendar"
        className="mt-2 mx-1 text-text-muted hover:text-text-main transition-colors"
      >
        <PlannerCalendar
          selectedDate={selectedDate}
          onDateChange={handlePickDate}
          predefinedDates={[{ label: 'Today', date: new Date() }]}
        />
      </Dropdown>

      <button
        onClick={() => onDateChange(getNextDay(selectedDate))}
        className="mt-1 text-text-muted hover:text-text-main transition-colors"
        aria-label="Next day"
        title="Next day"
      >
        <Icon name="rightChevron" size={20} />
      </button>
    </>
  );
};

export default PlannerDateSelector;
