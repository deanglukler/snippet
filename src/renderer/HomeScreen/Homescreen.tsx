import { useEffect } from 'react';
import { useIPC } from '../ipc/hooks';
import HomescreenLayout from './HomescreenLayout';

export default function Homescreen() {
  useIPC();

  useEffect(() => {
    function setInitialStoreState() {
      window.electron.ipcRenderer.sendSearch('');
    }
    setInitialStoreState();
  }, []);

  return <HomescreenLayout />;
}
