import React, { useEffect, useRef, useState } from 'react';

import { DropdownContext } from './DropdownContext';

interface DropdownProps {
  buttonIcon: React.ReactNode;
  buttonTitle?: string;
  buttonClassName?: string;
  children: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  buttonIcon,
  buttonTitle = '',
  buttonClassName = '',
  children,
  className = '',
  dropdownClassName = '',
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={`inline-flex ${buttonClassName}`}
        onClick={toggle}
        title={buttonTitle}
        aria-label={buttonTitle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {buttonIcon}
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} bg-bg-main border border-border-main rounded shadow-lg z-10 ${dropdownClassName}`}
        >
          <DropdownContext.Provider value={{ close }}>{children}</DropdownContext.Provider>
        </div>
      )}
    </div>
  );
};
