import { Button, Form, Input } from 'antd';
import { useA, useS } from '../../lib/store';
import Search from './Search';
import './styles.css';
import TagSelector from './TagSelector';
import * as yup from 'yup';
import { errorAndToast } from '../../lib/toast';

const allowedFilenameChars = /^[a-zA-Z0-9._-\s]+$/;

const SNIPPET_SCHEMA = yup.object().shape({
  body: yup.string().required(),
  title: yup
    .string()
    .matches(
      allowedFilenameChars,
      'Title can only contain letters, numbers, periods, underscores, and hyphens.'
    )
    .required(),
  metadata: yup
    .object()
    .shape({
      tags: yup.array(),
      timestampMili: yup.number(),
    })
    .required(),
});

export default function Homescreen() {
  const { body, title, tags } = useS((s) => s.snippetUpdater);
  const { set } = useA((a) => a.snippetUpdater);

  async function handlePaste() {
    try {
      set({ body: await navigator.clipboard.readText() });
    } catch (err) {
      errorAndToast('Error pasting');
    }
  }

  function clearForm() {
    set({ body: '', title: '', tags: [] });
  }

  async function onSubmit() {
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
        clearForm();
        return null;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      {!body && (
        <>
          <Button type="text" onClick={handlePaste}>
            paste
          </Button>
          <Search />
        </>
      )}
      {body && (
        <Form className="homescreen-form">
          <Form.Item>
            <Input
              type="text"
              placeholder="Enter Title.."
              value={title}
              onChange={({ target }) => set({ title: target.value })}
            />
          </Form.Item>
          <TagSelector />
          <code>{body}</code>
          <div>
            <Button type="text" onClick={handlePaste}>
              paste
            </Button>
            <Button type="primary" onClick={onSubmit}>
              submit
            </Button>
            <Button onClick={clearForm}>clear</Button>
          </div>
        </Form>
      )}
    </div>
  );
}
