import _ from 'lodash';
import { SNIPPET_SCHEMA } from '../../schema/SNIPPET_SCHEMA';
import store from '../store';
import { errorAndToast } from '../toast';
import { TagRenderer } from '../../types';

function getAllSnippets() {
  window.electron.ipcRenderer.getAllSnippets().then((snippets) => {
    store.getActions().snippets.set({ all: snippets });
    return null;
  });
}

function submit() {
  const { body, title, tags } = store.getState().snippetEditor;
  const snippet = {
    body,
    title,
    tags,
    liked: false,
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
      getAllSnippets();
      return null;
    })
    .catch((err) => {
      console.error(err);
    });
}

function deleteSnippet(snippetTitle: number) {
  window.electron.ipcRenderer
    .deleteSnippet(snippetTitle)
    .then(() => {
      getAllSnippets();
      return null;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getBodyFromClipboard(): Promise<string> {
  let text = '';
  try {
    text = await navigator.clipboard.readText();
    if (!text) throw new Error('Text in clipboard empty');
  } catch (err) {
    errorAndToast(
      'No text in clipboard.  Copy text to start creating snippet.'
    );
  }

  return text;
}

async function setSnippetBodyFromClipboard() {
  store.getActions().snippetEditor.set({ body: await getBodyFromClipboard() });
}

async function setSnippetBodyPreviewFromClipboard() {
  store
    .getActions()
    .snippetEditor.set({ bodyPreview: await getBodyFromClipboard() });
}

function clearSnippetBodyPreview() {
  store.getActions().snippetEditor.set({ bodyPreview: '' });
}

function setNewSnippetTitleToDefault() {
  store.getActions().snippetEditor.set({ title: 'Snippet Title...' });
}

function clearSnippetUpdaterData() {
  store.getActions().snippetEditor.set({ body: '', title: '', tags: [] });
}

function initializeNew() {
  setNewSnippetTitleToDefault();
  setSnippetBodyFromClipboard();
  clearSnippetBodyPreview();
}

function refreshTagOptions() {
  return window.electron.ipcRenderer.getTags().then((tags) => {
    const currentTagOptions = store.getState().searchParams.tagOptions;
    if (!_.isEqual(tags, currentTagOptions)) {
      store.getActions().searchParams.set({ tagOptions: tags });
    }
    return null;
  });
}

function searchTagClick(tag: TagRenderer) {
  const st = store.getState().searchParams.searchTags;
  if (st.findIndex((t) => t.$loki === tag.$loki) !== -1) {
    store.getActions().searchParams.set({
      searchTags: st.filter((t) => t.$loki !== tag.$loki),
    });
  } else {
    store.getActions().searchParams.set({ searchTags: [...st, tag] });
  }
}

async function updateSnippetLiked($loki: number, liked: boolean) {
  await window.electron.ipcRenderer.updateSnippetLiked({
    $loki,
    liked,
  });
  getAllSnippets();
}

export default {
  submit,
  getAllSnippets,
  deleteSnippet,
  setSnippetBodyFromClipboard,
  setSnippetBodyPreviewFromClipboard,
  clearSnippetBodyPreview,
  setNewSnippetTitleToDefault,
  initializeNew,
  clearSnippetUpdaterData,
  refreshTagOptions,
  searchTagClick,
  updateSnippetLiked,
};
