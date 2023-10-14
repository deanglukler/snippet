import db from '../db/db';

export default async function () {
  const res = await db.selectBy('preferences', { version: '0.0.0' });
  const prefs = res[0];

  if (!prefs) {
    throw new Error('preferences not found :S');
  }
  return prefs;
}
