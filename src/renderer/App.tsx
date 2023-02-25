import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homescreen from './pages/HomeScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homescreen />} />
      </Routes>
    </Router>
  );
}
