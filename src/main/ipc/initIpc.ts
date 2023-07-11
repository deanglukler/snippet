import { handleSearchInput } from '../../lib/search/handlers.ipc';
import {
  handleCopySnippet,
  handleSaveSnippet,
} from '../../lib/snippet/handlers.ipc';
import { handleGetTags } from '../../lib/tags/handlers.ipc';
import { IPCMainHandler } from './IPCMainHandler';

export default function initIpc() {
  new IPCMainHandler('snippet:save', handleSaveSnippet).handle();
  new IPCMainHandler('snippet:copy', handleCopySnippet).handle();
  new IPCMainHandler('search:send', handleSearchInput).handle();
  new IPCMainHandler('tags:get', handleGetTags).handle();
}
