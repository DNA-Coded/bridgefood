import React, { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    window.localStorage.setItem('foodbridge-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
};
