import React from 'react';
import { useLocalStorage } from 'react-storage-complete';

export const PREFIX = `github-projectv2-csv-exporter`;

export const ACCESS_TOKEN_KEY = `token`;
export const ACCESS_TOKEN_DEFAULT = '';

export const IS_ORG_KEY = `is-org`;
export const IS_ORG_DEFAULT = false;

export const LOGIN_KEY = `login`;
export const LOGIN_DEFAULT = '';

export const INCLUDE_ISSUES_KEY = `include-issues`;
export const INCLUDE_ISSUES_DEFAULT = false;

export const INCLUDE_PULL_REQUESTS_KEY = `include-pull-requests`;
export const INCLUDE_PULL_REQUESTS_DEFAULT = false;

export const INCLUDE_DRAFT_ISSUES_KEY = `include-draft-issues`;
export const INCLUDE_DRAFT_ISSUES_DEFAULT = false;

export const INCLUDE_CLOSED_ITEMS_KEY = `include-closed-items`;
export const INCLUDE_CLOSED_ITEMS_DEFAULT = false;

export const INCLUDE_BODY_KEY = `include-body`;
export const INCLUDE_BODY_DEFAULT = false;

export const REMOVE_STATUS_EMOJIS_KEY = `remove-status-emojis`;
export const REMOVE_STATUS_EMOJIS_DEFAULT = true;

export const REMOVE_TITLE_EMOJIS_KEY = `remove-title-emojis`;
export const REMOVE_TITLE_EMOJIS_DEFAULT = false;

export const KNOWN_COLUMNS_KEY = `known-columns`;
export const KNOWN_COLUMNS_DEFAULT = `Todo,In Progress,Done`;

export const COLUMN_FILTER_ENABLED_KEY = `column-filter-enabled`;
export const COLUMN_FILTER_ENABLED_DEFAULT = false;

export const COLUMN_FILTER_TEXT_KEY = `column-filter-text`;
export const COLUMN_FILTER_TEXT_DEFAULT = '';

export const useExporterSettings = () => {
  const accessTokenState = useLocalStorage(ACCESS_TOKEN_KEY, ACCESS_TOKEN_DEFAULT, {
    prefix: PREFIX,
  });
  const isOrgState = useLocalStorage(IS_ORG_KEY, IS_ORG_DEFAULT, { prefix: PREFIX });
  const loginState = useLocalStorage(LOGIN_KEY, LOGIN_DEFAULT, { prefix: PREFIX });
  const includeIssuesState = useLocalStorage(INCLUDE_ISSUES_KEY, INCLUDE_ISSUES_DEFAULT, {
    prefix: PREFIX,
  });
  const includePullRequestsState = useLocalStorage(INCLUDE_PULL_REQUESTS_KEY, INCLUDE_PULL_REQUESTS_DEFAULT, {
    prefix: PREFIX,
  });
  const includeDraftIssuesState = useLocalStorage(INCLUDE_DRAFT_ISSUES_KEY, INCLUDE_DRAFT_ISSUES_DEFAULT, {
    prefix: PREFIX,
  });
  const includeClosedItemsState = useLocalStorage(INCLUDE_CLOSED_ITEMS_KEY, INCLUDE_CLOSED_ITEMS_DEFAULT, {
    prefix: PREFIX,
  });
  const includeBody = useLocalStorage(INCLUDE_BODY_KEY, INCLUDE_BODY_DEFAULT, {
    prefix: PREFIX,
  });
  const removeStatusEmojisState = useLocalStorage(REMOVE_STATUS_EMOJIS_KEY, REMOVE_STATUS_EMOJIS_DEFAULT, {
    prefix: PREFIX,
  });
  const removeTitleEmojisState = useLocalStorage(REMOVE_TITLE_EMOJIS_KEY, REMOVE_TITLE_EMOJIS_DEFAULT, {
    prefix: PREFIX,
  });
  const knownColumnsTextState = useLocalStorage(KNOWN_COLUMNS_KEY, KNOWN_COLUMNS_DEFAULT, {
    prefix: PREFIX,
  });
  const columnFilterEnabledState = useLocalStorage(COLUMN_FILTER_ENABLED_KEY, COLUMN_FILTER_ENABLED_DEFAULT, {
    prefix: PREFIX,
  });
  const columnFilterTextState = useLocalStorage(COLUMN_FILTER_TEXT_KEY, COLUMN_FILTER_TEXT_DEFAULT, {
    prefix: PREFIX,
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
      includeBody,
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
    includeBody,
    isOrgState,
    knownColumnsTextState,
    loginState,
    removeStatusEmojisState,
    removeTitleEmojisState,
  ]);
};
