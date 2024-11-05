'use client';

import { MoonOutlined, SunOutlined } from '@ant-design/icons';

import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/utils';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const onToggleClick = () => {
    const updatedTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.className = updatedTheme;
  };

  return (
    <Toggle onClick={onToggleClick}>
      {theme === 'light' ? <SunOutlined /> : <MoonOutlined />}
    </Toggle>
  );
};
