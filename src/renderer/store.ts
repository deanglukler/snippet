import {
  action,
  Computed,
  computed,
  createStore,
  createTypedHooks,
  State,
} from 'easy-peasy';
import { createLogger } from 'redux-logger';
import { DBModels, SnippetRenderer, Snippets, TagList } from '../types';
import InitState from '../initState';

class ActionsBase<T extends object = never> {
  set = action<T, Partial<T>>((state, setter) => {
    Object.keys(setter).forEach((k) => {
      // typescript doesn't like it but I cant find another way
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state[k] = setter[k];
    });
  });
}

class SnippetsModel extends ActionsBase<State<SnippetsModel>> {
  all: Snippets = {};
}

class SnippetEditorModel extends ActionsBase<State<SnippetEditorModel>> {
  body = '';
  title = '';
  tags: string[] = [];
  isValid: Computed<SnippetEditorModel, boolean> = computed<
    SnippetEditorModel,
    boolean
  >((state) => {
    if (!state.title) return false;
    if (!state.body) return false;
    return true;
  });
  bodyPreview = '';
  noTextInClipboard = true;
}

class SearchParamsModel extends ActionsBase<State<SearchParamsModel>> {
  searchText = '';
  searchTags: TagList = [];
  tagOptions: TagList = [];
}

class PreferencesModel extends ActionsBase<State<PreferencesModel>> {
  iconInTray: DBModels['preferences']['iconInTray'] =
    InitState.preferences.iconInTray;
  showOnlyLikedSnippets: DBModels['preferences']['showOnlyLikedSnippets'] =
    InitState.preferences.showOnlyLikedSnippets;
  showTags: DBModels['preferences']['showTags'] =
    InitState.preferences.showTags;
  colorScheme: DBModels['preferences']['colorScheme'] =
    InitState.preferences.colorScheme;
}

interface StoreModel {
  snippets: SnippetsModel;
  snippetEditor: SnippetEditorModel;
  searchParams: SearchParamsModel;
  preferences: PreferencesModel;
}

const storeModel: StoreModel = {
  snippets: { ...new SnippetsModel() },
  snippetEditor: { ...new SnippetEditorModel() },
  searchParams: { ...new SearchParamsModel() },
  preferences: { ...new PreferencesModel() },
};

const logger = createLogger({
  // ...options
});

const store = createStore(storeModel, {
  middleware: [logger],
});

const typedHooks = createTypedHooks<StoreModel>();
export const useA = typedHooks.useStoreActions;
export const useD = typedHooks.useStoreDispatch;
export const useS = typedHooks.useStoreState;

export default store;
