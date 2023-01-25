import React from 'react';
import { useLocalStorage } from 'react-storage-complete';

export const LOCAL_STORAGE_KEY_PREFIX = `github-projectv2-csv-exporter`;

export const EXPORTER_ACCESS_TOKEN_KEY = `token`;
export const EXPORTER_LOGIN_KEY = `login`;
export const EXPORTER_IS_ORG_KEY = `is-org`;
export const EXPORTER_INCLUDE_ISSUES_KEY = `include-issues`;
export const EXPORTER_INCLUDE_PULL_REQUESTS_KEY = `include-pull-requests`;
export const EXPORTER_INCLUDE_DRAFT_ISSUES_KEY = `include-draft-issues`;
export const EXPORTER_INCLUDE_CLOSED_ITEMS_KEY = `include-closed-items`;
export const EXPORTER_REMOVE_STATUS_EMOJIS_KEY = `remove-status-emojis`;
export const EXPORTER_REMOVE_TITLE_EMOJIS_KEY = `remove-title-emojis`;
export const EXPORTER_KNOWN_COLUMNS_KEY = `known-columns`;
export const EXPORTER_KNOWN_COLUMNS_DEFAULT = `Todo,In Progress,Done`;
export const EXPORTER_COLUMN_FILTER_ENABLED_KEY = `column-filter-enabled`;
export const EXPORTER_COLUMN_FILTER_TEXT_KEY = `column-filter-text`;

export const useExporterSettings = () => {
  const accessTokenState = useLocalStorage(EXPORTER_ACCESS_TOKEN_KEY, '', {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const isOrgState = useLocalStorage(EXPORTER_IS_ORG_KEY, true, { prefix: LOCAL_STORAGE_KEY_PREFIX });
  const loginState = useLocalStorage(EXPORTER_LOGIN_KEY, '', { prefix: LOCAL_STORAGE_KEY_PREFIX });
  const includeIssuesState = useLocalStorage(EXPORTER_INCLUDE_ISSUES_KEY, true, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const includePullRequestsState = useLocalStorage(EXPORTER_INCLUDE_PULL_REQUESTS_KEY, false, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const includeDraftIssuesState = useLocalStorage(EXPORTER_INCLUDE_DRAFT_ISSUES_KEY, false, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const includeClosedItemsState = useLocalStorage(EXPORTER_INCLUDE_CLOSED_ITEMS_KEY, false, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const removeStatusEmojisState = useLocalStorage(EXPORTER_REMOVE_STATUS_EMOJIS_KEY, true, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const removeTitleEmojisState = useLocalStorage(EXPORTER_REMOVE_TITLE_EMOJIS_KEY, false, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const knownColumnsTextState = useLocalStorage(EXPORTER_KNOWN_COLUMNS_KEY, EXPORTER_KNOWN_COLUMNS_DEFAULT, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const columnFilterEnabledState = useLocalStorage(EXPORTER_COLUMN_FILTER_ENABLED_KEY, false, {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });
  const columnFilterTextState = useLocalStorage(EXPORTER_COLUMN_FILTER_TEXT_KEY, '', {
    prefix: LOCAL_STORAGE_KEY_PREFIX,
  });

  return React.useMemo(() => {
    return {
      accessTokenState,
      isOrgState,
      loginState,
      includeIssuesState,
      includePullRequestsState,
      includeDraftIssuesState,
      includeClosedItemsState,
      removeStatusEmojisState,
      removeTitleEmojisState,
      knownColumnsTextState,
      columnFilterEnabledState,
      columnFilterTextState,
    };
  }, [
    accessTokenState,
    columnFilterEnabledState,
    columnFilterTextState,
    includeClosedItemsState,
    includeDraftIssuesState,
    includeIssuesState,
    includePullRequestsState,
    isOrgState,
    knownColumnsTextState,
    loginState,
    removeStatusEmojisState,
    removeTitleEmojisState,
  ]);
};
