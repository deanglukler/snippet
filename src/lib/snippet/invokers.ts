import { ipcRenderer } from 'electron';
import { INVOKERS_CHANNELS } from '../../main/ipc/types';
import { SnippetData } from './types';

export function saveSnippet(snippet: SnippetData) {
  return ipcRenderer.invoke('snippet:save' as INVOKERS_CHANNELS, snippet);
}

export function copySnippet(body: string) {
  return ipcRenderer.invoke('snippet:copy' as INVOKERS_CHANNELS, body);
}

export function deleteSnippet(title: string) {
  return ipcRenderer.invoke('snippet:delete' as INVOKERS_CHANNELS, title);
}
