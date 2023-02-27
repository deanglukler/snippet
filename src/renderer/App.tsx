import { StoreProvider } from 'easy-peasy';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import store from '../lib/store';
import './App.css';
import Homescreen from './pages/HomeScreen';
import ToastErrors from './Toast';

export default function App() {
  return (
    <StoreProvider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Homescreen />} />
        </Routes>
      </Router>
      <ToastErrors />
    </StoreProvider>
  );
}
