import { ConfigProvider } from 'antd';
import { StoreProvider } from 'easy-peasy';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import store from './store';
import './App.css';
import './BorderAnimation.css';
import Homescreen from './HomeScreen/Homescreen';
import { useTheme } from './hooks';
import Preferences from './PreferencesScreen/Preferences';
import ToastComponent from './ToastComponent';

export default function App() {
  const appTheme = useTheme();

  return (
    <StoreProvider store={store}>
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
    </StoreProvider>
  );
}
