import { Row, Card, Button, Stack, Col } from "react-bootstrap";
import CustomField from "./CustomField";
import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const IncrementalFields = forwardRef(
  ({ fields, onChange, name, max = 10, ...props }, ref) => {
    const fieldsNamesObj = useMemo(() => {
      if (fields && Array.isArray(fields)) {
        return fields.reduce((acc, field) => {
          if (field?.name) {
            acc[field?.name] = null;
          }
          return acc;
        }, {});
      }
      return {};
    }, [fields]);

    const [rowsData, setRowsData] = useState([{ ...fieldsNamesObj }]);
    const addNewRow = () => {
      setRowsData((prev) => [...prev, { ...fieldsNamesObj }]);
    };

    useEffect(() => {
      if (onChange) {
        onChange({ target: { name: name, value: rowsData } });
      }
    }, [rowsData]);

    const handleChange = useCallback(
      (rowId, evt) => {
        if (rowsData.length > rowId) {
          rowsData[rowId][evt.target.name] = evt.target.name;
          setRowsData(rowsData);
        }
      },
      [rowsData]
    );

    const deleteRow = useCallback(
      (index) => {
        if (rowsData.length > index) {
          rowsData.splice(index, 1);
          setRowsData(rowsData);
        }
      },
      [rowsData]
    );

    return (
      <Card className="p-3">
        <Stack gap={3}>
          {rowsData.map((rowData, rowIdx) => (
            <Row key={`meta_row_${rowIdx}`}>
              {fields?.map((field, fieldIdx) => (
                <Col md={6} lg={4}>
                  <CustomField
                    ref={(ele) => ref?.current?.push(ele)}
                    {...field}
                    key={`meta_field_${rowIdx}${fieldIdx}_${field.name}`}
                    onChange={(evt) => handleChange(rowIdx, evt)}
                  />
                </Col>
              ))}
              <Col md={1}>
                <Stack className="flex-row mt-3" gap={3}>
                  {rowIdx === rowsData.length - 1 && (
                    <Button
                      variant="primary"
                      title="Add New"
                      onClick={addNewRow}
                    >
                      <svg
                        style={{ width: 24, height: 24 }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </Button>
                  )}
                  {rowsData.length > 1 && (
                    <Button
                      variant="secondary"
                      title="Delete"
                      onClick={() => deleteRow(rowIdx)}
                    >
                      <svg
                        style={{ width: 24, height: 24 }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </Button>
                  )}
                </Stack>
              </Col>
            </Row>
          ))}
        </Stack>
      </Card>
    );
  }
);

export default IncrementalFields;
