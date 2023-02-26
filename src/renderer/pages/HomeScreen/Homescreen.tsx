import { useState } from 'react';
import './styles.css';

export default function Homescreen() {
  const [text, setText] = useState('');

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then(setText)
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  function onSubmit() {
    window.electron.ipcRenderer.saveSnippet({
      body: 'a bunch of stuff',
      title: 'first snippet',
    });
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="homescreen-form">
        <input type="text" placeholder="Enter Title.." />
        <textarea readOnly value={text} />
        <div>
          <button type="button" onClick={handlePaste}>
            paste
          </button>
          <button type="button" onClick={onSubmit}>
            submit
          </button>
        </div>
      </form>
    </div>
  );
}
