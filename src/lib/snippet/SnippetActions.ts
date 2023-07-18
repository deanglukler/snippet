import { SNIPPET_SCHEMA } from '../../schema/SNIPPET_SCHEMA';
import store from '../store';
import { clearSnippetUpdaterData } from '../storeActions';
import { errorAndToast } from '../toast';

export class SnippetActions {
  static Submit() {
    const { body, title, tags } = store.getState().snippetUpdater;
    const snippet = {
      body,
      title,
      metadata: {
        tags,
        timestampMili: Date.now(),
      },
    };

    try {
      SNIPPET_SCHEMA.validateSync(snippet);
    } catch (error) {
      errorAndToast((error as any).message);
      return;
    }

    window.electron.ipcRenderer
      .saveSnippet(snippet)
      .then(() => {
        clearSnippetUpdaterData();
        return null;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
