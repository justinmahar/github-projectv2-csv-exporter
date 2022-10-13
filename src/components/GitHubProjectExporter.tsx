import 'bootstrap/dist/css/bootstrap.css';
import emojiRegex from 'emoji-regex';
import { ExportToCsv } from 'export-to-csv';
import React from 'react';
import { Alert, Badge, Button, Card, Col, Container, ProgressBar, Row, Spinner, Table } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { fetchOrgProjects, fetchProjectItems, OrgProjects, Project } from '../api/github-projectv2-api';
import {
  EXPORTER_ACCESS_TOKEN_KEY,
  EXPORTER_COLUMN_FILTER_ENABLED_KEY,
  EXPORTER_COLUMN_FILTER_TEXT_KEY,
  EXPORTER_INCLUDE_CLOSED_ISSUES_KEY,
  EXPORTER_KNOWN_COLUMNS_DEFAULT,
  EXPORTER_KNOWN_COLUMNS_KEY,
  EXPORTER_ORGANIZATION_KEY,
  EXPORTER_REMOVE_STATUS_EMOJIS_KEY,
  EXPORTER_REMOVE_TITLE_EMOJIS_KEY,
  settingsPath,
} from './GitHubProjectExporterSettings';
import { useLocalStorageState } from './useLocalStorageState';

export const exporterPath =
  '/github-projectv2-csv-exporter/iframe.html?id=tools-github-project-exporter--exporter&viewMode=story';

export interface GitHubProjectExporterProps extends DivProps {}

/**
 * Use this tool to export issues from a GitHub project as a CSV.
 */
export const GitHubProjectExporter = (props: GitHubProjectExporterProps) => {
  const [accessToken] = useLocalStorageState('', EXPORTER_ACCESS_TOKEN_KEY);
  const [organization] = useLocalStorageState('', EXPORTER_ORGANIZATION_KEY);
  const [includeClosedIssues] = useLocalStorageState('false', EXPORTER_INCLUDE_CLOSED_ISSUES_KEY);
  const [removeStatusEmojis] = useLocalStorageState('true', EXPORTER_REMOVE_STATUS_EMOJIS_KEY);
  const [removeTitleEmojis] = useLocalStorageState('false', EXPORTER_REMOVE_TITLE_EMOJIS_KEY);
  const [columnFilterEnabled] = useLocalStorageState('false', EXPORTER_COLUMN_FILTER_ENABLED_KEY);
  const [columnFilterText] = useLocalStorageState('', EXPORTER_COLUMN_FILTER_TEXT_KEY);
  const [knownColumnsText] = useLocalStorageState(EXPORTER_KNOWN_COLUMNS_DEFAULT, EXPORTER_KNOWN_COLUMNS_KEY);
  const knownColumns = (knownColumnsText ?? '').split(',').filter((c) => !!c);
  const selectedColumnNames = (columnFilterText ?? '').split(',').filter((c) => !!c);

  const [orgProjects, setOrgProjects] = React.useState<OrgProjects | undefined>(undefined);
  const [loadProjectsError, setLoadProjectsError] = React.useState<Error | undefined>(undefined);
  const [exportProjectItemsError, setExportProjectItemsError] = React.useState<Error | undefined>(undefined);
  const [noItemsAlertShown, setNoItemsAlertShown] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);
  const [exportingProjectNumber, setExportingProjectNumber] = React.useState(-1);
  const [progressCurrent, setProgressCurrent] = React.useState(0);
  const [progressTotal, setProgressTotal] = React.useState(0);

  React.useEffect(() => {
    if (accessToken && organization && loading) {
      fetchOrgProjects(organization, accessToken)
        .then((orgProjects) => {
          setOrgProjects(orgProjects);
        })
        .catch((e) => {
          console.error(e);
          setLoadProjectsError(e);
        })
        .finally(() => setLoading(false));
    }
  }, [accessToken, organization, loading]);

  const handleExportCSV = (project: Project) => {
    const projectNumber = project.getProjectNumber() ?? -1;
    if (accessToken && organization && projectNumber >= 0) {
      setExporting(true);
      setExportingProjectNumber(projectNumber);
      setProgressCurrent(0);
      setProgressTotal(0);
      setLoadProjectsError(undefined);
      setExportProjectItemsError(undefined);
      setNoItemsAlertShown(false);

      // START smooth loading progress bar using request time estimates
      let estimatedProgressInterval: any = undefined;
      const progress = (loaded: number, total: number) => {
        clearInterval(estimatedProgressInterval);
        if (loaded < total) {
          let estimatedProgressAmount = 0;
          const chunkMaxCount = 100;
          const remainingInChunk = Math.min(chunkMaxCount, total - loaded);
          const avgMillisToLoadChunk = Math.round(1500 * (remainingInChunk / chunkMaxCount));
          estimatedProgressInterval = setInterval(() => {
            estimatedProgressAmount = estimatedProgressAmount + 1;
            setProgressCurrent(
              Math.min(Math.min(loaded + estimatedProgressAmount, loaded + (chunkMaxCount - 1)), total - 1),
            );
          }, avgMillisToLoadChunk / (remainingInChunk - 1));
        }
        setProgressCurrent(loaded);
        setProgressTotal(total >= 0 ? total : 0);
      };
      progress(0, project.getTotalItemCount() ?? 0);
      // END smooth loading progress bar

      fetchProjectItems(organization, projectNumber, accessToken, progress)
        .then((projectItems) => {
          const dataRows = projectItems
            .filter((item) => (includeClosedIssues === 'true' ? true : item.getState() !== 'CLOSED'))
            .filter((item) =>
              columnFilterEnabled !== 'true' ? true : selectedColumnNames.includes(item.getStatus() ?? ''),
            )
            .map((item) => {
              const rawTitle = item.getTitle() ?? '';
              const rawStatus = item.getStatus() ?? '';
              return {
                Title: (removeTitleEmojis === 'true' ? rawTitle.split(emojiRegex()).join('') : rawTitle).trim(),
                Number: item.getNumber() ?? '',
                Status: (removeStatusEmojis === 'true' ? rawStatus.split(emojiRegex()).join('') : rawStatus).trim(),
                Assignees:
                  item
                    .getAssignees()
                    ?.map((a) => a.name)
                    .join(', ') ?? '',
                'Assignee Usernames':
                  item
                    .getAssignees()
                    ?.map((a) => a.login)
                    .join(', ') ?? '',
                Labels: item.getLabels()?.join(', ') ?? '',
                URL: item.getUrl() ?? '',
                Milestone: item.getMilestone() ?? '',
                Author: item.getAuthor()?.name ?? '',
                'Author Username': item.getAuthor()?.login ?? '',
                CreatedAt: item.getCreatedAt() ?? '',
                UpdatedAt: item.getUpdatedAt() ?? '',
                ClosedAt: item.getClosedAt() ?? '',
                Type: item.getType() ?? '',
                State: item.getState() ?? '',
              };
            });
          // The en-ZA locale uses YYYY/MM/DD. We then replace all / with -.
          // See: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
          const filename = `${project.getTitle()}-${new Date().toLocaleDateString('en-ZA').split('/').join('-')}`;
          if (dataRows.length > 0) {
            const formattedColumnNames =
              removeStatusEmojis === 'true'
                ? knownColumns.map((c) => c.split(emojiRegex()).join('').trim())
                : knownColumns;
            // Group by Status, Assignee, then sort by issue number.
            dataRows.sort((a, b) => {
              // Convert known statuses to characters alphabetically matching the defined Status column order.
              // Such as: a, b, c, etc. Then prefix them with tilde '~' to group them together.
              // That way, the statuses will sort based on the column order. All unknown columns will fall back
              // to alphabetical sorting.
              const aStatusPlaceholder = formattedColumnNames.includes(a.Status)
                ? '~' + String.fromCharCode('a'.charCodeAt(0) + formattedColumnNames.indexOf(a.Status))
                : a.Status;
              const bStatusPlaceholder = formattedColumnNames.includes(b.Status)
                ? '~' + String.fromCharCode('a'.charCodeAt(0) + formattedColumnNames.indexOf(b.Status))
                : b.Status;
              return `${aStatusPlaceholder}.${a.Assignees}.${a.Number}`.localeCompare(
                `${bStatusPlaceholder}.${b.Assignees}.${b.Number}`,
              );
            });
            exportCsv(dataRows, filename);
          } else {
            setNoItemsAlertShown(true);
          }
          setExporting(false);
        })
        .catch((e) => {
          console.error(e);
          setExportProjectItemsError(e);
          setExporting(false);
        });
    }
  };

  const projects = orgProjects ? orgProjects.getProjects() : [];

  const projectRows: JSX.Element[] = projects
    .sort((a, b) => (a.getProjectNumber() ?? 0) - (b.getProjectNumber() ?? 0))
    .map((project, index) => {
      const currentlyExporting = exporting && project.getProjectNumber() === exportingProjectNumber;
      const loadPercentage = Math.round((progressCurrent / progressTotal) * 100) || 0;
      return (
        <tr key={`project-${index}`}>
          <td valign="middle">
            <a href={project.getUrl() ?? ''} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
              {project.getTitle()}
            </a>
          </td>
          <td valign="middle">{project.getProjectNumber()}</td>
          <td valign="middle">{project.getTotalItemCount()}</td>
          <td valign="middle">
            <div className="d-flex flex-column gap-2">
              <div>
                <Button variant="primary" onClick={() => handleExportCSV(project)} disabled={exporting}>
                  {currentlyExporting && <Spinner animation="border" role="status" size="sm" />} Export CSV
                </Button>
              </div>
              {currentlyExporting && (
                <ProgressBar animated variant="success" now={loadPercentage} label={`${loadPercentage}%`} />
              )}
            </div>
          </td>
        </tr>
      );
    });

  const exportCsv = (jsonData: Record<string, any>, filename: string) => {
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      filename,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(jsonData);
  };

  const validSettings = accessToken && organization;

  const selectedColumnElements = selectedColumnNames.map((col, index) => (
    <Badge key={`${col}-${index}`} bg="primary">
      {col}
    </Badge>
  ));

  return (
    <div {...props} style={{ ...props.style }}>
      <Container>
        <Row>
          <Col>
            <h3 className="mt-4">GitHub Project Exporter</h3>
            <div className="d-flex flex-column gap-3">
              {noItemsAlertShown && (
                <Alert variant="danger" className="mb-2">
                  <p className="fw-bold mb-0">There were no items to export.</p>
                </Alert>
              )}
              {loadProjectsError && (
                <Alert variant="danger" className="mb-2">
                  <p className="fw-bold">
                    Could not load projects for organization{' '}
                    <Badge bg="danger" className="font-monospace">
                      {organization}
                    </Badge>
                    . Please check your access token and organization name.
                  </p>
                  <p className="mb-0 font-monospace small">{`${loadProjectsError}`}</p>
                </Alert>
              )}
              {exportProjectItemsError && (
                <Alert variant="danger" className="mb-2">
                  <p className="fw-bold">Could not export project.</p>
                  <p className="mb-0 font-monospace small">{`${exportProjectItemsError}`}</p>
                </Alert>
              )}
              {!accessToken && (
                <Alert variant="danger" className="mb-2">
                  Please add a GitHub access token to <a href={settingsPath}>Exporter Settings</a>.
                </Alert>
              )}
              {!organization && (
                <Alert variant="danger">
                  Please add an organization name to <a href={settingsPath}>Exporter Settings</a>.
                </Alert>
              )}
              {validSettings && loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 150 }}>
                  <Spinner animation="border" role="status" />
                </div>
              )}
              {validSettings && !loading && (
                <Card className="mb-2">
                  <Card.Header>Projects</Card.Header>
                  <Card.Body>
                    <Table striped bordered responsive>
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Number</th>
                          <th>Total Items</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectRows}
                        {projectRows.length === 0 && (
                          <tr>
                            <td colSpan={4}>No projects found.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end">
                      <Button variant="primary" onClick={() => setLoading(true)}>
                        Refresh
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {validSettings && (
                <Card className="mb-2">
                  <Card.Header>Settings</Card.Header>
                  <Card.Body>
                    <Table striped bordered responsive>
                      <thead>
                        <tr>
                          <th>Setting</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Organization</td>
                          <td>
                            <code>{organization}</code>
                          </td>
                        </tr>
                        <tr>
                          <td>Include closed issues</td>
                          <td>
                            <Badge
                              bg={includeClosedIssues === 'true' ? 'primary' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {includeClosedIssues === 'true' ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Remove Status emojis</td>
                          <td>
                            <Badge
                              bg={removeStatusEmojis === 'true' ? 'primary' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {removeStatusEmojis === 'true' ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Remove Title emojis</td>
                          <td>
                            <Badge
                              bg={removeTitleEmojis === 'true' ? 'primary' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {removeTitleEmojis === 'true' ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Columns included</td>
                          <td>
                            {columnFilterEnabled === 'true' ? (
                              <div className="d-flex flex-wrap gap-1">{selectedColumnElements}</div>
                            ) : (
                              <Badge bg="primary">Include all columns</Badge>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end">
                      <a href={settingsPath}>
                        <Button variant="primary">Change Settings</Button>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
