export type DefaultChannels =
  | 'IPC:ERROR_IN_MAIN'
  | 'IPC:SUCCESS_IN_MAIN'
  | 'IPC:ROUTE';

export type IPC = {
  'snippets:get-all': {
    invoke: void;
    return: Snippets;
  };
  'snippet:save': {
    invoke: SnippetPreSave;
    return: void;
  };
  'snippet:delete': {
    invoke: number;
    return: void;
  };
  'snippet:update-liked': {
    invoke: { $loki: number; liked: boolean };
    return: void;
  };
  'tag:rename': {
    invoke: { $loki: number; title: string };
    return: void;
  };
  'tag:get-all': {
    invoke: void;
    return: TagList;
  };
  'snippet:copy-to-clipboard': {
    invoke: string;
    return: void;
  };
  'preferences:get': {
    invoke: void;
    return: DBModels['preferences'];
  };
  'preferences:update': {
    invoke: { name: PreferenceName; value: any };
    return: DBModels['preferences'];
  };
};

export type IPCHandler<CH extends keyof IPC> = (
  event: Electron.IpcMainInvokeEvent,
  payload: IPC[CH]['invoke']
) => Promise<IPC[CH]['return']>;

export type LokiItem<T> = T & LokiObj;

export type DBModels = {
  preferences: {
    version: '0.0.0';
    iconInTray: boolean;
    showOnlyLikedSnippets: boolean;
    showTags: boolean;
    colorScheme: ColorScheme;
  };
  tags: {
    title: string;
    snippetIds: number[];
  };
  snippets: {
    title: string;
    body: string;
    liked: boolean;
  };
};

export type PreferenceName = keyof DBModels['preferences'];

export type Snippets = {
  [key: number]: SnippetRenderer;
};

type SnippetBase = {
  title: string;
  body: string;
  liked: boolean;
};

export type SnippetRenderer = SnippetBase & {
  $loki: number;
  tags: TagList;
};

export type SnippetPreSave = SnippetBase & {
  tags: string[];
};

export type IPCUpdateSnippetLiked = { snippetTitle: string; liked: boolean };

export type TagRenderer = LokiItem<DBModels['tags']>;
export type TagList = TagRenderer[];

export type SearchParams = {
  text?: string;
  tags?: TagList;
};

//

// config
export type ROUTES = '/' | '/preferences';
export type ColorScheme = 'light' | 'dark' | 'system';
