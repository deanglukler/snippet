import { DB } from './types';

const state: DB = Object.freeze({
  preferences: {
    version: '0.0.0',
    iconInTray: true,
    showOnlyLikedSnippets: false,
    showTags: false,
    colorScheme: 'system',
  },
});

const getState = () => ({ ...state });

export default getState;
