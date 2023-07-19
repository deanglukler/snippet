import SnippetHandlers from '../../lib/snippet/SnippetMainIPCHandlers';
import { ipcMain } from 'electron';
import { INVOKERS_CHANNELS, IPCMainEventHandlerFn } from '../../types';

function mainIPCChannelHandler<
  Channel extends string = INVOKERS_CHANNELS,
  Handler extends IPCMainEventHandlerFn = () => void
>(channel: Channel, handler: Handler) {
  ipcMain.handle(channel, handler);
}

export default function initIpc() {
  mainIPCChannelHandler('snippet:save', SnippetHandlers.save);
  mainIPCChannelHandler('snippet:copy', SnippetHandlers.copy);
  mainIPCChannelHandler('snippet:delete', SnippetHandlers.delete);
  mainIPCChannelHandler('search:send', SnippetHandlers.search);
  mainIPCChannelHandler('tags:get', SnippetHandlers.getTags);
}
