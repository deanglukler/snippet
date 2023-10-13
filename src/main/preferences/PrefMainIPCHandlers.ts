import { log } from 'console';
import { DB, IPCMainHandlerFunction, PreferenceName } from '../../types';
import getPreferences from './getPreferences';
import _ from 'lodash';
import connection from '../db/connection';
import { COLLECTION } from '../db/collection';
import initState from '../../initState';

const updatePreference: IPCMainHandlerFunction<
  {
    name: PreferenceName;
    value: DB['preferences'][PreferenceName];
  },
  DB['preferences']
> = async (_e, data) => {
  const db = await connection;
  const prefsCollection = db.getCollection<DB['preferences']>(
    COLLECTION.PREFERENCES
  );
  const prefs = prefsCollection.findOne();
  if (!prefs) {
    throw new Error('preferences not found');
  }
  if (!_.has(prefs, data.name)) {
    log(`cannot find prefs with name '${data.name}', adding now`);
    // @ts-ignore
    prefs[data.name] = initState().preferences[data.name];
  }
  // @ts-ignore
  prefs[data.name] = data.value;
  prefsCollection.update(prefs);
  db.saveDatabase();
  const updatedPrefs = prefsCollection.findOne();
  if (!updatedPrefs) {
    throw new Error('preferences not found');
  }
  return updatedPrefs;
};

export default {
  getPreferences,
  updatePreference,
};
