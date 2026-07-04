import React from 'react';
import { useNotificationStore } from '../stores/notificationStore';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
        {toasts.map((toast) => {
          const typeStyles = {
            info: 'bg-primary text-primary-foreground border-primary/20',
            success: 'bg-success text-success-foreground border-success/20',
            warning: 'bg-warning text-warning-foreground border-warning/20',
            error: 'bg-destructive text-destructive-foreground border-destructive/20'
          };
          return (
            <div
              key={toast.id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-lg border ${typeStyles[toast.type]} animate-in fade-in slide-in-from-bottom-5 duration-300`}
            >
              <span className="text-sm font-semibold">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 hover:opacity-80 text-xs font-bold uppercase tracking-wider"
              >
                Dismiss
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
