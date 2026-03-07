import { createContext } from 'react';

interface DropdownContextType {
  close: () => void;
}

export const DropdownContext = createContext<DropdownContextType | undefined>(undefined);
