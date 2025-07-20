import React, { useState, useRef, useEffect } from 'react';

import { Icon } from '@common/Icon';
import Calendar from '@planner/components/Calendar/Calendar';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate, 
  onDateChange

}) => {
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

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleCalendarButtonClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleCalendarDateChange = (date: Date) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  };

  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <button onClick={handlePreviousDay} className="p-1"
              aria-label="Previous day" title="Previous day">
        <div className="transform rotate-180">
          <Icon name="rightChevron" size={20} />
        </div>
      </button>

      <div className="relative" ref={calendarRef}>
        <button onClick={handleCalendarButtonClick}
                className="p-1"
                aria-label="Open calendar" title="Open calendar">
          <Icon name="planner" size={20} fill="currentColor" />
        </button>

        {isCalendarOpen &&
          <Calendar selectedDate={selectedDate}
                    onDateChange={handleCalendarDateChange}
                    predefinedDates={[{label: 'Today', date: new Date()}]} />}
      </div>

      <button onClick={handleNextDay} className="p-1"
              aria-label="Next day" title="Next day">
        <Icon name="rightChevron" size={20} />
      </button>
    </div>
  );
};

export default DateSelector;
