// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC, DefaultChannels } from '../types';

function ipcPreloader<CH extends keyof IPC>(channel: CH) {
  return function (payload: IPC[CH]['invoke']) {
    return ipcRenderer.invoke(channel, payload) as Promise<IPC[CH]['return']>;
  };
}

const electronHandler = {
  ipcRenderer: {
    getAllSnippets: ipcPreloader('snippets:get-all'),
    saveSnippet: ipcPreloader('snippet:save'),
    deleteSnippet: ipcPreloader('snippet:delete'),
    updateSnippetLiked: ipcPreloader('snippet:update-liked'),
    renameTag: ipcPreloader('tag:rename'),
    getTags: ipcPreloader('tag:get-all'),
    copySnippet: ipcPreloader('snippet:copy-to-clipboard'),
    getPrefs: ipcPreloader('preferences:get'),
    updatePrefs: ipcPreloader('preferences:update'),

    //

    //
    sendMessage(channel: DefaultChannels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: DefaultChannels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: DefaultChannels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
