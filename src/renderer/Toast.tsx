import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { errToast } from './util';

export default function () {
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('IPC:ERROR_IN_MAIN', (msg) => {
      errToast(msg as string);
    });

    return off;
  }, []);
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('IPC:SUCCESS_IN_MAIN', (msg) => {
      toast(msg as string, {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    });

    return off;
  }, []);
  return <ToastContainer />;
}
