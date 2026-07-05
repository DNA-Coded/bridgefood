import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'foodbridge-theme';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    window.localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const currentTheme = useThemeStore.getState().theme;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.localStorage.setItem('theme', nextTheme);
    set({ theme: nextTheme });
  },
}));
