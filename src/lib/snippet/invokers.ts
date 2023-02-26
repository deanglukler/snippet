import { ipcRenderer } from 'electron';
import { CH } from '../../main/ipc/types';
import { SnippetData } from './types';

export function saveSnippet(snippet: SnippetData) {
  ipcRenderer.invoke('snippet:save' as CH, snippet);
}
