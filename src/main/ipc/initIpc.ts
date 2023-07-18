import { handleSearchInput } from '../../lib/search/handlers.ipc';
import {
  handleCopySnippet,
  handleDeleteSnippet,
  handleSaveSnippet,
} from '../../lib/snippet/handlers.ipc';
import { handleGetTags } from '../../lib/tags/handlers.ipc';
import { IPCMain } from './IPCMainHandler';

export default function initIpc() {
  IPCMain.Handle('snippet:save', handleSaveSnippet);
  IPCMain.Handle('snippet:copy', handleCopySnippet);
  IPCMain.Handle('search:send', handleSearchInput);
  IPCMain.Handle('snippet:delete', handleDeleteSnippet);
  IPCMain.Handle('tags:get', handleGetTags);
}
