import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [value, setValue] = useState('front end init value');
  useEffect(() => {
    const i = setInterval(() => {
      window.electron.ipcRenderer.sendMessage('get-input-value', []);
    }, 10);

    window.electron.ipcRenderer.on('get-input-value', (val) => {
      setValue(val);
    });

    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          window.electron.ipcRenderer.sendMessage('set-input-value', [
            e.target.value,
          ]);
        }}
      />
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
