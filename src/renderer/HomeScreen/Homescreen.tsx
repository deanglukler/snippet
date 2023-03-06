import { Button, Input, Space } from 'antd';
import { useA, useS } from '../../lib/store';
import { logErrorAndToast } from '../util';
import Search from './Search';
import './styles.css';
import TagSelector from './TagSelector';

export default function Homescreen() {
  const { body, title, tags } = useS((s) => s.snippetUpdater);
  const { set } = useA((a) => a.snippetUpdater);

  async function handlePaste() {
    try {
      set({ body: await navigator.clipboard.readText() });
    } catch (err) {
      logErrorAndToast('Error pasting');
    }
  }

  async function onSubmit() {
    window.electron.ipcRenderer.saveSnippet({
      body,
      title,
      metadata: {
        tags,
        timestampMili: Date.now(),
      },
    });
  }

  return (
    <div>
      {!body && (
        <>
          <Button type="text" onClick={handlePaste}>
            paste
          </Button>
          <Search />
        </>
      )}
      {body && (
        <Space className="homescreen-form">
          <Input
            type="text"
            placeholder="Enter Title.."
            value={title}
            onChange={({ target }) => set({ title: target.value })}
          />
          <TagSelector />
          <code>{body}</code>
          <div>
            <Button type="text" onClick={handlePaste}>
              paste
            </Button>
            <Button type="primary" onClick={onSubmit}>
              submit
            </Button>
          </div>
        </Space>
      )}
    </div>
  );
}
