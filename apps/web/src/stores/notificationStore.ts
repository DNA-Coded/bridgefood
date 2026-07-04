import { create } from 'zustand';

interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  toasts: ToastMessage[];
  addToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (message, type) => set((state) => {
    const id = Math.random().toString(36).substring(7);
    return { toasts: [...state.toasts, { id, message, type }] };
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
}));
