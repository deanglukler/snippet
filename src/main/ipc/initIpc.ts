import { ipcMain } from 'electron';
import { handleSearchInput } from '../../lib/search/handlers';
import { handleSaveSnippet } from '../../lib/snippet/handlers';
import { CH } from './types';

export default function initIpc() {
  ipcMain.handle('snippet:save' as CH, handleSaveSnippet);
  ipcMain.handle('search:send' as CH, handleSearchInput);
}
