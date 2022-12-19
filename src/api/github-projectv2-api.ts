import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GitHub Auth instructions: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#authenticating-with-graphql
// Apollo Client (About): https://www.apollographql.com/docs/react/
// Apollo Client (Auth using bearer token): https://www.apollographql.com/docs/react/networking/authentication/
// GitHub API Portal: https://studio.apollographql.com/public/github/home?variant=current&utm_campaign=github-api-article&utm_medium=display&utm_source=apollo-blog

export const GITHUB_API_URL = 'https://api.github.com/graphql';

export const createGQLClient = (token: string) => {
  const httpLink = createHttpLink({
    uri: GITHUB_API_URL,
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};

export const fetchProjects = async (login: string, isOrg: boolean, token: string): Promise<Projects> => {
  const ORG_PROJECTS_QUERY = gql`
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
  const client = createGQLClient(token);
  const results = await client.query({
    query: ORG_PROJECTS_QUERY,
    variables: {
      login,
      projectsFirst: 100,
    },
  });
  return new Projects(results);
};

export class Projects {
  public results: any;
  constructor(results: any) {
    this.results = results;
  }
  public getViewerLogin(): string | undefined {
    return this.results?.data?.viewer?.login;
  }
  public getViewerAvatarUrl(): string | undefined {
    return this.results?.data?.viewer?.avatarUrl;
  }
  public getViewerUrl(): string | undefined {
    return this.results?.data?.viewer?.url;
  }
  public getViewerName(): string | undefined {
    return this.results?.data?.viewer?.name;
  }
  public getLogin(): string | undefined {
    return this.results?.data?.entity?.login;
  }
  public getAvatarUrl(): string | undefined {
    return this.results?.data?.entity?.avatarUrl;
  }
  public getUrl(): string | undefined {
    return this.results?.data?.entity?.url;
  }
  public getName(): string | undefined {
    return this.results?.data?.entity?.name;
  }
  public getProjects(): Project[] {
    const edges: any[] = this.results?.data?.entity?.projectsV2?.edges ?? [];
    return edges.map((edge) => new Project(edge.node));
  }
}

export class Project {
  public node: any;
  constructor(node: any) {
    this.node = node;
  }
  public getTitle(): number | undefined {
    return this.node?.title;
  }
  public getProjectNumber(): number | undefined {
    return this.node?.number;
  }
  public getUrl(): string | undefined {
    return this.node?.url;
  }
  public getTotalItemCount(): number | undefined {
    return this.node?.items?.totalCount ?? 0;
  }
}

export const fetchProjectItems = async (
  login: string,
  isOrg: boolean,
  projectNumber: number,
  token: string,
  progress?: (loaded: number, total: number) => void,
): Promise<ProjectItem[]> => {
  const PROJECT_ITEMS_QUERY = gql`
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

  const client = createGQLClient(token);
  let itemsAfter = null;
  let queryResults = undefined;
  let loadedEdges: any[] = [];
  let loadedAll = false;
  // We can only load 100 at a time. So we use cursors to load all issues.
  while (!loadedAll) {
    queryResults = await client.query({
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
    const totalCount = queryResults.data?.entity?.projectV2?.items?.totalCount ?? 0;
    const edges: any[] = queryResults?.data?.entity?.projectV2?.items?.edges ?? [];
    loadedEdges = [...loadedEdges, ...edges];
    itemsAfter = edges[edges.length - 1].cursor;
    loadedAll = loadedEdges.length === totalCount;
    // If a progress function was provided, we can call that to update the progress bar.
    if (progress) {
      progress(loadedEdges.length, totalCount);
    }
  }
  return loadedEdges.map((edge) => new ProjectItem(edge.node));
};

export class ProjectItem {
  public node: any;
  public fields: ProjectFieldValue[] = [];
  constructor(node: any) {
    this.node = node;
    this.fields = node.fieldValues.nodes.map((field: unknown) => new ProjectFieldValue(field));
  }
  public getCreatedAt(): string | undefined {
    return this.node?.createdAt;
  }
  public isArchived(): boolean | undefined {
    return !!this.node?.isArchived;
  }
  public getStatus(): string | undefined {
    return this.node?.status?.name;
  }
  public getType(): string | undefined {
    return this.node?.type;
  }
  public getUpdatedAt(): string | undefined {
    return this.node?.updatedAt;
  }
  public getAssignees(): { name: string | undefined; login: string | undefined }[] | undefined {
    return ((this.node?.content?.assignees?.nodes ?? []) as any[]).map((data) => {
      return { name: data?.name ?? '', login: data?.login ?? '' };
    });
  }
  public getAuthor(): { name: string | undefined; login: string | undefined } | undefined {
    const authorData = this.node?.content?.author;
    return { name: authorData?.name ?? '', login: authorData?.login ?? '' };
  }
  public getBody(): string | undefined {
    return this.node?.content?.body;
  }
  public getClosedAt(): string | undefined {
    return this.node?.content?.closedAt;
  }
  public getState(): string | undefined {
    return this.node?.content?.issueState || this.node?.content?.pullRequestState;
  }
  public getLabels(): string[] | undefined {
    return ((this.node?.content?.labels?.nodes as any[]) ?? []).map((labelData) => labelData?.name ?? '');
  }
  public getMilestone(): string | undefined {
    return this.node?.content?.milestone?.title;
  }
  public getNumber(): string | undefined {
    return this.node?.content?.number;
  }
  public getTitle(): string | undefined {
    return this.node?.content?.title;
  }
  public getUrl(): string | undefined {
    return this.node?.content?.url;
  }
}

export const fetchProjectFields = async (
  login: string,
  isOrg: boolean,
  projectNumber: number,
  token: string,
  progress?: (loaded: number, total: number) => void,
): Promise<ProjectField[]> => {
  const PROJECT_FIELDS_QUERY = gql`
    query ProjectFieldsQuery(
      $login: String!
      $projectNumber: Int!
      $fieldsFirst: Int
      $fieldsAfter: String
    ) {
      entity: ${isOrg ? 'organization' : 'user'}(login: $login) {
        projectV2(number: $projectNumber) {
          fields(first: $fieldsFirst, after: $fieldsAfter) {
            totalCount
            edges {
              cursor
              node {
                ... on ProjectV2Field {
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

  const client = createGQLClient(token);
  let fieldsAfter = null;
  let queryResults = undefined;
  let loadedEdges: { node: object }[] = [];
  let loadedAll = false;
  // We can only load 100 at a time. So we use cursors to load all issues.
  while (!loadedAll) {
    queryResults = await client.query({
      query: PROJECT_FIELDS_QUERY,
      variables: {
        login,
        projectNumber,
        fieldsFirst: 100,
        fieldsAfter,
      },
    });
    const totalCount = queryResults.data?.entity?.projectV2?.fields?.totalCount ?? 0;
    const edges: any[] = queryResults?.data?.entity?.projectV2?.fields?.edges ?? [];
    loadedEdges = [...loadedEdges, ...edges];
    fieldsAfter = edges[edges.length - 1].cursor;
    loadedAll = loadedEdges.length === totalCount;
    // If a progress function was provided, we can call that to update the progress bar.
    if (progress) {
      progress(loadedEdges.length, totalCount);
    }
  }
  // Status cannot be modified by user since it is a required field
  return loadedEdges.map((edge) => new ProjectField(edge.node)).filter((field) => field.getName() !== 'Status');
};

enum ProjectFieldType {
  ProjectV2ItemFieldDateValue = 'ProjectV2ItemFieldDateValue',
  ProjectV2ItemFieldLabelValue = 'ProjectV2ItemFieldLabelValue',
  ProjectV2ItemFieldNumberValue = 'ProjectV2ItemFieldNumberValue',
  ProjectV2ItemFieldPullRequestValue = 'ProjectV2ItemFieldPullRequestValue',
  ProjectV2ItemFieldSingleSelectValue = 'ProjectV2ItemFieldSingleSelectValue',
  ProjectV2ItemFieldTextValue = 'ProjectV2ItemFieldTextValue',
  ProjectV2ItemFieldUserValue = 'ProjectV2ItemFieldUserValue',
  ProjectV2ItemFieldRepositoryValue = 'ProjectV2ItemFieldRepositoryValue',
  ProjectV2ItemFieldReviewerValue = 'ProjectV2ItemFieldReviewerValue',
}

export class ProjectField {
  public node: any;
  constructor(node: any) {
    this.node = node;
  }

  public getName(): string | undefined {
    return this.node?.name;
  }

  public getId(): string | undefined {
    return this.node?.id;
  }
}

export class ProjectFieldValue {
  public node: any;
  public field: ProjectField;
  constructor(node: any) {
    this.node = node;
    this.field = new ProjectField(node.field);
  }

  public getType(): ProjectFieldType | undefined {
    return this.node?.__typename as ProjectFieldType;
  }

  public getValue(): string | number | undefined {
    switch (this.getType()) {
      case ProjectFieldType.ProjectV2ItemFieldDateValue:
        return this.node?.date;
      case ProjectFieldType.ProjectV2ItemFieldLabelValue:
        return this?.node?.labels?.nodes?.map(({ name }: { name: string }) => name)?.join(', ');
      case ProjectFieldType.ProjectV2ItemFieldNumberValue:
        return this.node?.number;
      case ProjectFieldType.ProjectV2ItemFieldPullRequestValue:
        return this.node?.pullRequests?.nodes?.map(({ number }: { number: number }) => `#${number}`)?.join(', ');
      case ProjectFieldType.ProjectV2ItemFieldSingleSelectValue:
        return this.node?.name;
      case ProjectFieldType.ProjectV2ItemFieldTextValue:
        return this.node?.text;
      case ProjectFieldType.ProjectV2ItemFieldUserValue:
        return this.node?.users?.nodes?.map(({ login }: { login: string }) => login)?.join(', ');
      case ProjectFieldType.ProjectV2ItemFieldRepositoryValue:
        return this.node?.repository?.name;
      case ProjectFieldType.ProjectV2ItemFieldReviewerValue:
        return (
          this.node?.reviewers?.nodes
            // teams have names, users have logins
            ?.map(({ login, name }: { login?: string; name?: string }) => login ?? name)
            ?.join(', ')
        );
      default:
        return this.node?.value;
    }
  }
}
