import { useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';
import { Button, Input, Divider, Tooltip } from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  HeartTwoTone,
  HeartOutlined,
  TagsTwoTone,
  TagsOutlined,
} from '@ant-design/icons';
import SnippetList from './SnippetList';
import SnippetActions from '../snippet/SnippetActions';
import { useA, useS } from '../store';
import _ from 'lodash';
import SnippetCreator from './SnippetCreator';
import SearchTagList from './SearchTagList';
import { useNavigate } from 'react-router-dom';
import PreferencesActions from '../preferences/PreferencesActions';
import useSnippetFetcher from '../hooks/useSnippetFetcher';

export default function Homescreen() {
  useIPC();
  const setSnippetSearch = useA((a) => a.searchParams.set);
  const searchParams = useS((s) => s.searchParams);
  const snippetEditor = useS((s) => s.snippetEditor);
  const snippetUpdaterActions = useA((a) => a.snippetEditor);
  const prefs = useS((s) => s.preferences);
  const prefsActions = useA((a) => a.preferences);

  const navigate = useNavigate();

  useSnippetFetcher();

  useEffect(() => {
    SnippetActions.refreshTagOptions();
    const tagOptionsSync = setInterval(() => {
      SnippetActions.refreshTagOptions();
    }, 2000);

    return () => {
      clearInterval(tagOptionsSync);
    };
  }, []);

  useEffect(() => {
    const tima = setInterval(async () => {
      try {
        const txt = await navigator.clipboard.readText();
        if (txt && snippetEditor.noTextInClipboard) {
          snippetUpdaterActions.set({ noTextInClipboard: false });
        }
        if (!txt && !snippetEditor.noTextInClipboard) {
          snippetUpdaterActions.set({ noTextInClipboard: true });
        }
      } catch (err) {
        if (!snippetEditor.noTextInClipboard) {
          snippetUpdaterActions.set({ noTextInClipboard: true });
        }
      }
    }, 500);

    return () => {
      clearInterval(tima);
    };
  }, [snippetUpdaterActions, snippetEditor.noTextInClipboard]);

  function newSnippetButtonDisabled(): {
    disabled: boolean;
    text: string;
  } {
    if (snippetEditor.noTextInClipboard)
      return { disabled: true, text: 'Copy Text to Create' };
    if (snippetEditor.body)
      return { disabled: true, text: 'Creation in Progress' };
    return { disabled: false, text: 'New Snippet' };
  }

  const showOnlyLikedSnippetsUpdater = async (b: boolean) => {
    const p = await PreferencesActions.updateShowOnlyLikedSnippets(b);
    prefsActions.set({
      showOnlyLikedSnippets: p.showOnlyLikedSnippets,
    });
  };

  const showTagsUpdater = async (b: boolean) => {
    if (b === false) {
      setSnippetSearch({
        searchTags: [],
      });
    }
    const p = await PreferencesActions.updateShowTags(b);
    prefsActions.set({
      showTags: p.showTags,
    });
  };

  return (
    <div
      style={{
        minWidth: '515px',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        height: '100vh',
        display: 'grid',
        gridTemplateRows:
          '[header] min-content [search] min-content [new-snippet] min-content [snippet-list] auto',
        padding: '0 10px',
      }}
    >
      <div>
        <div
          style={{
            gridRow: 'header / new-snippet',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 25,
          }}
        >
          <Input
            onChange={(e) => {
              setSnippetSearch({ searchText: e.target.value });
            }}
            value={searchParams.searchText}
            placeholder="Search snippets"
            style={{ width: '100%', maxWidth: 300 }}
          />
          <div style={{ display: 'flex' }}>
            {prefs.showOnlyLikedSnippets && (
              <Tooltip title="Show All">
                <Button
                  onClick={() => showOnlyLikedSnippetsUpdater(false)}
                  shape="circle"
                  type="primary"
                  icon={<HeartTwoTone />}
                />
              </Tooltip>
            )}
            {!prefs.showOnlyLikedSnippets && (
              <Tooltip title="Only Liked">
                <Button
                  onClick={() => showOnlyLikedSnippetsUpdater(true)}
                  type="ghost"
                  shape="circle"
                  icon={<HeartOutlined />}
                />
              </Tooltip>
            )}
            {prefs.showTags && (
              <Tooltip title="Hide Tags">
                <Button
                  onClick={() => showTagsUpdater(false)}
                  shape="circle"
                  type="primary"
                  icon={<TagsTwoTone />}
                />
              </Tooltip>
            )}
            {!prefs.showTags && (
              <Tooltip title="Show Tags">
                <Button
                  onClick={() => showTagsUpdater(true)}
                  type="ghost"
                  shape="circle"
                  icon={<TagsOutlined />}
                />
              </Tooltip>
            )}
            <Tooltip title="Preferences">
              <Button
                onClick={() => {
                  navigate('/preferences');
                }}
                type="ghost"
                shape="circle"
                icon={<SettingOutlined />}
              />
            </Tooltip>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={SnippetActions.initializeNew}
              onMouseEnter={SnippetActions.setSnippetBodyPreviewFromClipboard}
              onMouseLeave={SnippetActions.clearSnippetBodyPreview}
              disabled={newSnippetButtonDisabled().disabled}
              style={{ marginLeft: 10 }}
            >
              {newSnippetButtonDisabled().text}
            </Button>
          </div>
        </div>
      </div>
      <div style={{ gridRow: 'search' }}>
        {prefs.showTags && <SearchTagList />}
        <Divider />
      </div>
      <div style={{ gridRow: 'new-snippet' }}>
        <SnippetCreator />
      </div>
      <div
        style={{
          gridRow: 'snippet-list',
          overflowY: 'scroll',
          paddingRight: 5,
          marginRight: -5,
        }}
        className="scrollbar-style"
      >
        <SnippetList />
      </div>
    </div>
  );
}
