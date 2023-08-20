import _ from 'lodash';
import { SNIPPET_SCHEMA } from '../../schema/SNIPPET_SCHEMA';
import store from '../store';
import { errorAndToast } from '../toast';
import { SnippetMetaData } from '../../types';

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

async function setSnippetBodyPreviewFromClipboard() {
  let text = '';
  try {
    text = await navigator.clipboard.readText();
    if (!text) throw new Error('Text in clipboard empty');
  } catch (err) {
    errorAndToast(
      'No text in clipboard.  Copy text to start creating snippet.'
    );
  }
  store.getActions().snippetUpdater.set({ bodyPreview: text });
}

function clearSnippetBodyPreview() {
  store.getActions().snippetUpdater.set({ bodyPreview: '' });
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
  clearSnippetBodyPreview();
}

function refreshTagOptions() {
  return window.electron.ipcRenderer.getTags().then((tags) => {
    const currentTagOptions = store.getState().snippetSearch.tagOptions;
    if (!_.isEqual(tags, currentTagOptions)) {
      store.getActions().snippetSearch.set({ tagOptions: tags });
    }
    return null;
  });
}

function searchTagClick(tag: string) {
  const st = store.getState().snippetSearch.searchTags;
  store.getActions().snippetSearch.set({ searchTags: [..._.xor(st, [tag])] });
}

async function updateSnippetMetadata(
  snippetTitle: string,
  metadata: Partial<SnippetMetaData>
) {
  const updatedMetadata =
    await window.electron.ipcRenderer.updateSnippetMetadata({
      snippetTitle,
      metadata,
    });
  if (!updatedMetadata) {
    return console.warn('snippet metadata is null and it shouldnt be');
  }
  const snippets = [...store.getState().snippetSearch.results];
  const snippetIndex = snippets.findIndex((a) => a.title === snippetTitle);
  if (snippetIndex > -1) {
    snippets[snippetIndex].metadata = updatedMetadata;
    store.getActions().snippetSearch.set({ results: snippets });
  }
  return null;
}

export default {
  submit,
  setSnippetBodyFromClipboard,
  setSnippetBodyPreviewFromClipboard,
  clearSnippetBodyPreview,
  setNewSnippetTitleToDefault,
  initializeNew,
  clearSnippetUpdaterData,
  refreshTagOptions,
  searchTagClick,
  updateSnippetMetadata,
};
