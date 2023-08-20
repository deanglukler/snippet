import { Preferences } from './types';

const prefs: Preferences = {
  iconInTray: { value: true, category: 'user' },
  snippetsDirectory: { value: 'DEFAULT', category: 'user' },
  showOnlyLikedSnippets: { value: false, category: 'list' },
};

export default prefs;
