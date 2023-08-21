import { Preferences } from './types';

const prefs: Preferences = Object.freeze({
  iconInTray: { value: true, category: 'user' },
  showOnlyLikedSnippets: { value: false, category: 'homepage' },
  showTags: { value: false, category: 'homepage' },
});

export default prefs;
