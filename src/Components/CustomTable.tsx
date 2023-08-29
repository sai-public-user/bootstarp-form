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
}

function CustomTable({
  columns,
  rows,
  showIndex = false,
  tableName = "custom_table",
  headerRowClass = "",
  rowClass = "",
  responsive = true,
  ...rest
}: CustomTableProps) {
  return (
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
        {rows.map((row, index) => {
          return (
            <tr key={`${tableName}_${index}`} className={rowClass}>
              {showIndex && <td>{index + 1}</td>}
              {columns.map(({ name, width, cellClass }) => {
                return (
                  <td
                    key={`${tableName}_${name}_${index}`}
                    style={{ width }}
                    className={cellClass}
                    title={
                      (typeof row[name] === "string" ? row[name] : "") as string
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
  );
}

export default CustomTable;
