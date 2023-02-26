import { useState } from 'react';
import './styles.css';

export default function Homescreen() {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

  function handlePaste() {
    navigator.clipboard
      .readText()
      .then(setBody)
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  async function onSubmit() {
    window.electron.ipcRenderer.saveSnippet({
      body,
      title,
    });
  }

  return (
    <div>
      <form className="homescreen-form">
        <input
          type="text"
          placeholder="Enter Title.."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <textarea readOnly value={body} />
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
