import { clipboard } from 'electron';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import successToRenderer from '../toRenderer/successToRenderer';
import logAndThrow from '../logAndThrow';
import { IPCHandler, DBModels, LokiItem, Snippets } from '../../types';

import TagHandlers from './TagHandlers';
import db from '../db/db';

const getAllSnippets: IPCHandler<'snippets:get-all'> = async () => {
  const allTags = await db.selectAll('tags');

  const snippetWithTags = (s: LokiItem<DBModels['snippets']>) => {
    const tagsList = allTags.filter((t) => t.snippetIds.includes(s.$loki));

    return {
      ...s,
      tags: tagsList,
    };
  };

  const snippets: Snippets = {};

  const allSnippets = await db.selectAll('snippets');
  allSnippets.forEach((s) => {
    snippets[s.$loki] = snippetWithTags(s);
  });

  return snippets;
};

const saveSnippet: IPCHandler<'snippet:save'> = async (_event, snippet) => {
  try {
    const existingWithSameTitle = await db.selectBy('snippets', {
      title: snippet.title,
    });

    if (existingWithSameTitle.length > 0) {
      logAndThrow('Snippet with this title already exists');
    }

    const item = await db.insert('snippets', {
      body: snippet.body,
      title: snippet.title,
      liked: snippet.liked,
    });

    for (let i = 0; i < snippet.tags.length; i++) {
      await TagHandlers.joinToSnippet(item, snippet.tags[i]);
    }

    successToRenderer('Saved!');
  } catch (error) {
    sendErrorToRenderer(error);
    throw error;
  }
};

const deleteSnippet: IPCHandler<'snippet:delete'> = async (_event, $loki) => {
  await db.deleteBy('snippets', { $loki });
};

const updateLiked: IPCHandler<'snippet:update-liked'> = async (
  _event,
  payload
) => {
  await db.update('snippets', payload.$loki, { liked: payload.liked });
};

const copySnippet: IPCHandler<'snippet:copy-to-clipboard'> = async (
  _event,
  body: string
) => {
  clipboard.writeText(body);
};

export default {
  getAllSnippets,
  copy: copySnippet,
  save: saveSnippet,
  delete: deleteSnippet,
  updateLiked,
};
