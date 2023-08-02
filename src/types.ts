import { IpcMainInvokeEvent } from 'electron';

export type INVOKERS_CHANNELS =
  | 'snippet:save'
  | 'search:send'
  | 'tags:get'
  | 'snippet:copy'
  | 'snippet:delete';

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
