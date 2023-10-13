import { DB } from '../../types';
import database, { COLLECTION } from '../database';

export default async function () {
  const db = await database;
  const prefsCollection = db.getCollection<DB['preferences']>(
    COLLECTION.PREFERENCES
  );

  const prefs = prefsCollection.findOne();
  if (!prefs) {
    throw new Error('preferences not found');
  }
  return prefs;
}
