import 'bootstrap/dist/css/bootstrap.css';
import emojiRegex from 'emoji-regex';
import { ExportToCsv } from 'export-to-csv';
import React from 'react';
import { Alert, Badge, Button, Card, Col, Container, Image, ProgressBar, Row, Spinner, Table } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { fetchProjectItems, fetchProjects, Project, Projects } from '../api/github-projectv2-api';
import { settingsPath } from './GitHubProjectExporterSettings';
import { useExporterSettings } from './useExporterSettings';

export const exporterPath = '/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--exporter';

export interface GitHubProjectExporterProps extends DivProps {}

/**
 * Use this tool to export issues from a GitHub project as a CSV.
 */
export const GitHubProjectExporter = (props: GitHubProjectExporterProps) => {
  const exporterSettings = useExporterSettings();
  const [accessToken] = exporterSettings.accessTokenState;
  const [isOrg] = exporterSettings.isOrgState;
  const [login] = exporterSettings.loginState;
  const [includeIssues] = exporterSettings.includeIssuesState;
  const [includePullRequests] = exporterSettings.includePullRequestsState;
  const [includeDraftIssues] = exporterSettings.includeDraftIssuesState;
  const [includeClosedItems] = exporterSettings.includeClosedItemsState;
  const [removeStatusEmojis] = exporterSettings.removeStatusEmojisState;
  const [removeTitleEmojis] = exporterSettings.removeTitleEmojisState;
  const [knownColumnsText] = exporterSettings.knownColumnsTextState;
  const [columnFilterEnabled] = exporterSettings.columnFilterEnabledState;
  const [columnFilterText] = exporterSettings.columnFilterTextState;
  const knownColumns = (knownColumnsText ?? '').split(',').filter((c) => !!c);
  const selectedColumnNames = (columnFilterText ?? '').split(',').filter((c) => !!c);

  const [projects, setProjects] = React.useState<Projects | undefined>(undefined);
  const [loadProjectsError, setLoadProjectsError] = React.useState<Error | undefined>(undefined);
  const [exportProjectItemsError, setExportProjectItemsError] = React.useState<Error | undefined>(undefined);
  const [noItemsAlertShown, setNoItemsAlertShown] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);
  const [exportingProjectNumber, setExportingProjectNumber] = React.useState(-1);
  const [progressCurrent, setProgressCurrent] = React.useState(0);
  const [progressTotal, setProgressTotal] = React.useState(0);
  const [showStarMessage, setShowStarMessage] = React.useState(false);

  const noItemsIncluded = !includeIssues && !includePullRequests && includeDraftIssues;

  React.useEffect(() => {
    if (accessToken && login && loading) {
      fetchProjects(login, !!isOrg, accessToken)
        .then((orgProjects) => {
          setProjects(orgProjects);
        })
        .catch((e) => {
          console.error(e);
          setLoadProjectsError(e);
        })
        .finally(() => setLoading(false));
    }
  }, [accessToken, login, loading, isOrg]);

  const handleExportCSV = (project: Project) => {
    const projectNumber = project.getProjectNumber() ?? -1;
    if (accessToken && login && projectNumber >= 0) {
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

      fetchProjectItems(login, !!isOrg, projectNumber, accessToken, progress)
        .then((projectItems) => {
          const dataRows = projectItems
            .filter((item) => {
              return (
                (includeIssues ? true : item.getType() !== 'ISSUE') &&
                (includePullRequests ? true : item.getType() !== 'PULL_REQUEST') &&
                (includeDraftIssues ? true : item.getType() !== 'DRAFT_ISSUE') &&
                (includeClosedItems ? true : item.getState() !== 'CLOSED') &&
                (!columnFilterEnabled ? true : selectedColumnNames.includes(item.getStatus() ?? ''))
              );
            })
            .map((item) => {
              const rawTitle = item.getTitle() ?? '';
              const rawStatus = item.getStatus() ?? '';
              return {
                Title: (removeTitleEmojis ? rawTitle.split(emojiRegex()).join('') : rawTitle).trim(),
                Number: item.getNumber() ?? '',
                Status: (removeStatusEmojis ? rawStatus.split(emojiRegex()).join('') : rawStatus).trim(),
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
            const formattedColumnNames = removeStatusEmojis
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
            setShowStarMessage(true);
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

  const projectRows: JSX.Element[] = (projects ? projects.getProjects() : [])
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
                <Button
                  variant="primary"
                  onClick={() => handleExportCSV(project)}
                  disabled={exporting || !project.getTotalItemCount()}
                >
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

  const validSettings = accessToken && login;

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
            <h3 className="mt-4">GitHub Project CSV Exporter (ProjectV2)</h3>
            <div className="d-flex flex-column gap-3">
              {noItemsAlertShown && (
                <Alert variant="danger" className="mb-2">
                  <p className="fw-bold mb-0">There were no items to export.</p>
                </Alert>
              )}
              {loadProjectsError && (
                <Alert variant="danger" className="mb-2">
                  <p className="fw-bold">
                    Could not load projects for{' '}
                    <Badge bg="danger" className="font-monospace">
                      {login}
                    </Badge>
                    . Please check your access token and login.
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
              {!validSettings && (
                <Alert variant="primary">
                  <h4>Welcome!</h4>
                  <p>
                    In order to start exporting GitHub project CSVs like it's nobody's business, you first need to do a
                    little setup in <a href={settingsPath}>Exporter Settings</a>:
                  </p>
                  <ul>
                    {!accessToken && (
                      <li>
                        Add a <span className="fw-bold">GitHub access token</span>.
                      </li>
                    )}
                    {!login && (
                      <li>
                        Add an <span className="fw-bold">organization or user login</span>.
                      </li>
                    )}
                  </ul>
                  <p>
                    Just head over to <a href={settingsPath}>settings</a> to get those configured, then come back here
                    when you're ready.
                  </p>
                </Alert>
              )}
              {validSettings && (
                <Card className="mb-0">
                  <Card.Header>Projects</Card.Header>
                  <Card.Body>
                    {loading && (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: 120 }}>
                        <Spinner animation="border" role="status" />
                      </div>
                    )}
                    {!loading && projects && (
                      <div className="d-flex justify-content-between mb-2">
                        <a href={projects.getUrl() ?? ''}>
                          <Badge bg="success">
                            <div className="d-flex align-items-center gap-2">
                              <Image
                                src={projects.getAvatarUrl() ?? ''}
                                roundedCircle
                                style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }}
                              />
                              {projects.getName()}
                            </div>
                          </Badge>
                        </a>
                        {projects.getLogin() !== projects.getViewerLogin() && (
                          <a href={projects.getViewerUrl() ?? ''}>
                            <Badge bg="info">
                              <div className="d-flex align-items-center gap-2">
                                <Image
                                  src={projects.getViewerAvatarUrl() ?? ''}
                                  roundedCircle
                                  style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }}
                                />
                                {projects.getViewerName()}
                              </div>
                            </Badge>
                          </a>
                        )}
                      </div>
                    )}
                    {!loading && (
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
                    )}
                    <div className="d-flex justify-content-end">
                      <Button variant="primary" onClick={() => setLoading(true)}>
                        Refresh
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {validSettings && showStarMessage && (
                <h6 className="text-center text-muted my-2">
                  If this project helped you, please{' '}
                  <a href="https://github.com/justinmahar/github-projectv2-csv-exporter/">Star it on GitHub</a> so
                  others can find it. :)
                </h6>
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
                          <td>{isOrg ? 'Organization' : 'Username'}</td>
                          <td>
                            <code>{login}</code>
                          </td>
                        </tr>
                        <tr>
                          <td>Include issues</td>
                          <td>
                            <Badge
                              bg={includeIssues ? 'primary' : noItemsIncluded ? 'danger' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {includeIssues ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Include pull requests</td>
                          <td>
                            <Badge
                              bg={includePullRequests ? 'primary' : noItemsIncluded ? 'danger' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {includePullRequests ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Include draft issues</td>
                          <td>
                            <Badge
                              bg={includeDraftIssues ? 'primary' : noItemsIncluded ? 'danger' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {includeDraftIssues ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Include closed items</td>
                          <td>
                            <Badge
                              bg={includeClosedItems ? 'primary' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {includeClosedItems ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Remove Status emojis</td>
                          <td>
                            <Badge
                              bg={removeStatusEmojis ? 'primary' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {removeStatusEmojis ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Remove Title emojis</td>
                          <td>
                            <Badge
                              bg={removeTitleEmojis ? 'primary' : 'secondary'}
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {removeTitleEmojis ? 'yes' : 'no'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td>Statuses included</td>
                          <td>
                            {columnFilterEnabled ? (
                              <div className="d-flex flex-wrap gap-1">
                                {selectedColumnElements.length > 0 ? (
                                  selectedColumnElements
                                ) : (
                                  <Badge bg="danger">None</Badge>
                                )}
                              </div>
                            ) : (
                              <Badge bg="primary">Include all statuses</Badge>
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
