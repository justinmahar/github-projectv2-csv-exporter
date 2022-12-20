import { ApolloClient } from '@apollo/client';
export declare const GITHUB_API_URL = "https://api.github.com/graphql";
export declare const createGQLClient: (token: string) => ApolloClient<import("@apollo/client").NormalizedCacheObject>;
export declare const fetchProjects: (login: string, isOrg: boolean, token: string) => Promise<Projects>;
export declare class Projects {
    results: any;
    constructor(results: any);
    getViewerLogin(): string | undefined;
    getViewerAvatarUrl(): string | undefined;
    getViewerUrl(): string | undefined;
    getViewerName(): string | undefined;
    getLogin(): string | undefined;
    getAvatarUrl(): string | undefined;
    getUrl(): string | undefined;
    getName(): string | undefined;
    getProjects(): Project[];
}
export declare class Project {
    node: any;
    constructor(node: any);
    getTitle(): number | undefined;
    getProjectNumber(): number | undefined;
    getUrl(): string | undefined;
    getTotalItemCount(): number | undefined;
}
export declare const fetchProjectItems: (login: string, isOrg: boolean, projectNumber: number, token: string, progress?: ((loaded: number, total: number) => void) | undefined) => Promise<ProjectItem[]>;
export declare class ProjectItem {
    node: any;
    fields: ProjectFieldValue[];
    constructor(node: any);
    getCreatedAt(): string | undefined;
    isArchived(): boolean | undefined;
    getStatus(): string | undefined;
    getType(): string | undefined;
    getUpdatedAt(): string | undefined;
    getAssignees(): {
        name: string | undefined;
        login: string | undefined;
    }[] | undefined;
    getAuthor(): {
        name: string | undefined;
        login: string | undefined;
    } | undefined;
    getBody(): string | undefined;
    getClosedAt(): string | undefined;
    getState(): string | undefined;
    getLabels(): string[] | undefined;
    getMilestone(): string | undefined;
    getNumber(): string | undefined;
    getTitle(): string | undefined;
    getUrl(): string | undefined;
}
export declare const fetchProjectFields: (login: string, isOrg: boolean, projectNumber: number, token: string, progress?: ((loaded: number, total: number) => void) | undefined) => Promise<ProjectField[]>;
declare enum ProjectFieldType {
    ProjectV2ItemFieldDateValue = "ProjectV2ItemFieldDateValue",
    ProjectV2ItemFieldLabelValue = "ProjectV2ItemFieldLabelValue",
    ProjectV2ItemFieldNumberValue = "ProjectV2ItemFieldNumberValue",
    ProjectV2ItemFieldPullRequestValue = "ProjectV2ItemFieldPullRequestValue",
    ProjectV2ItemFieldSingleSelectValue = "ProjectV2ItemFieldSingleSelectValue",
    ProjectV2ItemFieldTextValue = "ProjectV2ItemFieldTextValue",
    ProjectV2ItemFieldUserValue = "ProjectV2ItemFieldUserValue",
    ProjectV2ItemFieldRepositoryValue = "ProjectV2ItemFieldRepositoryValue",
    ProjectV2ItemFieldReviewerValue = "ProjectV2ItemFieldReviewerValue"
}
export declare class ProjectField {
    node: any;
    constructor(node: any);
    getName(): string | undefined;
    getId(): string | undefined;
}
export declare class ProjectFieldValue {
    node: any;
    field: ProjectField;
    constructor(node: any);
    getType(): ProjectFieldType | undefined;
    getValue(): string | number | undefined;
}
export {};
