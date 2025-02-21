import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Accordion, Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { exporterPath } from './GitHubProjectExporter';
import { useExporterSettings } from './useExporterSettings';

export const settingsPath = '/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--settings';
export interface GitHubExporterSettingsProps extends DivProps {}

/**
 * Settings for the GitHub project exporter.
 */
export const GitHubExporterSettings = ({ ...props }: GitHubExporterSettingsProps) => {
  const exporterSettings = useExporterSettings();
  const [accessToken, setAccessToken] = exporterSettings.accessTokenState;
  const [isOrg, setIsOrg] = exporterSettings.isOrgState;
  const [login, setLogin] = exporterSettings.loginState;
  const [includeIssues, setIncludeIssues] = exporterSettings.includeIssuesState;
  const [includePullRequests, setIncludePullRequests] = exporterSettings.includePullRequestsState;
  const [includeDraftIssues, setIncludeDraftIssues] = exporterSettings.includeDraftIssuesState;
  const [includeClosedItems, setIncludeClosedItems] = exporterSettings.includeClosedItemsState;
  const [includeBody, setIncludeBody] = exporterSettings.includeBody;
  const [removeStatusEmojis, setRemoveStatusEmojis] = exporterSettings.removeStatusEmojisState;
  const [removeTitleEmojis, setRemoveTitleEmojis] = exporterSettings.removeTitleEmojisState;
  const [knownColumnsText, setKnownColumnsText] = exporterSettings.knownColumnsTextState;
  const [columnFilterEnabled, setColumnFilterEnabled] = exporterSettings.columnFilterEnabledState;
  const [columnFilterText, setColumnFilterText] = exporterSettings.columnFilterTextState;

  const [enteredKnownColumn, setEnteredKnownColumn] = React.useState('');
  const knownColumnRef = React.useRef<HTMLInputElement>(null);

  const selectedColumnNames = (columnFilterText ?? '').split(',').filter((c) => !!c);
  const knownColumns = (knownColumnsText ?? '').split(',').filter((c) => !!c);

  const addKnownColumn = (col: string) => {
    setKnownColumnsText([...new Set([...knownColumns, col.trim()])].join(','));
  };
  const deleteKnownColumn = (col: string) => {
    const colsCopy = [...knownColumns];
    colsCopy.splice(colsCopy.indexOf(col), 1);
    setKnownColumnsText(colsCopy.join(','));
  };

  const columnNameBadgeElements = knownColumns.map((colName, index) => {
    const selected = selectedColumnNames.includes(colName);
    return (
      <Badge
        key={`col-${index}`}
        bg={selected ? 'primary' : 'light'}
        className={`user-select-none ${selected ? '' : 'text-black'}`}
        onClick={() => {
          if (!selected) {
            setColumnFilterText([...new Set([...selectedColumnNames, colName])].join(','));
            setColumnFilterEnabled(true);
          } else {
            const newNames = [...selectedColumnNames];
            newNames.splice(newNames.indexOf(colName), 1);
            setColumnFilterText(newNames.join(','));
            setColumnFilterEnabled(newNames.length > 0);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {colName}
      </Badge>
    );
  });

  const knownColumnsElements = knownColumns.map((column, index) => (
    <Badge key={`known-col-${index}`} bg="primary">
      <div className="d-flex gap-2 align-items-center">
        {column}
        <span
          className="fw-bold"
          style={{ cursor: 'pointer', fontSize: '120%' }}
          onClick={() => deleteKnownColumn(column)}
        >
          &times;
        </span>
      </div>
    </Badge>
  ));

  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <Container>
        <Row>
          <Col>
            <h3 className="mt-4">GitHub Project CSV Exporter (ProjectV2)</h3>
            <Card>
              <Card.Header>GitHub Exporter Settings</Card.Header>
              <Card.Body>
                <p className="text-muted">These changes will be saved to your browser's local storage.</p>
                <Form.Group controlId="fg-token" className="mb-3">
                  <Form.Label className="fs-6 mb-0">GitHub Access Token</Form.Label>
                  <Form.Control
                    type="text"
                    value={accessToken || ''}
                    placeholder="Paste your GitHub token here"
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    <p className="mb-1">
                      Create an access token by{' '}
                      <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                        clicking here
                      </a>
                      . Name it{' '}
                      <Badge bg="primary" className="font-monospace">
                        GITHUB_EXPORTER_TOKEN
                      </Badge>{' '}
                      and set the Expiration to <Badge bg="primary">No expiration</Badge>. Your access token must
                      include the following scopes: <Badge bg="success">repo</Badge>{' '}
                      <Badge bg="success">read:org</Badge> <Badge bg="success">read:user</Badge>{' '}
                      <Badge bg="success">read:project</Badge>
                    </p>
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="fg-closed-issues" className="mb-3">
                  <Form.Check
                    label="This is an organization"
                    id="is-org-checkbox"
                    checked={!!isOrg}
                    onChange={(e) => setIsOrg(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-org" className="mb-4">
                  <Form.Label className="fs-6 mb-0">{isOrg ? 'Organization' : 'Username'}</Form.Label>
                  <Form.Control
                    type="text"
                    value={login || ''}
                    placeholder="Enter the login"
                    onChange={(e) => setLogin(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Note: You can use the{' '}
                    <Badge
                      bg="secondary font-monospace"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setIsOrg(true);
                        setLogin('microsoft');
                      }}
                    >
                      microsoft
                    </Badge>{' '}
                    organization for testing.
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="fg-issues" className="mb-3">
                  <Form.Check
                    label="Include issues"
                    id="issues-checkbox"
                    checked={!!includeIssues}
                    onChange={(e) => setIncludeIssues(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-pull-requests" className="mb-3">
                  <Form.Check
                    label="Include pull requests"
                    id="pull-requests-checkbox"
                    checked={!!includePullRequests}
                    onChange={(e) => setIncludePullRequests(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-draft-issues" className="mb-3">
                  <Form.Check
                    label="Include draft issues"
                    id="draft-issues-checkbox"
                    checked={!!includeDraftIssues}
                    onChange={(e) => setIncludeDraftIssues(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-closed-items" className="mb-3">
                  <Form.Check
                    label="Include closed items"
                    id="closed-issues-checkbox"
                    checked={!!includeClosedItems}
                    onChange={(e) => setIncludeClosedItems(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-body" className="mb-3">
                  <Form.Check
                    label="Include body"
                    id="body-checkbox"
                    checked={!!includeBody}
                    onChange={(e) => setIncludeBody(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-filter-emojis" className="mb-3">
                  <Form.Check
                    label="🧪🛠️ Remove emojis from Status"
                    id="filter-status-emojis-checkbox"
                    checked={!!removeStatusEmojis}
                    onChange={(e) => setRemoveStatusEmojis(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>
                <Form.Group controlId="fg-filter-emojis" className="mb-3">
                  <Form.Check
                    label="🐞💡 Remove emojis from Title"
                    id="filter-title-emojis-checkbox"
                    checked={!!removeTitleEmojis}
                    onChange={(e) => setRemoveTitleEmojis(e.target.checked)}
                    className="user-select-none"
                  />
                </Form.Group>

                <Form.Group controlId="fg-column-filter" className="mb-3">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <Form.Check
                      label="Only include issues in the following statuses:"
                      id="column-filter-checkbox"
                      checked={!!columnFilterEnabled}
                      onChange={(e) => setColumnFilterEnabled(e.target.checked)}
                      className="user-select-none"
                    />
                    <Form.Control
                      type="text"
                      value={columnFilterText ?? ''}
                      placeholder={!columnFilterEnabled ? '' : 'Enter status name'}
                      onChange={(e) => setColumnFilterText(e.target.value)}
                      style={{ width: 220 }}
                      disabled={!columnFilterEnabled}
                    />
                  </div>
                  <div className="d-flex flex-wrap gap-2 ms-4">{columnNameBadgeElements}</div>
                </Form.Group>
                <Form.Group controlId="known-columns-groups" className="mb-3">
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <div className="d-flex gap-2">
                          Known Statuses
                          <Badge pill bg={knownColumns.length > 0 ? 'primary' : 'secondary'}>
                            {knownColumns.length}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          <Form.Control
                            ref={knownColumnRef}
                            type="text"
                            value={enteredKnownColumn}
                            placeholder="Enter status name"
                            onChange={(e) => setEnteredKnownColumn(e.target.value)}
                            autoComplete="off"
                            style={{ width: 200 }}
                          />
                          <Button
                            variant="primary"
                            onClick={() => {
                              addKnownColumn(enteredKnownColumn);
                              setEnteredKnownColumn('');
                              knownColumnRef.current?.focus();
                            }}
                          >
                            Add Status
                          </Button>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mb-2">{knownColumnsElements}</div>
                        <div>
                          <Form.Control
                            type="text"
                            value={knownColumnsText ?? ''}
                            placeholder={knownColumnsText ? '' : 'Add a status above'}
                            onChange={(e) => setKnownColumnsText(e.target.value)}
                            style={{ width: 220 }}
                          />
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Form.Text className="text-muted">
                    Optionally, you can add the status names from your project's boards if you'd like to filter your
                    results based on specific statuses. Adding Known Statuses makes it easier to filter using the "Only
                    include issues in the following statuses" setting above. Your CSV will also sort cards in the order
                    these known statuses appear.
                  </Form.Text>
                </Form.Group>
                <div className="d-flex justify-content-end mt-4">
                  <a href={exporterPath}>
                    <Button variant="primary">Open Exporter</Button>
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
