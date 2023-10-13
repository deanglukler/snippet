import { IpcMainInvokeEvent } from 'electron';

export type INVOKERS_CHANNELS =
  | 'snippet:save'
  | 'snippet:update-metadata'
  | 'search:send'
  | 'tags:get'
  | 'snippet:copy'
  | 'snippet:delete'
  | 'preferences:get'
  | 'preferences:update';

export type ROUTES = '/' | '/preferences';

export type IPCMainHandlerFunction<
  DataIn = any,
  Return = void,
  E = IpcMainInvokeEvent
> = (event: E, data: DataIn) => Promise<Return>;

export type IPCMainEventHandlerFn = (
  event: Electron.IpcMainInvokeEvent,
  ...args: any[]
) => any;

export type ColorScheme = 'light' | 'dark' | 'system';

export type DB = {
  preferences: {
    iconInTray: boolean;
    showOnlyLikedSnippets: boolean;
    showTags: boolean;
    colorScheme: ColorScheme;
  };
};

export type PreferenceName = keyof DB['preferences'];

export interface SnippetMetaData {
  tags: string[];
  timestampMili: number;
  liked: boolean;
}

export interface SnippetData {
  title: string;
  body: string;
  metadata: SnippetMetaData;
}

export interface SnippetDataSerialized {
  title: string;
  body: string;
  metadata: string;
}

export type SnippetMetadataUpdate = {
  snippetTitle: string;
  metadata: Partial<SnippetMetaData>;
};

export type TagList = string[];

export type SearchParams = {
  text?: string;
  tags?: string[];
};
