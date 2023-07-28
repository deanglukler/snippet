import { action, createStore, createTypedHooks, State } from 'easy-peasy';
import { createLogger } from 'redux-logger';
import { SnippetData } from './snippet/types';

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
}

class SnippetSearchModel extends ActionsBase<State<SnippetSearchModel>> {
  searchText = '';
  results: SnippetData[] = [];
}

interface StoreModel {
  snippetUpdater: SnippetUpdaterModel;
  snippetSearch: SnippetSearchModel;
}

const storeModel: StoreModel = {
  snippetUpdater: { ...new SnippetUpdaterModel() },
  snippetSearch: { ...new SnippetSearchModel() },
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
