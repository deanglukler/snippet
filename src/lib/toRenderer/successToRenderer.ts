import _ from 'lodash';

import { window } from '../../main/appReady';

export default function (msg: string) {
  if (_.isObject(window)) {
    window.webContents.send('IPC:SUCCESS_IN_MAIN', msg);
  }
}
