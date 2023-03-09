import { ipcMain } from 'electron';
import { handleSearchInput } from '../../lib/search/handlers';
import {
  handleCopySnippet,
  handleSaveSnippet,
} from '../../lib/snippet/handlers';
import { handleGetTags } from '../../lib/tags/handlers';
import { INVOKERS_CHANNELS } from './types';

export default function initIpc() {
  ipcMain.handle('snippet:save' as INVOKERS_CHANNELS, handleSaveSnippet);
  ipcMain.handle('snippet:copy' as INVOKERS_CHANNELS, handleCopySnippet);
  ipcMain.handle('search:send' as INVOKERS_CHANNELS, handleSearchInput);
  ipcMain.handle('tags:get' as INVOKERS_CHANNELS, handleGetTags);
}
