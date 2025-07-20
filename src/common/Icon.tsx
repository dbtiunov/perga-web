import React from 'react';

import { icons } from './icons/icons.tsx';

type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number | string;
  fill?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, fill = 'none', className = '' }) => {
  const icon = icons[name];

  if (!icon) return null;

  return React.cloneElement(icon, {
    width: size,
    height: size,
    fill,
    className,
  });
};


