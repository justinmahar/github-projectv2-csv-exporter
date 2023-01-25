"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExporterSettings = exports.COLUMN_FILTER_TEXT_DEFAULT = exports.COLUMN_FILTER_TEXT_KEY = exports.COLUMN_FILTER_ENABLED_DEFAULT = exports.COLUMN_FILTER_ENABLED_KEY = exports.KNOWN_COLUMNS_DEFAULT = exports.KNOWN_COLUMNS_KEY = exports.REMOVE_TITLE_EMOJIS_DEFAULT = exports.REMOVE_TITLE_EMOJIS_KEY = exports.REMOVE_STATUS_EMOJIS_DEFAULT = exports.REMOVE_STATUS_EMOJIS_KEY = exports.INCLUDE_CLOSED_ITEMS_DEFAULT = exports.INCLUDE_CLOSED_ITEMS_KEY = exports.INCLUDE_DRAFT_ISSUES_DEFAULT = exports.INCLUDE_DRAFT_ISSUES_KEY = exports.INCLUDE_PULL_REQUESTS_DEFAULT = exports.INCLUDE_PULL_REQUESTS_KEY = exports.INCLUDE_ISSUES_DEFAULT = exports.INCLUDE_ISSUES_KEY = exports.LOGIN_DEFAULT = exports.LOGIN_KEY = exports.IS_ORG_DEFAULT = exports.IS_ORG_KEY = exports.ACCESS_TOKEN_DEFAULT = exports.ACCESS_TOKEN_KEY = exports.PREFIX = void 0;
const react_1 = __importDefault(require("react"));
const react_storage_complete_1 = require("react-storage-complete");
exports.PREFIX = `github-projectv2-csv-exporter`;
exports.ACCESS_TOKEN_KEY = `token`;
exports.ACCESS_TOKEN_DEFAULT = '';
exports.IS_ORG_KEY = `is-org`;
exports.IS_ORG_DEFAULT = false;
exports.LOGIN_KEY = `login`;
exports.LOGIN_DEFAULT = '';
exports.INCLUDE_ISSUES_KEY = `include-issues`;
exports.INCLUDE_ISSUES_DEFAULT = false;
exports.INCLUDE_PULL_REQUESTS_KEY = `include-pull-requests`;
exports.INCLUDE_PULL_REQUESTS_DEFAULT = false;
exports.INCLUDE_DRAFT_ISSUES_KEY = `include-draft-issues`;
exports.INCLUDE_DRAFT_ISSUES_DEFAULT = false;
exports.INCLUDE_CLOSED_ITEMS_KEY = `include-closed-items`;
exports.INCLUDE_CLOSED_ITEMS_DEFAULT = false;
exports.REMOVE_STATUS_EMOJIS_KEY = `remove-status-emojis`;
exports.REMOVE_STATUS_EMOJIS_DEFAULT = true;
exports.REMOVE_TITLE_EMOJIS_KEY = `remove-title-emojis`;
exports.REMOVE_TITLE_EMOJIS_DEFAULT = false;
exports.KNOWN_COLUMNS_KEY = `known-columns`;
exports.KNOWN_COLUMNS_DEFAULT = `Todo,In Progress,Done`;
exports.COLUMN_FILTER_ENABLED_KEY = `column-filter-enabled`;
exports.COLUMN_FILTER_ENABLED_DEFAULT = false;
exports.COLUMN_FILTER_TEXT_KEY = `column-filter-text`;
exports.COLUMN_FILTER_TEXT_DEFAULT = '';
const useExporterSettings = () => {
    const accessTokenState = (0, react_storage_complete_1.useLocalStorage)(exports.ACCESS_TOKEN_KEY, exports.ACCESS_TOKEN_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const isOrgState = (0, react_storage_complete_1.useLocalStorage)(exports.IS_ORG_KEY, exports.IS_ORG_DEFAULT, { prefix: exports.PREFIX });
    const loginState = (0, react_storage_complete_1.useLocalStorage)(exports.LOGIN_KEY, exports.LOGIN_DEFAULT, { prefix: exports.PREFIX });
    const includeIssuesState = (0, react_storage_complete_1.useLocalStorage)(exports.INCLUDE_ISSUES_KEY, exports.INCLUDE_ISSUES_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const includePullRequestsState = (0, react_storage_complete_1.useLocalStorage)(exports.INCLUDE_PULL_REQUESTS_KEY, exports.INCLUDE_PULL_REQUESTS_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const includeDraftIssuesState = (0, react_storage_complete_1.useLocalStorage)(exports.INCLUDE_DRAFT_ISSUES_KEY, exports.INCLUDE_DRAFT_ISSUES_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const includeClosedItemsState = (0, react_storage_complete_1.useLocalStorage)(exports.INCLUDE_CLOSED_ITEMS_KEY, exports.INCLUDE_CLOSED_ITEMS_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const removeStatusEmojisState = (0, react_storage_complete_1.useLocalStorage)(exports.REMOVE_STATUS_EMOJIS_KEY, exports.REMOVE_STATUS_EMOJIS_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const removeTitleEmojisState = (0, react_storage_complete_1.useLocalStorage)(exports.REMOVE_TITLE_EMOJIS_KEY, exports.REMOVE_TITLE_EMOJIS_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const knownColumnsTextState = (0, react_storage_complete_1.useLocalStorage)(exports.KNOWN_COLUMNS_KEY, exports.KNOWN_COLUMNS_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const columnFilterEnabledState = (0, react_storage_complete_1.useLocalStorage)(exports.COLUMN_FILTER_ENABLED_KEY, exports.COLUMN_FILTER_ENABLED_DEFAULT, {
        prefix: exports.PREFIX,
    });
    const columnFilterTextState = (0, react_storage_complete_1.useLocalStorage)(exports.COLUMN_FILTER_TEXT_KEY, exports.COLUMN_FILTER_TEXT_DEFAULT, {
        prefix: exports.PREFIX,
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
