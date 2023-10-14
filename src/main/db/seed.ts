import log from '../log';
import { COLLECTION } from './collection';
import db from './db';
import InitState from '../../initState';

export default async function seed() {
  log('Checking and seeding database...');

  for (const key in COLLECTION) {
    if (key === 'PREFERENCES') {
      await db.insert('preferences', {
        ...InitState.preferences,
      });
      continue;
    }

    if (key === 'TAGS') {
      continue;
    }

    if (key === 'SNIPPETS') {
      continue;
    }

    throw new Error('Seeding not implemented for collection ' + key);
  }

  log('Done... Seeded database!');
}
