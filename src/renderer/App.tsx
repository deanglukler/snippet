import { ConfigProvider, theme } from 'antd';
import { StoreProvider } from 'easy-peasy';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import store from '../lib/store';
import './App.css';
import Homescreen from './HomeScreen/Homescreen';
import { useColorScheme, useTheme } from './hooks';
import ToastErrors from './Toast';

const { defaultAlgorithm, darkAlgorithm } = theme;

export default function App() {
  const mode = useColorScheme();
  const appTheme = useTheme();

  return (
    <StoreProvider store={store}>
      <ConfigProvider
        theme={{
          algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
          ...appTheme,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Homescreen />} />
          </Routes>
        </Router>
        <ToastErrors />
      </ConfigProvider>
    </StoreProvider>
  );
}
