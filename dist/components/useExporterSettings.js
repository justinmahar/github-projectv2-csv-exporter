"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExporterSettings = exports.EXPORTER_COLUMN_FILTER_TEXT_KEY = exports.EXPORTER_COLUMN_FILTER_ENABLED_KEY = exports.EXPORTER_KNOWN_COLUMNS_DEFAULT = exports.EXPORTER_KNOWN_COLUMNS_KEY = exports.EXPORTER_REMOVE_TITLE_EMOJIS_KEY = exports.EXPORTER_REMOVE_STATUS_EMOJIS_KEY = exports.EXPORTER_INCLUDE_CLOSED_ITEMS_KEY = exports.EXPORTER_INCLUDE_DRAFT_ISSUES_KEY = exports.EXPORTER_INCLUDE_PULL_REQUESTS_KEY = exports.EXPORTER_INCLUDE_ISSUES_KEY = exports.EXPORTER_IS_ORG_KEY = exports.EXPORTER_LOGIN_KEY = exports.EXPORTER_ACCESS_TOKEN_KEY = exports.LOCAL_STORAGE_KEY_PREFIX = void 0;
const react_1 = __importDefault(require("react"));
const react_storage_complete_1 = require("react-storage-complete");
exports.LOCAL_STORAGE_KEY_PREFIX = `github-projectv2-csv-exporter`;
exports.EXPORTER_ACCESS_TOKEN_KEY = `token`;
exports.EXPORTER_LOGIN_KEY = `login`;
exports.EXPORTER_IS_ORG_KEY = `is-org`;
exports.EXPORTER_INCLUDE_ISSUES_KEY = `include-issues`;
exports.EXPORTER_INCLUDE_PULL_REQUESTS_KEY = `include-pull-requests`;
exports.EXPORTER_INCLUDE_DRAFT_ISSUES_KEY = `include-draft-issues`;
exports.EXPORTER_INCLUDE_CLOSED_ITEMS_KEY = `include-closed-items`;
exports.EXPORTER_REMOVE_STATUS_EMOJIS_KEY = `remove-status-emojis`;
exports.EXPORTER_REMOVE_TITLE_EMOJIS_KEY = `remove-title-emojis`;
exports.EXPORTER_KNOWN_COLUMNS_KEY = `known-columns`;
exports.EXPORTER_KNOWN_COLUMNS_DEFAULT = `Todo,In Progress,Done`;
exports.EXPORTER_COLUMN_FILTER_ENABLED_KEY = `column-filter-enabled`;
exports.EXPORTER_COLUMN_FILTER_TEXT_KEY = `column-filter-text`;
const useExporterSettings = () => {
    const accessTokenState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_ACCESS_TOKEN_KEY, '', {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const isOrgState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_IS_ORG_KEY, true, { prefix: exports.LOCAL_STORAGE_KEY_PREFIX });
    const loginState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_LOGIN_KEY, '', { prefix: exports.LOCAL_STORAGE_KEY_PREFIX });
    const includeIssuesState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_INCLUDE_ISSUES_KEY, true, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const includePullRequestsState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_INCLUDE_PULL_REQUESTS_KEY, false, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const includeDraftIssuesState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_INCLUDE_DRAFT_ISSUES_KEY, false, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const includeClosedItemsState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_INCLUDE_CLOSED_ITEMS_KEY, false, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const removeStatusEmojisState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_REMOVE_STATUS_EMOJIS_KEY, true, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const removeTitleEmojisState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_REMOVE_TITLE_EMOJIS_KEY, false, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const knownColumnsTextState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_KNOWN_COLUMNS_KEY, exports.EXPORTER_KNOWN_COLUMNS_DEFAULT, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const columnFilterEnabledState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_COLUMN_FILTER_ENABLED_KEY, false, {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    const columnFilterTextState = (0, react_storage_complete_1.useLocalStorage)(exports.EXPORTER_COLUMN_FILTER_TEXT_KEY, '', {
        prefix: exports.LOCAL_STORAGE_KEY_PREFIX,
    });
    return react_1.default.useMemo(() => {
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
exports.useExporterSettings = useExporterSettings;
