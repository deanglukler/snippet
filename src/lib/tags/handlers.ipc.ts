import { IpcMainInvokeEvent } from 'electron';
import dbPromise, { COL } from '../../main/database';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';

export async function handleGetTags(
  _event: IpcMainInvokeEvent
): Promise<string[]> {
  try {
    const tags = await getAllTags();
    return tags;
  } catch (error) {
    sendErrorToRenderer(error);
    return [];
  }
}

async function getAllTags(): Promise<string[]> {
  const db = await dbPromise;
  const tagsCollection = db.getCollection(COL.TAGS);

  const tags = tagsCollection.find();

  const tagNames = tags.map((tag) => tag.name);

  return tagNames;
}
