import { ReactNode, useMemo, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Table from "react-bootstrap/Table";
import TableActions from "./TableActions";

export interface CustomColumn {
  name: string;
  label: React.ReactNode;
  width?: number | string;
  cellClass?: string;
  headerClass?: string;
}

export interface CustomRow {
  [name: string]: React.ReactNode;
}

export interface CustomTableProps {
  columns: CustomColumn[];
  rows: CustomRow[];
  showIndex?: boolean;
  tableName?: string;
  selectable?: boolean;
  expandable?: boolean;
  headerRowClass?: string;
  rowClass?: string;
  responsive?: boolean;
  rowsPerPage?: number;
  editable?: boolean;
  pagination?: "default" | false | ReactNode;
  title?: String;
  hasTableActions?: boolean;
  tableActionProps?: any;
}

function CustomTable({
  columns,
  rows,
  showIndex = false,
  tableName = "custom_table",
  headerRowClass = "",
  rowClass = "",
  responsive = true,
  rowsPerPage = 10,
  pagination = false,
  editable = false,
  title = "Table title",
  hasTableActions,
  tableActionProps = {},
  ...rest
}: CustomTableProps) {
  const [page, setPage] = useState(1);
  const [editRow, setEditRow] = useState<null | number>(null);
  const newRows = useMemo(() => {
    return rows.slice((page - 1) * rowsPerPage, rowsPerPage * page);
  }, [page, rows, rowsPerPage]);

  const commonClass = "d-flex justify-content-center align-items-center";
  return (
    <Stack>
      {(title || hasTableActions) && (
        <Row className="p-3">
          <Col
            sm={12}
            md={6}
            className={`h4 justify-content-lg-start ${commonClass}`}
          >
            {title}
          </Col>
          <Col
            sm={12}
            md={6}
            className={`justify-content-lg-end ${commonClass}`}
          >
            <TableActions
              hasAddRow
              hasDownload
              hasSearch
              {...tableActionProps}
            />
          </Col>
        </Row>
      )}
      <Row>
        <Stack>
          <Table responsive={responsive} {...rest}>
            <thead>
              <tr className={headerRowClass}>
                {showIndex && <th>#</th>}
                {columns.map((col) => (
                  <th
                    className={`${col.headerClass || ""}`}
                    style={{ width: col.width }}
                    key={col.name}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {newRows.map((row, index) => {
                return (
                  <tr key={`${tableName}_${index}`} className={rowClass}>
                    {showIndex && (
                      <td>{index + 1 + (page - 1) * rowsPerPage}</td>
                    )}
                    {columns.map(({ name, width, cellClass }) => {
                      return (
                        <td
                          key={`${tableName}_${name}_${index}`}
                          style={{ width }}
                          className={cellClass}
                          onClick={() =>
                            setEditRow(index + 1 + (page - 1) * rowsPerPage)
                          }
                          title={
                            (typeof row[name] === "string"
                              ? row[name]
                              : "") as string
                          }
                        >
                          {row[name]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {pagination === "default" ? (
            <PaginationControl
              page={page}
              between={3}
              total={rows.length}
              limit={rowsPerPage}
              changePage={(page) => {
                setPage(page);
              }}
              ellipsis={2}
            />
          ) : (
            pagination || null
          )}
        </Stack>
      </Row>
    </Stack>
  );
}

export default CustomTable;
