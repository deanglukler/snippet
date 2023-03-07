import { snippets } from '../snippet/util';
import { SnippetMetaData } from '../snippet/types';
import dbPromise, { COL } from '../../main/database';
import _ from 'lodash';
import log from '../util/log';

/**
 * sync the tags found in all files to the database.
 * should be run when app starts
 */
export async function mainSyncTags() {
  // loop through all snippets
  log('SYNC TAGS STARTING...');
  const foundTags: { [key: string]: string } = {};
  const snipps = await snippets();
  snipps.forEach(({ metadata }) => {
    if (_.isNil(metadata)) {
      log('metadata nil');
      return;
    }
    const { tags } = JSON.parse(metadata) as SnippetMetaData;
    tags.forEach((tag) => {
      foundTags[tag] = tag;
    });
  });
  log('SYNC TAGS: found: ' + _.keys(foundTags).length + ' tags');

  const db = await dbPromise;
  const tagsCollection = db.getCollection(COL.TAGS);

  // Clear out the existing tags in the collection
  tagsCollection.clear();

  // Add the new tags from the list
  _.keys(foundTags).forEach((tag) => {
    tagsCollection.insert({ name: tag });
  });

  db.saveDatabase();
}
