import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

const THEME_KEY = 'ai-study-coach-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    
    // Default to dark theme
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === 'dark',
  };
};
