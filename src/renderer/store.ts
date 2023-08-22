import {
  action,
  Computed,
  computed,
  createStore,
  createTypedHooks,
  State,
} from 'easy-peasy';
import { createLogger } from 'redux-logger';
import { Preferences, SnippetData } from '../types';
import initPreferences from '../initPreferences';

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

class SnippetUpdaterModel extends ActionsBase<State<SnippetUpdaterModel>> {
  body = '';
  title = '';
  tags: string[] = [];
  isValid: Computed<SnippetUpdaterModel, boolean> = computed<
    SnippetUpdaterModel,
    boolean
  >((state) => {
    if (!state.title) return false;
    if (!state.body) return false;
    return true;
  });
  bodyPreview = '';
  noTextInClipboard = true;
}

class SnippetSearchModel extends ActionsBase<State<SnippetSearchModel>> {
  searchText = '';
  searchTags: string[] = [];
  tagOptions: string[] = [];
  results: SnippetData[] = [];
}

class PreferencesModel extends ActionsBase<State<PreferencesModel>> {
  iconInTray: Preferences['iconInTray'] = initPreferences.iconInTray;
  showOnlyLikedSnippets: Preferences['showOnlyLikedSnippets'] =
    initPreferences.showOnlyLikedSnippets;
  showTags: Preferences['showTags'] = initPreferences.showTags;
}

interface StoreModel {
  snippetUpdater: SnippetUpdaterModel;
  snippetSearch: SnippetSearchModel;
  preferences: PreferencesModel;
}

const storeModel: StoreModel = {
  snippetUpdater: { ...new SnippetUpdaterModel() },
  snippetSearch: { ...new SnippetSearchModel() },
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
