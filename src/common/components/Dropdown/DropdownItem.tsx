import React from 'react';

import { useDropdown } from './useDropdown';

interface DropdownItemProps {
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  onClick,
  children,
  className = '',
  title = '',
  disabled = false,
  closeOnClick = true,
}) => {
  const dropdown = useDropdown();

  return (
    <button
      type="button"
      className={`w-full text-left px-4 py-3 text-sm hover:bg-bg-hover flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
        if (closeOnClick) {
          dropdown?.close();
        }
      }}
      title={title}
      aria-label={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
