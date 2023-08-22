import { useTheme } from './hooks';
import { ConfigProvider } from 'antd';
import './App.css';
import './BorderAnimation.css';
import Root from './Root';

const ConfigTheme: React.FC = () => {
  const appTheme = useTheme();

  return (
    <ConfigProvider
      theme={{
        ...appTheme,
      }}
    >
      <Root />
    </ConfigProvider>
  );
};

export default ConfigTheme;
