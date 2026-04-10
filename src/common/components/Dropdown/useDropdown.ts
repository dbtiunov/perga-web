import { useContext } from 'react';

import { DropdownContext } from '@common/components/Dropdown/DropdownContext';

export const useDropdown = () => {
  return useContext(DropdownContext);
};
