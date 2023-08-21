import { useEffect, useState } from 'react';
import { getAppTheme } from './appTheme';
import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

export function useTheme() {
  const mode = useColorScheme();
  return {
    algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
    ...getAppTheme(mode),
  };
}

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mql.matches ? 'dark' : 'light');
    const onChange = (e: any) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', onChange);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return colorScheme;
}
