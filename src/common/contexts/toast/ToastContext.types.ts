import { createContext } from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
  duration?: number;
}

export interface ToastContextType {
  showToast: (text: string, type?: ToastType, durationMs?: number) => void;
  showError: (text: string, durationMs?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
