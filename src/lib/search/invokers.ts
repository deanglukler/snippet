import { ipcRenderer } from 'electron';
import { INVOKERS_CHANNELS } from '../../main/ipc/types';

export function sendSearch(text: string) {
  ipcRenderer.invoke('search:send' as INVOKERS_CHANNELS, text);
}
