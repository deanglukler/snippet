import { useEffect, useState } from 'react';
import { getAppTheme } from './appTheme';
import { theme } from 'antd';
import { useS } from './store';

const { defaultAlgorithm, darkAlgorithm } = theme;

export function useTheme() {
  const prefs = useS((s) => s.preferences);
  const system = useSystemColor();

  let mode: 'light' | 'dark' = system;
  if (prefs.colorScheme !== 'system') {
    mode = prefs.colorScheme;
  }

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  if (mode === 'dark') {
    return {
      algorithm: darkAlgorithm,
      ...getAppTheme('dark'),
    };
  }
  return {
    algorithm: defaultAlgorithm,
    ...getAppTheme('light'),
  };
}

function useSystemColor() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        const newColorScheme = event.matches ? 'dark' : 'light';
        setColorScheme(newColorScheme);
      });
  }, []);

  return colorScheme;
}
