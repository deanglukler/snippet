import { DB } from '../../types';
import { COLLECTION } from '../db/collection';
import connection from '../db/connection';

export default async function () {
  const db = await connection;
  const prefsCollection = db.getCollection<DB['preferences']>(
    COLLECTION.PREFERENCES
  );

  const prefs = prefsCollection.findOne();
  if (!prefs) {
    throw new Error('preferences not found');
  }
  return prefs;
}
