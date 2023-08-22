import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Homescreen from './HomeScreen/Homescreen';
import Preferences from './PreferencesScreen/Preferences';
import ToastComponent from './ToastComponent';
import { theme } from 'antd';

const { useToken } = theme;

const Root: React.FC = () => {
  const { token } = useToken();

  const rootStyles = `
  :root {
    --colorBgContainer: ${token.colorBgContainer};
    --colorBgContainer: ${token.colorBorderBg};
    --colorBorder: ${token.colorBorder};
    --borderRadius: ${token.borderRadius}px;
  }
`;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Router>
      <ToastComponent />
      <style>{rootStyles}</style>
    </>
  );
};

export default Root;
