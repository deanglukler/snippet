import { ipcMain } from 'electron';
import { INVOKERS_CHANNELS } from './types';

export class IPCMain {
  static Handle<
    Channel extends string = INVOKERS_CHANNELS,
    Handler extends (
      event: Electron.IpcMainInvokeEvent,
      ...args: any[]
    ) => any = () => void
  >(channel: Channel, handler: Handler) {
    ipcMain.handle(channel, handler);
  }
}
