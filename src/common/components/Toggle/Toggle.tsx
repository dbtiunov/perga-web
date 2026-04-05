import React from 'react';

export interface ToggleOption<T> {
  value: T;
  label: string | React.ReactNode;
}

interface ToggleProps<T> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  optionClassName?: string;
}

export const Toggle = <T,>({
  options,
  value,
  onChange,
  className = '',
  optionClassName = '',
}: ToggleProps<T>) => {
  return (
    <div className={`flex items-center ${className}`}>
      {options.map((option, index) => {
        const isActive = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        let borderClass = '';
        if (isFirst) {
          borderClass = 'rounded-l';
        } else if (isLast) {
          borderClass = 'rounded-r border-l-0';
        }

        let activeClass = '';
        if (isActive) {
          activeClass = 'bg-bg-main text-text-main cursor-default';
        } else {
          activeClass = 'bg-bg-hover text-text-muted cursor-pointer hover:bg-bg-main hover:text-text-main';
        }

        return (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            disabled={isActive}
            className={`px-4 py-1 border border-border-main text-sm transition-colors ${borderClass} ${activeClass} ${optionClassName}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
