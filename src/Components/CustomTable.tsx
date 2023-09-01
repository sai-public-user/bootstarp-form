import { ReactNode, useMemo, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Table from "react-bootstrap/Table";
import TableActions from "./TableActions";
import Excel from "exceljs";
import { saveAs } from "file-saver";

export interface CustomColumn {
  name: string;
  label: React.ReactNode;
  width?: number | string;
  showInExcel?: boolean;
  cellClass?: string;
  headerClass?: string;
  renderHeader?: (label: React.ReactNode, col: CustomColumn) => React.ReactNode;
  renderRow?: (value: any, row: CustomRow, index: number) => React.ReactNode;
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
  title?: string;
  hasTableActions?: boolean;
  tableActionProps?: any;
}

async function CreateExcel(
  name: string,
  columns: CustomColumn[],
  rows: CustomRow[]
) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(name);
  worksheet.columns = columns
    .filter((col) => col.showInExcel)
    .map((col) => ({ header: col.label as string, key: col.name as string }));
  worksheet.addRows(rows);
  await workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `${name}.xlsx`);
  });
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
  const [search, setSearch] = useState("");
  const newRows = useMemo(() => {
    const searchedRows = rows.filter((row) =>
      JSON.stringify(Object.values(row)).includes(search)
    );
    return searchedRows.slice((page - 1) * rowsPerPage, rowsPerPage * page);
  }, [page, rows, rowsPerPage, search]);
  const { onSearch, onDownload, onAddRow, ...actionProps } = tableActionProps;

  const handleSearch = (search: string) => {
    onSearch ? onSearch(search) : setSearch(search);
  };
  const handleDownload = () => {
    // add default download logic
    if (onDownload) onDownload();
    else {
      CreateExcel(`${title.replace(/ /g, "_")}_${Date.now()}`, columns, rows);
    }
  };
  const handleAddRow = () => {
    if (onAddRow) onAddRow();
  };

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
              onSearch={handleSearch}
              onDownload={handleDownload}
              onAddRow={handleAddRow}
              {...actionProps}
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
                    {col.renderHeader
                      ? col.renderHeader(col.label, col)
                      : col.label}
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
                    {columns.map(({ name, width, cellClass, renderRow }) => {
                      return (
                        <td
                          key={`${tableName}_${name}_${index}`}
                          style={{ width }}
                          className={cellClass}
                          title={
                            (typeof row[name] === "string"
                              ? row[name]
                              : "") as string
                          }
                        >
                          {renderRow
                            ? renderRow(
                                row[name],
                                row,
                                index + (page - 1) * rowsPerPage
                              )
                            : row[name]}
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
