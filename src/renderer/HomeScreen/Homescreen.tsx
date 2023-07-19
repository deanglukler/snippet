import { useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { setSnippetBodyFromClipboard } from '../../lib/storeActions';
import SnippetForm from './SnippetForm';
import { useS } from '../../lib/store';
import SnippetList from './SnippetList';

export default function Homescreen() {
  useIPC();

  useEffect(() => {
    function setInitialStoreState() {
      window.electron.ipcRenderer.sendSearch('');
    }
    setInitialStoreState();
  }, []);

  const { body: snippetBody } = useS((s) => s.snippetUpdater);

  return (
    <div
      style={{
        minWidth: '300px',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        padding: '15px',
      }}
    >
      {!snippetBody && (
        <>
          <Button
            style={{ position: 'absolute', top: '15px', right: '15px' }}
            type="dashed"
            icon={<PlusOutlined />}
            onClick={setSnippetBodyFromClipboard}
          >
            New Snippet
          </Button>
          <SnippetList />
        </>
      )}
      {snippetBody && <SnippetForm />}
    </div>
  );
}
