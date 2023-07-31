import { SnippetMetaData } from './types';
import _ from 'lodash';
import log from '../util/log';
import findSnippets from './findSnippets';

export default async function () {
  const foundTags: string[] = [];
  const snipps = await findSnippets();
  snipps.forEach(({ metadata }) => {
    if (_.isNil(metadata)) {
      log('metadata nil???');
      return;
    }
    const { tags } = JSON.parse(metadata) as SnippetMetaData;
    tags.forEach((tag) => {
      if (!_.includes(foundTags, tag)) {
        foundTags.push(tag);
      }
    });
  });

  return foundTags;
}
