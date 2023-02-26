import { ipcMain } from 'electron';
import { handleSaveSnippet } from '../../lib/snippet/handlers';
import { CH } from './types';

export default function initIpc() {
  ipcMain.handle('snippet:save' as CH, handleSaveSnippet);
}
