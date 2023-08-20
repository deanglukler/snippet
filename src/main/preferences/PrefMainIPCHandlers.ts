import { log } from 'console';
import {
  Preferences,
  IPCMainHandlerFunction,
  PreferenceName,
} from '../../types';
import database, { COLLECTION } from '../database';
import getPreferences from './getPreferences';
import initPreferences from '../../initPreferences';

const updatePreference: IPCMainHandlerFunction<
  {
    name: PreferenceName;
    value: any;
  },
  Preferences
> = async (_e, data) => {
  const db = await database;
  const prefsCollection = db.getCollection<Preferences>(COLLECTION.PREFERENCES);
  const prefs = prefsCollection.findOne();

  if (!prefs) {
    throw new Error('preferences not found');
  }

  if (!prefs[data.name]) {
    log(`cannot find prefs with name '${data.name}', adding now`);
    // @ts-ignore
    prefs[data.name] = initPreferences[data.name];
  }

  prefs[data.name].value = data.value;
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
