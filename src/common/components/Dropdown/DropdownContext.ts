import { createContext, useContext } from 'react';

interface DropdownContextProps {
  close: () => void;
}

export const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

export const useDropdown = () => {
  return useContext(DropdownContext);
};
