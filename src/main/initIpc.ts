import SnippetHandlers from './snippet/SnippetMainIPCHandlers';
import { ipcMain } from 'electron';
import { IPC, IPCHandler } from '../types';
import PrefMainIPCHandlers from './preferences/PrefMainIPCHandlers';
import TagHandlers from './snippet/TagHandlers';
import getPreferences from './preferences/getPreferences';

function ipcHandler<CH extends keyof IPC>(
  channel: CH,
  handler: IPCHandler<CH>
) {
  ipcMain.handle(channel, handler);
}

export default function initIpc() {
  ipcHandler('snippets:get-all', SnippetHandlers.getAllSnippets);
  ipcHandler('snippet:save', SnippetHandlers.save);
  ipcHandler('snippet:delete', SnippetHandlers.delete);
  ipcHandler('snippet:update-liked', SnippetHandlers.updateLiked);
  ipcHandler('tag:rename', TagHandlers.rename);
  ipcHandler('tag:get-all', TagHandlers.selectAll);
  ipcHandler('snippet:copy-to-clipboard', SnippetHandlers.copy);
  ipcHandler('preferences:get', getPreferences);
  ipcHandler('preferences:update', PrefMainIPCHandlers.updatePreference);
}
