import { DBModels, IPCHandler, LokiItem } from '../../types';
import db from '../db/db';

async function selectAll() {
  const tags = await db.selectAll('tags');
  return tags;
}

async function joinToSnippet(
  snippet: LokiItem<DBModels['snippets']>,
  tagTitle: string
) {
  const tags = await db.selectBy('tags', { title: tagTitle });
  let tag = tags[0];
  if (!tag) {
    tag = await db.insert('tags', {
      title: tagTitle,
      snippetIds: [snippet.$loki],
    });
  } else {
    tag.snippetIds.push(snippet.$loki);
    await db.update('tags', tag.$loki, { snippetIds: tag.snippetIds });
  }
}

const rename: IPCHandler<'tag:rename'> = async (e, payload) => {
  await db.update('tags', payload.$loki, { title: payload.title });
};

export default {
  selectAll,
  joinToSnippet,
  rename,
};
