'use client';

import { useMemo, useState } from 'react';

import { Theme, ThemeContext } from './ThemeContext';

export interface ThemeProviderProps {
  defaultTheme?: Theme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme = 'dark',
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
