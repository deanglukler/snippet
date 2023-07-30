import { AliasToken } from 'antd/es/theme/internal';

const lightThemeColors: Partial<AliasToken> = {
  colorBgContainer: '#fafafa',
  colorBgElevated: '#fafafa',
};

const darkThemeColors: Partial<AliasToken> = {
  colorBgContainer: '#171717',
  colorBgElevated: '#171717',
};

const tokenBase = {
  colorPrimary: '#52a258',
  borderRadius: 17,
  fontSizeHeading1: 24,
  fontSizeHeading2: 20,
  fontSizeHeading3: 18,
  fontSizeHeading4: 18,
  fontSize: 15,
  colorSuccess: '#59ab62',
  colorWarning: '#ffc107',
  colorError: '#f60e0e',
  colorInfo: '#1890ff',
};

const darkTheme = {
  token: { ...tokenBase, ...darkThemeColors },
};

const lightTheme = {
  token: { ...tokenBase, ...lightThemeColors },
};

export function getAppTheme(mode: 'light' | 'dark') {
  return mode === 'light' ? lightTheme : darkTheme;
}
