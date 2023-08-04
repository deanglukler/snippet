import { IpcMainInvokeEvent } from 'electron';

export type INVOKERS_CHANNELS =
  | 'snippet:save'
  | 'search:send'
  | 'tags:get'
  | 'snippet:copy'
  | 'snippet:delete'
  | 'preferences:get';

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

type PreferenceCategory = 'user';

export type PreferenceString = {
  preference: string;
  value: string;
  category: PreferenceCategory;
};

export type PreferenceBoolean = {
  preference: string;
  value: boolean;
  category: PreferenceCategory;
};

export interface SnippetMetaData {
  tags: string[];
  timestampMili: number;
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

export type TagList = string[];

export type SearchParams = {
  text?: string;
  tags?: string[];
};
