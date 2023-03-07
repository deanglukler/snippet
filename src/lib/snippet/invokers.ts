import { ipcRenderer } from 'electron';
import { INVOKERS_CHANNELS } from '../../main/ipc/types';
import { SnippetData } from './types';

export function saveSnippet(snippet: SnippetData) {
  ipcRenderer.invoke('snippet:save' as INVOKERS_CHANNELS, snippet);
}
