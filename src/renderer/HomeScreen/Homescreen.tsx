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
import { SearchParams } from '../../types';
import { useNavigate } from 'react-router-dom';
import PreferencesActions from '../preferences/PreferencesActions';

const debouncedSearch = _.debounce((searchParams?: SearchParams) =>
  window.electron.ipcRenderer.sendSearch(searchParams)
);
export default function Homescreen() {
  useIPC();
  const setSnippetSearch = useA((a) => a.snippetSearch.set);
  const snippetSearch = useS((s) => s.snippetSearch);
  const snippetUpdater = useS((s) => s.snippetUpdater);
  const prefs = useS((s) => s.preferences);
  const prefsActions = useA((a) => a.preferences);

  const navigate = useNavigate();

  useEffect(() => {
    function setInitialStoreState() {
      window.electron.ipcRenderer.sendSearch();
    }
    setInitialStoreState();
  }, []);

  useEffect(() => {
    const searchTimer = setInterval(() => {
      debouncedSearch({
        text: snippetSearch.searchText,
        tags: snippetSearch.searchTags,
      });
    }, 500);

    return () => {
      clearInterval(searchTimer);
    };
  });

  useEffect(() => {
    SnippetActions.refreshTagOptions();
    const tagOptionsSync = setInterval(() => {
      SnippetActions.refreshTagOptions();
    }, 2000);

    return () => {
      clearInterval(tagOptionsSync);
    };
  }, []);

  function newSnippetButtonDisabled() {
    if (snippetUpdater.body) return true;
    return false;
  }

  const showOnlyLikedSnippetsUpdater = async (b: boolean) => {
    const p = await PreferencesActions.updateShowOnlyLikedSnippets(b);
    prefsActions.set({
      showOnlyLikedSnippets: {
        ...prefs.showOnlyLikedSnippets,
        value: p.showOnlyLikedSnippets.value,
      },
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
      showTags: {
        ...prefs.showTags,
        value: p.showTags.value,
      },
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
            value={snippetSearch.searchText}
            placeholder="Search snippets"
            style={{ width: '100%', maxWidth: 300 }}
          />
          <div style={{ display: 'flex' }}>
            {prefs.showOnlyLikedSnippets.value && (
              <Tooltip title="Hide Liked">
                <Button
                  onClick={() => showOnlyLikedSnippetsUpdater(false)}
                  shape="circle"
                  type="primary"
                  icon={<HeartTwoTone />}
                />
              </Tooltip>
            )}
            {!prefs.showOnlyLikedSnippets.value && (
              <Tooltip title="Show Liked">
                <Button
                  onClick={() => showOnlyLikedSnippetsUpdater(true)}
                  type="ghost"
                  shape="circle"
                  icon={<HeartOutlined />}
                />
              </Tooltip>
            )}
            {prefs.showTags.value && (
              <Tooltip title="Hide Tags">
                <Button
                  onClick={() => showTagsUpdater(false)}
                  shape="circle"
                  type="primary"
                  icon={<TagsTwoTone />}
                />
              </Tooltip>
            )}
            {!prefs.showTags.value && (
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
              disabled={newSnippetButtonDisabled()}
              style={{ marginLeft: 10 }}
            >
              {!newSnippetButtonDisabled() && 'New Snippet'}
              {newSnippetButtonDisabled() && 'Creation In Progress'}
            </Button>
          </div>
        </div>
      </div>
      <div style={{ gridRow: 'search' }}>
        {prefs.showTags.value && <SearchTagList />}
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
