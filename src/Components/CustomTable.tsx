import { ReactNode, useMemo, useState } from "react";
import { Pagination, Stack } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Table from "react-bootstrap/Table";

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
  pagination?: "default" | false | ReactNode;
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
  ...rest
}: CustomTableProps) {
  const [page, setPage] = useState(1);
  const newRows = useMemo(() => {
    return rows.slice((page - 1) * rowsPerPage, rowsPerPage * page);
  }, [page, rows, rowsPerPage]);
  return (
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
                {showIndex && <td>{index + 1 + (page - 1) * rowsPerPage}</td>}
                {columns.map(({ name, width, cellClass }) => {
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
        // <Pagination className="justify-content-center">
        //   <Pagination.First />
        //   <Pagination.Prev />
        //   <Pagination.Item>{1}</Pagination.Item>
        //   <Pagination.Ellipsis />

        //   <Pagination.Item>{10}</Pagination.Item>
        //   <Pagination.Item>{11}</Pagination.Item>
        //   <Pagination.Item active>{12}</Pagination.Item>
        //   <Pagination.Item>{13}</Pagination.Item>
        //   <Pagination.Item disabled>{14}</Pagination.Item>

        //   <Pagination.Ellipsis />
        //   <Pagination.Item>{20}</Pagination.Item>
        //   <Pagination.Next />
        //   <Pagination.Last />
        // </Pagination>
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
  );
}

export default CustomTable;
