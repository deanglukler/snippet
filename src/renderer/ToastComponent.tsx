import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { errorAndToast, successToast } from './toast';

export default function () {
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('IPC:ERROR_IN_MAIN', (msg) => {
      errorAndToast(msg as string);
    });

    return off;
  }, []);
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('IPC:SUCCESS_IN_MAIN', (msg) => {
      successToast(msg as string);
    });

    return off;
  }, []);
  return <ToastContainer />;
}
