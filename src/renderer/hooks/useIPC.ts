import { useEffect } from 'react';
import { useA } from '../store';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import log from '../../main/log';
import InitState from '../../initState';

export function useIPC() {
  const prefsActions = useA((a) => a.preferences);

  const navigate = useNavigate();

  useEffect(() => {
    const off = window.electron.ipcRenderer.on('IPC:ROUTE', (msg) => {
      navigate(msg as string);
    });

    return off;
  }, [navigate]);

  useEffect(() => {
    window.electron.ipcRenderer
      .getPrefs()
      .then((prefs) => {
        const nextPrefs = {};
        for (const k in InitState.preferences) {
          // @ts-ignore
          if (prefs[k]) {
            // @ts-ignore
            nextPrefs[k] = prefs[k];
          }
        }
        prefsActions.set(nextPrefs);
        return null;
      })
      .catch(log);
  }, [prefsActions]);
}
