import store from './store';
import { errorAndToast } from './toast';

export async function setSnippetBodyFromClipboard() {
  try {
    store
      .getActions()
      .snippetUpdater.set({ body: await navigator.clipboard.readText() });
  } catch (err) {
    errorAndToast('Error pasting');
  }
}

export function clearSnippetUpdaterData() {
  store.getActions().snippetUpdater.set({ body: '', title: '', tags: [] });
}
