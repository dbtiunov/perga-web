import React, { useState } from 'react';

import { Icon } from '@common/components/Icon';

interface DropdownSubmenuProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DropdownSubmenu: React.FC<DropdownSubmenuProps> = ({
  label,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`w-full text-left px-4 py-3 text-sm hover:bg-bg-hover flex items-center justify-between cursor-pointer ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center">{label}</div>
        <Icon
          name="rightChevron"
          size={14}
          className={`h-4 w-4 ml-2 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>

      {isOpen && <div className="bg-bg-main/50">{children}</div>}
    </div>
  );
};
