"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubProjectFieldSettings = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const github_projectv2_api_1 = require("../api/github-projectv2-api");
const GitHubProjectExporterSettings_1 = require("./GitHubProjectExporterSettings");
const useLocalStorageState_1 = require("./useLocalStorageState");
const EXPORTER_BUILTIN_FIELDS = [
    'Title',
    'Number',
    'Assignees',
    'Assignee Usernames',
    'Labels',
    'URL',
    'Milestone',
    'Author',
    'Author Username',
    'CreatedAt',
    'UpdatedAt',
    'ClosedAt',
    'Type',
    'State',
];
/**
 * Select which fields are included/excluded from the CSV export
 */
const GitHubProjectFieldSettings = (_a) => {
    var props = __rest(_a, []);
    const [accessToken] = (0, useLocalStorageState_1.useLocalStorageState)('', GitHubProjectExporterSettings_1.EXPORTER_ACCESS_TOKEN_KEY);
    const [isOrg] = (0, useLocalStorageState_1.useLocalStorageState)('true', GitHubProjectExporterSettings_1.EXPORTER_IS_ORG_KEY);
    const [login] = (0, useLocalStorageState_1.useLocalStorageState)('', GitHubProjectExporterSettings_1.EXPORTER_LOGIN_KEY);
    const [projectFields, setProjectFields] = react_1.default.useState(undefined);
    const [loadProjectFieldsError, setLoadProjectFieldsError] = react_1.default.useState(undefined);
    const [loading, setLoading] = react_1.default.useState(true);
    const [knownFieldsText, setKnownFieldsText] = (0, useLocalStorageState_1.useLocalStorageState)('', GitHubProjectExporterSettings_1.EXPORTER_KNOWN_FIELDS_KEY);
    const [fieldsFilterEnabled, setFieldsFilterEnabled] = (0, useLocalStorageState_1.useLocalStorageState)('false', GitHubProjectExporterSettings_1.EXPORTER_FIELD_FILTER_ENABLED_KEY);
    const [fieldsFilterText, setFieldsFilterText] = (0, useLocalStorageState_1.useLocalStorageState)(knownFieldsText, GitHubProjectExporterSettings_1.EXPORTER_FIELD_FILTER_TEXT_KEY);
    const [enteredKnownFields, setEnteredKnownFields] = react_1.default.useState('');
    const knownFieldsRef = react_1.default.useRef(null);
    const selectedFieldsNames = (fieldsFilterText !== null && fieldsFilterText !== void 0 ? fieldsFilterText : '').split(',').filter((c) => !!c);
    const knownFields = (knownFieldsText !== null && knownFieldsText !== void 0 ? knownFieldsText : '').split(',').filter((c) => !!c);
    const addKnownField = (col) => {
        setKnownFieldsText([...new Set([...knownFields, col.trim()])].join(','));
    };
    const deleteKnownField = (col) => {
        const colsCopy = [...knownFields];
        colsCopy.splice(colsCopy.indexOf(col), 1);
        setKnownFieldsText(colsCopy.join(','));
    };
    const fieldNameBadgeElements = knownFields.map((colName, index) => {
        const selected = selectedFieldsNames.includes(colName);
        return (react_1.default.createElement(react_bootstrap_1.Badge, { key: `col-${index}`, bg: selected ? 'primary' : 'light', className: `user-select-none ${selected ? '' : 'text-black'}`, onClick: () => {
                if (!selected) {
                    setFieldsFilterText([...new Set([...selectedFieldsNames, colName])].join(','));
                    setFieldsFilterEnabled('true');
                }
                else {
                    const newNames = [...selectedFieldsNames];
                    newNames.splice(newNames.indexOf(colName), 1);
                    setFieldsFilterText(newNames.join(','));
                    setFieldsFilterEnabled(`${newNames.length > 0}`);
                }
            }, style: { cursor: 'pointer' } }, colName));
    });
    const knownFieldsElements = knownFields.map((field, index) => (react_1.default.createElement(react_bootstrap_1.Badge, { key: `known-col-${index}`, bg: "primary" },
        react_1.default.createElement("div", { className: "d-flex gap-2 align-items-center" },
            field,
            react_1.default.createElement("span", { className: "fw-bold", style: { cursor: 'pointer', fontSize: '120%' }, onClick: () => deleteKnownField(field) }, "\u00D7")))));
    react_1.default.useEffect(() => {
        if (accessToken && login && loading) {
            (0, github_projectv2_api_1.fetchProjectFields)(login, isOrg === 'true', 1, accessToken)
                .then((newProjectFields) => {
                const mergedProjectFields = [
                    ...new Set([...EXPORTER_BUILTIN_FIELDS, ...newProjectFields.map((f) => { var _a; return (_a = f.getName()) !== null && _a !== void 0 ? _a : ''; })]),
                ];
                setProjectFields(mergedProjectFields);
                const newKnownFieldsText = mergedProjectFields.join(',');
                setKnownFieldsText(newKnownFieldsText);
                //toggle all fields enabled - only on first load
                if (fieldsFilterEnabled === 'false' && fieldsFilterText === '')
                    setFieldsFilterText(newKnownFieldsText);
            })
                .catch((e) => {
                console.error(e);
                setLoadProjectFieldsError(e);
            })
                .finally(() => setLoading(false));
        }
    }, [accessToken, login, loading, isOrg]);
    return (react_1.default.createElement("div", Object.assign({}, props, { style: Object.assign({}, props.style) }),
        !!loading && (react_1.default.createElement("div", { className: "d-flex justify-content-center align-items-center", style: { height: 120 } },
            react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", role: "status" }))),
        loadProjectFieldsError && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", className: "mb-2" },
            react_1.default.createElement("p", { className: "fw-bold" },
                "Could not load project fields for",
                ' ',
                react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger", className: "font-monospace" }, login),
                ". Please check your access token and login."),
            react_1.default.createElement("p", { className: "mb-0 font-monospace small" }, `${loadProjectFieldsError}`))),
        !loading && !!projectFields && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "fg-fields-filter", className: "mb-3" },
                react_1.default.createElement("div", { className: "d-flex flex-wrap align-items-center gap-2 mb-2" },
                    react_1.default.createElement(react_bootstrap_1.Form.Check, { label: "Include the following fields:", id: "fields-filter-checkbox", checked: fieldsFilterEnabled === 'true', onChange: (e) => setFieldsFilterEnabled(`${e.target.checked}`), className: "user-select-none" }),
                    react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", value: fieldsFilterText !== null && fieldsFilterText !== void 0 ? fieldsFilterText : '', placeholder: fieldsFilterEnabled !== 'true' ? '' : 'Enter field name', onChange: (e) => setFieldsFilterText(e.target.value), style: { width: 220 }, disabled: fieldsFilterEnabled !== 'true' })),
                react_1.default.createElement("div", { className: "d-flex flex-wrap gap-2 ms-4" }, fieldNameBadgeElements)),
            react_1.default.createElement(react_bootstrap_1.Form.Group, { controlId: "known-fields-groups", className: "mb-3" },
                react_1.default.createElement(react_bootstrap_1.Accordion, null,
                    react_1.default.createElement(react_bootstrap_1.Accordion.Item, { eventKey: "0" },
                        react_1.default.createElement(react_bootstrap_1.Accordion.Header, null,
                            react_1.default.createElement("div", { className: "d-flex gap-2" },
                                "Item Fields",
                                react_1.default.createElement(react_bootstrap_1.Badge, { pill: true, bg: projectFields.length > 0 ? 'primary' : 'secondary' }, projectFields.length))),
                        react_1.default.createElement(react_bootstrap_1.Accordion.Body, null,
                            react_1.default.createElement("div", { className: "d-flex flex-wrap gap-2 mb-2" },
                                react_1.default.createElement(react_bootstrap_1.Form.Control, { ref: knownFieldsRef, type: "text", value: enteredKnownFields, placeholder: "Enter field name", onChange: (e) => setEnteredKnownFields(e.target.value), autoComplete: "off", style: { width: 200 } }),
                                react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => {
                                        var _a;
                                        addKnownField(enteredKnownFields);
                                        setEnteredKnownFields('');
                                        (_a = knownFieldsRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                                    } }, "Add Field")),
                            react_1.default.createElement("div", { className: "d-flex flex-wrap gap-2 mb-2" }, knownFieldsElements),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", value: knownFieldsText !== null && knownFieldsText !== void 0 ? knownFieldsText : '', placeholder: knownFieldsText ? '' : 'Add a field above', onChange: (e) => setKnownFieldsText(e.target.value), style: { width: 550 } }))))),
                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "Optionally, you can select the optional fields that will be included as headers in the generated CSV file. Custom fields are fetched from the user/org's active projects.")),
            react_1.default.createElement("div", { className: "d-flex justify-content-end" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: () => setLoading(true) }, "Refresh"))))));
};
exports.GitHubProjectFieldSettings = GitHubProjectFieldSettings;
