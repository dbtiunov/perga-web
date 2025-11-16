import React, { useCallback, useMemo, useState } from 'react';
import { ToastContext, ToastContextValue, ToastMessage } from './ToastContext.types';

const ToastItem: React.FC<{ message: ToastMessage; onClose: (id: number) => void }> = ({
  message,
  onClose,
}) => {
  const { id, type, text, duration = 4000 } = message;

  React.useEffect(() => {
    const t = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onClose]);

  const bgColor =
    type === 'error'
      ? 'bg-bg-red'
      : type === 'success'
        ? 'bg-bg-green'
        : type === 'warning'
          ? 'bg-bg-yellow'
          : 'bg-bg-blue';

  return (
    <div
      className={`text-white px-4 py-3 rounded shadow mb-2 ${bgColor}`}
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const showToast: ToastContextValue['showToast'] = useCallback(
    (text, type = 'info', durationMs = 4000) => {
      // Generate a reasonably unique id
      const id = Date.now() + Math.random();
      setMessages((prev) => [...prev, { id, type, text, duration: durationMs }]);
    },
    [],
  );

  const showError: ToastContextValue['showError'] = useCallback(
    (text, durationMs = 4000) => {
      showToast(text, 'error', durationMs);
    },
    [showToast],
  );

  const value = useMemo(() => ({ showToast, showError }), [showToast, showError]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {messages.map((m) => (
          <ToastItem key={m.id} message={m} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
