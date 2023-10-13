import { DB } from './types';

const prefs: DB['preferences'] = Object.freeze({
  iconInTray: true,
  showOnlyLikedSnippets: false,
  showTags: false,
  colorScheme: 'system',
});

export default prefs;
