import { useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SnippetList from './SnippetList';
import SnippetActions from '../../lib/snippet/SnippetActions';

export default function Homescreen() {
  useIPC();

  useEffect(() => {
    function setInitialStoreState() {
      window.electron.ipcRenderer.sendSearch('');
    }
    setInitialStoreState();
  }, []);

  return (
    <div
      style={{
        minWidth: '515px',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        padding: '15px',
      }}
    >
      <Button
        style={{ position: 'absolute', top: '15px', right: '15px' }}
        type="dashed"
        icon={<PlusOutlined />}
        onClick={SnippetActions.setSnippetBodyFromClipboard}
      >
        New Snippet
      </Button>
      <SnippetList />
    </div>
  );
}
