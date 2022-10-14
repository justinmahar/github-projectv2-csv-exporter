/// <reference types="react" />
import 'bootstrap/dist/css/bootstrap.css';
import { DivProps } from 'react-html-props';
export declare const exporterPath = "/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--exporter";
export interface GitHubProjectExporterProps extends DivProps {
}
/**
 * Use this tool to export issues from a GitHub project as a CSV.
 */
export declare const GitHubProjectExporter: (props: GitHubProjectExporterProps) => JSX.Element;
