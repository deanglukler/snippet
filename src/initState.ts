import { DBModels } from './types';

export default class InitState {
  static get preferences(): DBModels['preferences'] {
    return {
      version: '0.0.0',
      iconInTray: true,
      showOnlyLikedSnippets: false,
      showTags: false,
      colorScheme: 'system',
    };
  }
}
