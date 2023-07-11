import { ipcMain } from 'electron';
import {
  INVOKERS_CHANNELS,
  IPCMainHandlerFunction,
  IPCMainHandlerInterface,
} from './types';

export class IPCMainHandler<D = undefined, R = void>
  implements IPCMainHandlerInterface
{
  constructor(
    private channel: INVOKERS_CHANNELS,
    private handler: IPCMainHandlerFunction<D, R>
  ) {}

  handle() {
    ipcMain.handle(this.channel, this.handler);
  }
}
