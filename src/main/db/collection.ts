import { DBModels } from '../../types';

export const COLLECTION: { [key: string]: keyof DBModels } = {
  PREFERENCES: 'preferences',
  TAGS: 'tags',
  SNIPPETS: 'snippets',
};
