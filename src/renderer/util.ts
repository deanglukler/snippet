import { toast } from 'react-toastify';

export function logErrorAndToast(msg: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.error(msg, ...args);
  errToast(msg);
}

export function errToast(msg: string) {
  toast.error(msg, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
}
