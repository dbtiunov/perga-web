import { useContext } from 'react';

import { DropdownContext } from '@common/components/Dropdown/DropdownContext.ts';

export const useDropdown = () => {
  return useContext(DropdownContext);
};

