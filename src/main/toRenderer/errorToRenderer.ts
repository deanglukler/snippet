import _ from 'lodash';

import { window } from '../appReady';

export default function (e: unknown) {
  if (_.isNil(window)) return null;
  window.webContents.send('IPC:ERROR_IN_MAIN', e);
  return null;
}
