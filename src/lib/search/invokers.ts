import { ipcRenderer } from 'electron';
import { CH } from '../../main/ipc/types';

export function sendSearch(text: string) {
  ipcRenderer.invoke('search:send' as CH, text);
}
