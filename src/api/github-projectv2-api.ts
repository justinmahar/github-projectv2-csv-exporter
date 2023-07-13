import emojiRegex from 'emoji-regex';
import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import toJ from './j2m';

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

export const fetchProject = async (login: string, isOrg: boolean, token: string, number: number): Promise<Project> => {
  const ORG_PROJECTS_QUERY = gql`
    query ProjectQuery($login: String!, $number: Int!) {
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
        projectV2(number: $number) {
          title
          number
          url
          items {
            totalCount
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
      number,
    },
  });
  return new Project(results?.data?.entity?.projectV2);
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
                    comments (first: 30) {
                      nodes {
                        body
                        createdAt
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
                      }
                    }
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
                priority: fieldValueByName(name: "Priority") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
                size: fieldValueByName(name: "Size") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
                issueType: fieldValueByName(name: "Type") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
                sprint: fieldValueByName(name: "Sprint") {
                  ... on ProjectV2ItemFieldIterationValue {
                    title
                  }
                }
                project: fieldValueByName(name: "Project") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
                type
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
  public userMap: any;
  constructor(node: any) {
    this.node = node;
    this.userMap = {
      
    };
  }
  public getCreatedAt(): string | undefined {
    const toShortFormat = (dateObj: Date) => {

      const monthNames = ["Jan", "Feb", "Mar", "Apr",
                          "May", "Jun", "Jul", "Aug",
                          "Sep", "Oct", "Nov", "Dec"];
      
      const day = dateObj.getDate();
      
      const monthIndex = dateObj.getMonth();
      const monthName = monthNames[monthIndex];
      
      const year = dateObj.getFullYear();
      
      return `${day}-${monthName}-${year}`;  
  }
    return toShortFormat(new Date(`${this.node?.createdAt}`));
  }
  public isArchived(): boolean | undefined {
    return !!this.node?.isArchived;
  }
  public getStatus(): string | undefined {
    const statusMap: any = {
      'On Hold': 'Blocked',
      'Done': 'Done',
      'In progress': 'In Progress',
      'Ready': 'Open',
      'In review': 'PR Review',
      'Epics (Multi-issue)': 'Open',
    }

    return statusMap[this.node?.status?.name.split(emojiRegex()).join('').trim()] || 'Open';
  }
  public getType(): string | undefined {
    return this.node?.type;
  }
  public getUpdatedAt(): string | undefined {
    return this.node?.updatedAt;
  }
  public getAssignees():
    | { name: string | undefined; login: string | undefined; email: string | undefined }[]
    | undefined {

    return ((this.node?.content?.assignees?.nodes ?? []) as any[]).map((data) => {
      return { name: data?.name ?? '', login: data?.login ?? '', email: this.userMap[data?.login ?? ''] };
    });
  }
  public getAuthor(): { name: string | undefined; login: string | undefined, email: string | undefined } | undefined {
    const authorData = this.node?.content?.author;
    return { name: authorData?.name ?? '', login: authorData?.login ?? '', email: this.userMap[authorData?.login ?? ''] };
  }
  public getBody(): string | undefined {
    return toJ(
      '**Original Description:** \n\r' +
        this.node?.content?.body +
        ' \n\r ' +
        this.getSource() +
        this.getComments() +
        this.getSprintForBody() +
        this.getCreatedAtForBody()
    );
  }
  private getCreatedAtForBody(): string {
    const authorHeading = this.getAuthorHeading(this.getAuthor())
    const createdAt = ` \n\r **Created by:** ${authorHeading} @ ${this.getCreatedAt()} \n\r`

    return createdAt;
  }
  private getSprintForBody(): string {
    return this.getSprint() ? ` \n\r **Historical Sprint:** ${this.getSprint()} \n\r` : '';
  }
  private getSource(): string {
    const source = ` \n\r **Source:** [${this.getUrl()}](${this.getUrl()})`;

    return this.getUrl() ? source : '';
  }
  private getComments(): string {
    const comments = ((this.node?.content?.comments?.nodes as any[]) ?? [])
      .map((comment) => {
        const author = this.getAuthorHeading(comment?.author);

        return ` \n\r ${author} @ ${comment?.createdAt} \n\r ${comment?.body}`;
      })
      .join(' \n\r ');

    return comments ? ` \n\r **Comments:**` + comments : '';
  }
  private getAuthorHeading(authorData: any): string {
    return `(${authorData?.login}) ${authorData?.name ?? ''}`;
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
  public getSize(): string | undefined {
    const githubSize = this.node?.size?.name || '';

    const sizeMap: any = {
      'X-Large': 13,
      Large: 8,
      Medium: 5,
      Small: 2,
      Tiny: 1,
    };

    return sizeMap[githubSize.split(emojiRegex()).join('').trim()] || '';
  }
  public getPriority(): string | undefined {
    const githubPriority = this.node?.priority?.name || '';

    const priorityMap: any = {
      Urgent: 'Highest',
      High: 'High',
      Medium: 'Medium',
      Low: 'Low',
    };

    return priorityMap[githubPriority.split(emojiRegex()).join('').trim()] || '';
  }
  public getIssueType(): string | undefined {
    const githubIssueType = this.node?.issueType?.name;
    const issueTypeMap: any = {
      Feature: 'Feature or Change Request',
      Bug: 'Bug',
      Improvement: 'Story',
      'Tech Debt': 'Tech Debt',
    };

    return issueTypeMap[githubIssueType];
  }
  public getSprint(): string | undefined {
    return this.node?.sprint?.title;
  }
  public getComponent(): string {
    const githubProject = this.node?.project?.name || '';
    const componentMap: any = {
      'FBA Integration': 'FBA Integration'
    }
    
    return componentMap[githubProject.split(emojiRegex()).join('').trim()] || '';
  }
}
