// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { INVOKERS_CHANNELS, SearchParams, SnippetData } from '../types';

export type Channels =
  | 'ipc-example'
  | 'IPC:ERROR_IN_MAIN'
  | 'IPC:SUCCESS_IN_MAIN'
  | 'IPC:ROUTE'
  | 'SEARCH:RESULTS'
  | 'TAGS:RESULTS';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    saveSnippet(snippet: SnippetData) {
      return ipcRenderer.invoke('snippet:save' as INVOKERS_CHANNELS, snippet);
    },
    copySnippet(body: string) {
      return ipcRenderer.invoke('snippet:copy' as INVOKERS_CHANNELS, body);
    },
    deleteSnippet(title: string) {
      return ipcRenderer.invoke('snippet:delete' as INVOKERS_CHANNELS, title);
    },
    sendSearch(searchParams?: SearchParams) {
      ipcRenderer.invoke('search:send' as INVOKERS_CHANNELS, searchParams);
    },
    getTags() {
      return ipcRenderer.invoke('tags:get' as INVOKERS_CHANNELS) as Promise<
        string[]
      >;
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
