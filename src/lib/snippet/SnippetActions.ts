import { SNIPPET_SCHEMA } from '../../schema/SNIPPET_SCHEMA';
import store from '../store';
import { errorAndToast } from '../toast';

const submit = () => {
  const { body, title, tags } = store.getState().snippetUpdater;
  const snippet = {
    body,
    title,
    metadata: {
      tags,
      timestampMili: Date.now(),
    },
  };

  try {
    SNIPPET_SCHEMA.validateSync(snippet);
  } catch (error) {
    errorAndToast((error as any).message);
    return;
  }

  window.electron.ipcRenderer
    .saveSnippet(snippet)
    .then(() => {
      clearSnippetUpdaterData();
      return null;
    })
    .catch((err) => {
      console.error(err);
    });
};

async function setSnippetBodyFromClipboard() {
  let text = '';
  try {
    text = await navigator.clipboard.readText();
    if (!text) throw new Error('Text in clipboard empty');
  } catch (err) {
    errorAndToast(
      'No text in clipboard.  Copy text to start creating snippet.'
    );
  }
  store
    .getActions()
    .snippetUpdater.set({ body: await navigator.clipboard.readText() });
}

function setNewSnippetTitleToDefault() {
  store.getActions().snippetUpdater.set({ title: 'Snippet Title...' });
}

function clearSnippetUpdaterData() {
  store.getActions().snippetUpdater.set({ body: '', title: '', tags: [] });
}

function initializeNew() {
  setNewSnippetTitleToDefault();
  setSnippetBodyFromClipboard();
}

export default {
  submit,
  setSnippetBodyFromClipboard,
  setNewSnippetTitleToDefault,
  initializeNew,
  clearSnippetUpdaterData,
};
