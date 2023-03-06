import { window } from '../../main/appReady';
import _ from 'lodash';
import { Channels } from '../../main/preload';

export default function dataToRenderer(ch: Channels, data: any) {
  if (_.isNil(window)) return null;
  window.webContents.send(ch, data);
  return null;
}
