import { useContext } from 'react';
import { ToastContext, ToastContextValue } from '../ToastContext.types';

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
