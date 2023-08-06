import { Preferences } from '../../types';
import database, { COLLECTION } from '../database';

export default async function () {
  const db = await database;
  const prefsCollection = db.getCollection<Preferences>(COLLECTION.PREFERENCES);

  const prefs = prefsCollection.findOne();
  if (!prefs) {
    throw new Error('preferences not found');
  }
  return prefs;
}
