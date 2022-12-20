"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFieldValue = exports.ProjectField = exports.fetchAllEntityFields = exports.ProjectItem = exports.fetchProjectItems = exports.Project = exports.Projects = exports.fetchProjects = exports.createGQLClient = exports.GITHUB_API_URL = void 0;
const client_1 = require("@apollo/client");
const context_1 = require("@apollo/client/link/context");
// GitHub Auth instructions: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#authenticating-with-graphql
// Apollo Client (About): https://www.apollographql.com/docs/react/
// Apollo Client (Auth using bearer token): https://www.apollographql.com/docs/react/networking/authentication/
// GitHub API Portal: https://studio.apollographql.com/public/github/home?variant=current&utm_campaign=github-api-article&utm_medium=display&utm_source=apollo-blog
exports.GITHUB_API_URL = 'https://api.github.com/graphql';
const createGQLClient = (token) => {
    const httpLink = (0, client_1.createHttpLink)({
        uri: exports.GITHUB_API_URL,
    });
    const authLink = (0, context_1.setContext)((_, { headers }) => {
        // get the authentication token from local storage if it exists
        // return the headers to the context so httpLink can read them
        return {
            headers: Object.assign(Object.assign({}, headers), { authorization: token ? `Bearer ${token}` : '' }),
        };
    });
    const client = new client_1.ApolloClient({
        link: authLink.concat(httpLink),
        cache: new client_1.InMemoryCache(),
    });
    return client;
};
exports.createGQLClient = createGQLClient;
const fetchProjects = (login, isOrg, token) => __awaiter(void 0, void 0, void 0, function* () {
    const ORG_PROJECTS_QUERY = (0, client_1.gql) `
    query ProjectsQuery($login: String!, $projectsFirst: Int) {
      viewer {
        login
        name
        url
        avatarUrl
      }
      entity: ${isOrg ? 'organization' : 'user'}(login: $login) {
        avatarUrl
        login
        name
        url
        projectsV2(first: $projectsFirst) {
          edges {
            node {
              title
              number
              url
              items {
                totalCount
              }
            }
          }
        }
      }
    }
  `;
    const client = (0, exports.createGQLClient)(token);
    const results = yield client.query({
        query: ORG_PROJECTS_QUERY,
        variables: {
            login,
            projectsFirst: 100,
        },
    });
    return new Projects(results);
});
exports.fetchProjects = fetchProjects;
class Projects {
    constructor(results) {
        this.results = results;
    }
    getViewerLogin() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.viewer) === null || _c === void 0 ? void 0 : _c.login;
    }
    getViewerAvatarUrl() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.viewer) === null || _c === void 0 ? void 0 : _c.avatarUrl;
    }
    getViewerUrl() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.viewer) === null || _c === void 0 ? void 0 : _c.url;
    }
    getViewerName() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.viewer) === null || _c === void 0 ? void 0 : _c.name;
    }
    getLogin() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.login;
    }
    getAvatarUrl() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.avatarUrl;
    }
    getUrl() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.url;
    }
    getName() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.name;
    }
    getProjects() {
        var _a, _b, _c, _d, _e;
        const edges = (_e = (_d = (_c = (_b = (_a = this.results) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.projectsV2) === null || _d === void 0 ? void 0 : _d.edges) !== null && _e !== void 0 ? _e : [];
        return edges.map((edge) => new Project(edge.node));
    }
}
exports.Projects = Projects;
class Project {
    constructor(node) {
        this.node = node;
    }
    getTitle() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.title;
    }
    getProjectNumber() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.number;
    }
    getUrl() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.url;
    }
    getTotalItemCount() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.totalCount) !== null && _c !== void 0 ? _c : 0;
    }
}
exports.Project = Project;
const fetchProjectItems = (login, isOrg, projectNumber, token, progress) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const PROJECT_ITEMS_QUERY = (0, client_1.gql) `
    query ProjectQuery(
      $login: String!
      $projectNumber: Int!
      $itemsFirst: Int
      $itemsAfter: String
      $assigneesFirst: Int
      $labelsFirst: Int
      $statusFieldName: String!
    ) {
      entity: ${isOrg ? 'organization' : 'user'}(login: $login) {
        projectV2(number: $projectNumber) {
          items(first: $itemsFirst, after: $itemsAfter) {
            totalCount
            edges {
              node {
                content {
                  ... on Issue {
                    title
                    url
                    issueState: state
                    assignees(first: $assigneesFirst) {
                      nodes {
                        name
                        login
                      }
                    }
                    author {
                      login
                      ... on User {
                        name
                        login
                      }
                      ... on Organization {
                        name
                        login
                      }
                      ... on EnterpriseUserAccount {
                        name
                        login
                      }
                    }
                    milestone {
                      title
                    }
                    labels(first: $labelsFirst) {
                      nodes {
                        name
                      }
                    }
                    body
                    number
                    closedAt
                  }
                  ... on DraftIssue {
                    title
                    author: creator {
                      login
                      ... on User {
                        name
                        login
                      }
                      ... on Organization {
                        name
                        login
                      }
                      ... on EnterpriseUserAccount {
                        name
                        login
                      }
                    }
                    assignees(first: $assigneesFirst) {
                      nodes {
                        login
                        name
                      }
                    }
                    body
                  }
                  ... on PullRequest {
                    title
                    assignees(first: $assigneesFirst) {
                      nodes {
                        name
                        login
                      }
                    }
                    body
                    pullRequestState: state
                    url
                    number
                    author {
                      ... on User {
                        name
                        login
                      }
                      ... on Organization {
                        name
                        login
                      }
                      ... on EnterpriseUserAccount {
                        name
                        login
                      }
                    }
                    closedAt
                  }
                }
                createdAt
                updatedAt
                isArchived
                status: fieldValueByName(name: $statusFieldName) {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
                type
                fieldValues(first: $itemsFirst) {
                  nodes {
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                        ... on ProjectV2IterationField {
                          name
                        }
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldNumberValue {
                      number
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                      field {
                        ... on ProjectV2IterationField {
                          name
                        }
                      }
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                      field {
                        ... on ProjectV2IterationField {
                          name
                        }
                      }
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldUserValue {
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                      users(first: 10) {
                        nodes {
                          name
                          login
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldLabelValue {
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                      labels(first: 20) {
                        nodes {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldPullRequestValue {
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                      pullRequests(first: 10) {
                        nodes {
                          number
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldRepositoryValue {
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                      repository {
                        name
                      }
                    }
                    ... on ProjectV2ItemFieldReviewerValue {
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                      reviewers(first: 10) {
                        nodes {
                          ... on Mannequin {
                            login
                          }
                          ... on Team {
                            name
                          }
                          ... on User {
                            login
                          }
                        }
                      }
                    }
                  }
                }
              }
              cursor
            }
          }
        }
      }
    }
  `;
    const client = (0, exports.createGQLClient)(token);
    let itemsAfter = null;
    let queryResults = undefined;
    let loadedEdges = [];
    let loadedAll = false;
    // We can only load 100 at a time. So we use cursors to load all issues.
    while (!loadedAll) {
        queryResults = yield client.query({
            query: PROJECT_ITEMS_QUERY,
            variables: {
                login,
                projectNumber,
                itemsFirst: 100,
                itemsAfter,
                assigneesFirst: 100,
                labelsFirst: 100,
                statusFieldName: 'Status',
            },
        });
        const totalCount = (_e = (_d = (_c = (_b = (_a = queryResults.data) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.projectV2) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.totalCount) !== null && _e !== void 0 ? _e : 0;
        const edges = (_k = (_j = (_h = (_g = (_f = queryResults === null || queryResults === void 0 ? void 0 : queryResults.data) === null || _f === void 0 ? void 0 : _f.entity) === null || _g === void 0 ? void 0 : _g.projectV2) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j.edges) !== null && _k !== void 0 ? _k : [];
        loadedEdges = [...loadedEdges, ...edges];
        itemsAfter = edges[edges.length - 1].cursor;
        loadedAll = loadedEdges.length === totalCount;
        // If a progress function was provided, we can call that to update the progress bar.
        if (progress) {
            progress(loadedEdges.length, totalCount);
        }
    }
    return loadedEdges.map((edge) => new ProjectItem(edge.node));
});
exports.fetchProjectItems = fetchProjectItems;
class ProjectItem {
    constructor(node) {
        this.fields = [];
        this.node = node;
        this.fields = node.fieldValues.nodes.map((field) => new ProjectFieldValue(field));
    }
    getCreatedAt() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.createdAt;
    }
    isArchived() {
        var _a;
        return !!((_a = this.node) === null || _a === void 0 ? void 0 : _a.isArchived);
    }
    getStatus() {
        var _a, _b;
        return (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.name;
    }
    getType() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.type;
    }
    getUpdatedAt() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.updatedAt;
    }
    getAssignees() {
        var _a, _b, _c, _d;
        return ((_d = (_c = (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.assignees) === null || _c === void 0 ? void 0 : _c.nodes) !== null && _d !== void 0 ? _d : []).map((data) => {
            var _a, _b;
            return { name: (_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : '', login: (_b = data === null || data === void 0 ? void 0 : data.login) !== null && _b !== void 0 ? _b : '' };
        });
    }
    getAuthor() {
        var _a, _b, _c, _d;
        const authorData = (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.author;
        return { name: (_c = authorData === null || authorData === void 0 ? void 0 : authorData.name) !== null && _c !== void 0 ? _c : '', login: (_d = authorData === null || authorData === void 0 ? void 0 : authorData.login) !== null && _d !== void 0 ? _d : '' };
    }
    getBody() {
        var _a, _b;
        return (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.body;
    }
    getClosedAt() {
        var _a, _b;
        return (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.closedAt;
    }
    getState() {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.issueState) || ((_d = (_c = this.node) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.pullRequestState);
    }
    getLabels() {
        var _a, _b, _c, _d;
        return ((_d = (_c = (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c.nodes) !== null && _d !== void 0 ? _d : []).map((labelData) => { var _a; return (_a = labelData === null || labelData === void 0 ? void 0 : labelData.name) !== null && _a !== void 0 ? _a : ''; });
    }
    getMilestone() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.milestone) === null || _c === void 0 ? void 0 : _c.title;
    }
    getNumber() {
        var _a, _b;
        return (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.number;
    }
    getTitle() {
        var _a, _b;
        return (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.title;
    }
    getUrl() {
        var _a, _b;
        return (_b = (_a = this.node) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.url;
    }
}
exports.ProjectItem = ProjectItem;
/**
 * Fetch all fields across all projects for a given entity (user or org)
 * constraints: only the first 100 projects per entity and first 100 fields per project are fetched
 */
const fetchAllEntityFields = (login, isOrg, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o, _p;
    const ALL_PROJECT_FIELDS_QUERY = (0, client_1.gql) `
    query AllEntityFieldsQuery(
      $login: String!
    ) {
      entity: ${isOrg ? 'organization' : 'user'}(login: $login) {
        projectsV2(first: 100) {
          totalCount
          nodes {
            fields(first: 100) {
              totalCount
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                }
                ... on ProjectV2IterationField {
                  id
                  name
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;
    const client = (0, exports.createGQLClient)(token);
    const queryResults = yield client.query({
        query: ALL_PROJECT_FIELDS_QUERY,
        variables: {
            login,
        },
    });
    return (_p = (_o = (_m = (_l = queryResults === null || queryResults === void 0 ? void 0 : queryResults.data) === null || _l === void 0 ? void 0 : _l.entity) === null || _m === void 0 ? void 0 : _m.projectsV2) === null || _o === void 0 ? void 0 : _o.nodes) === null || _p === void 0 ? void 0 : _p.reduce((acc, proj) => {
        var _a, _b, _c, _d;
        // Status cannot be modified by user since it is a required field
        return [
            ...acc,
            ...((_d = (_c = (_b = (_a = proj === null || proj === void 0 ? void 0 : proj.fields) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.map((field) => new ProjectField(field))) === null || _c === void 0 ? void 0 : _c.filter((field) => field.getName() !== 'Status')) !== null && _d !== void 0 ? _d : []),
        ];
    }, []);
});
exports.fetchAllEntityFields = fetchAllEntityFields;
var ProjectFieldType;
(function (ProjectFieldType) {
    ProjectFieldType["ProjectV2ItemFieldDateValue"] = "ProjectV2ItemFieldDateValue";
    ProjectFieldType["ProjectV2ItemFieldLabelValue"] = "ProjectV2ItemFieldLabelValue";
    ProjectFieldType["ProjectV2ItemFieldNumberValue"] = "ProjectV2ItemFieldNumberValue";
    ProjectFieldType["ProjectV2ItemFieldPullRequestValue"] = "ProjectV2ItemFieldPullRequestValue";
    ProjectFieldType["ProjectV2ItemFieldSingleSelectValue"] = "ProjectV2ItemFieldSingleSelectValue";
    ProjectFieldType["ProjectV2ItemFieldTextValue"] = "ProjectV2ItemFieldTextValue";
    ProjectFieldType["ProjectV2ItemFieldUserValue"] = "ProjectV2ItemFieldUserValue";
    ProjectFieldType["ProjectV2ItemFieldRepositoryValue"] = "ProjectV2ItemFieldRepositoryValue";
    ProjectFieldType["ProjectV2ItemFieldReviewerValue"] = "ProjectV2ItemFieldReviewerValue";
})(ProjectFieldType || (ProjectFieldType = {}));
class ProjectField {
    constructor(node) {
        this.node = node;
    }
    getName() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.name;
    }
    getId() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.id;
    }
}
exports.ProjectField = ProjectField;
class ProjectFieldValue {
    constructor(node) {
        this.node = node;
        this.field = new ProjectField(node.field);
    }
    getType() {
        var _a;
        return (_a = this.node) === null || _a === void 0 ? void 0 : _a.__typename;
    }
    getValue() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        switch (this.getType()) {
            case ProjectFieldType.ProjectV2ItemFieldDateValue:
                return (_a = this.node) === null || _a === void 0 ? void 0 : _a.date;
            case ProjectFieldType.ProjectV2ItemFieldLabelValue:
                return (_e = (_d = (_c = (_b = this === null || this === void 0 ? void 0 : this.node) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c.nodes) === null || _d === void 0 ? void 0 : _d.map(({ name }) => name)) === null || _e === void 0 ? void 0 : _e.join(', ');
            case ProjectFieldType.ProjectV2ItemFieldNumberValue:
                return (_f = this.node) === null || _f === void 0 ? void 0 : _f.number;
            case ProjectFieldType.ProjectV2ItemFieldPullRequestValue:
                return (_k = (_j = (_h = (_g = this.node) === null || _g === void 0 ? void 0 : _g.pullRequests) === null || _h === void 0 ? void 0 : _h.nodes) === null || _j === void 0 ? void 0 : _j.map(({ number }) => `#${number}`)) === null || _k === void 0 ? void 0 : _k.join(', ');
            case ProjectFieldType.ProjectV2ItemFieldSingleSelectValue:
                return (_l = this.node) === null || _l === void 0 ? void 0 : _l.name;
            case ProjectFieldType.ProjectV2ItemFieldTextValue:
                return (_m = this.node) === null || _m === void 0 ? void 0 : _m.text;
            case ProjectFieldType.ProjectV2ItemFieldUserValue:
                return (_r = (_q = (_p = (_o = this.node) === null || _o === void 0 ? void 0 : _o.users) === null || _p === void 0 ? void 0 : _p.nodes) === null || _q === void 0 ? void 0 : _q.map(({ login }) => login)) === null || _r === void 0 ? void 0 : _r.join(', ');
            case ProjectFieldType.ProjectV2ItemFieldRepositoryValue:
                return (_t = (_s = this.node) === null || _s === void 0 ? void 0 : _s.repository) === null || _t === void 0 ? void 0 : _t.name;
            case ProjectFieldType.ProjectV2ItemFieldReviewerValue:
                return ((_x = (_w = (_v = (_u = this.node) === null || _u === void 0 ? void 0 : _u.reviewers) === null || _v === void 0 ? void 0 : _v.nodes) === null || _w === void 0 ? void 0 : _w.map(({ login, name }) => login !== null && login !== void 0 ? login : name)) === null || _x === void 0 ? void 0 : _x.join(', '));
            default:
                return (_y = this.node) === null || _y === void 0 ? void 0 : _y.value;
        }
    }
}
exports.ProjectFieldValue = ProjectFieldValue;
