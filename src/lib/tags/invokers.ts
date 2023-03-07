import { ipcRenderer } from 'electron';
import { INVOKERS_CHANNELS } from '../../main/ipc/types';

export function getTags() {
  return ipcRenderer.invoke('tags:get' as INVOKERS_CHANNELS) as Promise<
    string[]
  >;
}
