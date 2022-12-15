import React from 'react';
import { Accordion, Alert, Badge, Button, Form, Spinner } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { fetchProjectFields, ProjectField } from '../api/github-projectv2-api';
import {
  EXPORTER_ACCESS_TOKEN_KEY,
  EXPORTER_FIELD_FILTER_ENABLED_KEY,
  EXPORTER_FIELD_FILTER_TEXT_KEY,
  EXPORTER_IS_ORG_KEY,
  EXPORTER_KNOWN_FIELDS_KEY,
  EXPORTER_LOGIN_KEY,
} from './GitHubProjectExporterSettings';
import { useLocalStorageState } from './useLocalStorageState';

export interface GitHubExporterProjectFieldSettings extends DivProps {}

/**
 * Select which fields are included/excluded from the CSV export
 */
export const GitHubProjectFieldSettings = ({ ...props }: GitHubExporterProjectFieldSettings) => {
  const [accessToken] = useLocalStorageState('', EXPORTER_ACCESS_TOKEN_KEY);
  const [isOrg] = useLocalStorageState('true', EXPORTER_IS_ORG_KEY);
  const [login] = useLocalStorageState('', EXPORTER_LOGIN_KEY);

  const [projectFields, setProjectFields] = React.useState<ProjectField[] | undefined>(undefined);
  const [loadProjectFieldsError, setLoadProjectFieldsError] = React.useState<Error | undefined>(undefined);

  const [loading, setLoading] = React.useState(true);

  const [knownFieldsText, setKnownFieldsText] = useLocalStorageState('', EXPORTER_KNOWN_FIELDS_KEY);
  const [fieldsFilterEnabled, setFieldsFilterEnabled] = useLocalStorageState(
    'false',
    EXPORTER_FIELD_FILTER_ENABLED_KEY,
  );
  const [fieldsFilterText, setFieldsFilterText] = useLocalStorageState(knownFieldsText, EXPORTER_FIELD_FILTER_TEXT_KEY);

  const [enteredKnownFields, setEnteredKnownFields] = React.useState('');
  const knownFieldsRef = React.useRef<HTMLInputElement>(null);

  const selectedFieldsNames = (fieldsFilterText ?? '').split(',').filter((c) => !!c);
  const knownFields = (knownFieldsText ?? '').split(',').filter((c) => !!c);

  const addKnownField = (col: string) => {
    setKnownFieldsText([...new Set([...knownFields, col.trim()])].join(','));
  };
  const deleteKnownField = (col: string) => {
    const colsCopy = [...knownFields];
    colsCopy.splice(colsCopy.indexOf(col), 1);
    setKnownFieldsText(colsCopy.join(','));
  };

  const fieldNameBadgeElements = knownFields.map((colName, index) => {
    const selected = selectedFieldsNames.includes(colName);
    return (
      <Badge
        key={`col-${index}`}
        bg={selected ? 'primary' : 'light'}
        className={`user-select-none ${selected ? '' : 'text-black'}`}
        onClick={() => {
          if (!selected) {
            setFieldsFilterText([...new Set([...selectedFieldsNames, colName])].join(','));
            setFieldsFilterEnabled('true');
          } else {
            const newNames = [...selectedFieldsNames];
            newNames.splice(newNames.indexOf(colName), 1);
            setFieldsFilterText(newNames.join(','));
            setFieldsFilterEnabled(`${newNames.length > 0}`);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {colName}
      </Badge>
    );
  });

  const knownFieldsElements = knownFields.map((field, index) => (
    <Badge key={`known-col-${index}`} bg="primary">
      <div className="d-flex gap-2 align-items-center">
        {field}
        <span
          className="fw-bold"
          style={{ cursor: 'pointer', fontSize: '120%' }}
          onClick={() => deleteKnownField(field)}
        >
          &times;
        </span>
      </div>
    </Badge>
  ));

  React.useEffect(() => {
    if (accessToken && login && loading) {
      fetchProjectFields(login, isOrg === 'true', 1, accessToken)
        .then((newProjectFields) => {
          setProjectFields(newProjectFields);
          const newKnownFieldsText = newProjectFields.map((f) => f.getName()).join(',');
          setKnownFieldsText(newKnownFieldsText);
          //toggle all fields enabled - only on first load
          if (fieldsFilterEnabled === 'false' && fieldsFilterText === '') setFieldsFilterText(newKnownFieldsText);
        })
        .catch((e) => {
          console.error(e);
          setLoadProjectFieldsError(e);
        })
        .finally(() => setLoading(false));
    }
  }, [accessToken, login, loading, isOrg]);

  return (
    <div {...props} style={{ ...props.style }}>
      {!!loading && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 120 }}>
          <Spinner animation="border" role="status" />
        </div>
      )}
      {loadProjectFieldsError && (
        <Alert variant="danger" className="mb-2">
          <p className="fw-bold">
            Could not load project fields for{' '}
            <Badge bg="danger" className="font-monospace">
              {login}
            </Badge>
            . Please check your access token and login.
          </p>
          <p className="mb-0 font-monospace small">{`${loadProjectFieldsError}`}</p>
        </Alert>
      )}
      {!loading && !!projectFields && (
        <>
          <Form.Group controlId="fg-fields-filter" className="mb-3">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <Form.Check
                label="Include the following fields:"
                id="fields-filter-checkbox"
                checked={fieldsFilterEnabled === 'true'}
                onChange={(e) => setFieldsFilterEnabled(`${e.target.checked}`)}
                className="user-select-none"
              />
              <Form.Control
                type="text"
                value={fieldsFilterText ?? ''}
                placeholder={fieldsFilterEnabled !== 'true' ? '' : 'Enter field name'}
                onChange={(e) => setFieldsFilterText(e.target.value)}
                style={{ width: 220 }}
                disabled={fieldsFilterEnabled !== 'true'}
              />
            </div>
            <div className="d-flex flex-wrap gap-2 ms-4">{fieldNameBadgeElements}</div>
          </Form.Group>

          <Form.Group controlId="known-fields-groups" className="mb-3">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex gap-2">
                    Item Fields
                    <Badge pill bg={projectFields.length > 0 ? 'primary' : 'secondary'}>
                      {projectFields.length}
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Form.Control
                      ref={knownFieldsRef}
                      type="text"
                      value={enteredKnownFields}
                      placeholder="Enter field name"
                      onChange={(e) => setEnteredKnownFields(e.target.value)}
                      autoComplete="off"
                      style={{ width: 200 }}
                    />
                    <Button
                      variant="primary"
                      onClick={() => {
                        addKnownField(enteredKnownFields);
                        setEnteredKnownFields('');
                        knownFieldsRef.current?.focus();
                      }}
                    >
                      Add Field
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-2">{knownFieldsElements}</div>
                  <div>
                    <Form.Control
                      type="text"
                      value={knownFieldsText ?? ''}
                      placeholder={knownFieldsText ? '' : 'Add a field above'}
                      onChange={(e) => setKnownFieldsText(e.target.value)}
                      style={{ width: 550 }}
                    />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Form.Text className="text-muted">
              Optionally, you can select the optional fields that will be included as headers in the generated CSV file.
              Custom fields are fetched from the user/org's active projects.
            </Form.Text>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => setLoading(true)}>
              Refresh
            </Button>
          </div>
        </>
      )}
    </div>
  );
};