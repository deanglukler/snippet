import { useTheme } from './hooks';
import { ConfigProvider } from 'antd';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './BorderAnimation.css';
import Homescreen from './HomeScreen/Homescreen';
import Preferences from './PreferencesScreen/Preferences';
import ToastComponent from './ToastComponent';
import { useEffect } from 'react';

const ConfigLayer: React.FC = () => {
  const appTheme = useTheme();

  // useEffect(() => {
  //   document.documentElement.style.colorScheme = appTheme;
  // }, [appTheme]);

  return (
    <ConfigProvider
      theme={{
        ...appTheme,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Router>
      <ToastComponent />
    </ConfigProvider>
  );
};

export default ConfigLayer;
