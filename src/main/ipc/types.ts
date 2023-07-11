import { IpcMainInvokeEvent } from 'electron';

export type INVOKERS_CHANNELS =
  | 'snippet:save'
  | 'search:send'
  | 'tags:get'
  | 'snippet:copy';

export type IPCMainHandlerFunction<D, R> = (
  event: IpcMainInvokeEvent,
  data: D
) => Promise<R>;

export interface IPCMainHandlerInterface {
  handle: () => void;
}
