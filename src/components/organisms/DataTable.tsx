import type { ReactNode } from 'react'

export type DataTableColumn<TData> = {
  id: string
  header: string
  cell: (row: TData) => ReactNode
}

type DataTableProps<TData> = {
  caption: string
  columns: DataTableColumn<TData>[]
  data: TData[]
  emptyMessage: string
  getRowId: (row: TData) => string
}

export const DataTable = <TData,>({
  caption,
  columns,
  data,
  emptyMessage,
  getRowId,
}: DataTableProps<TData>): React.ReactElement => (
  <div className="demo-table-shell">
    <table className="demo-table">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td className="text-center" colSpan={Math.max(columns.length, 1)}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((column) => (
                <td key={column.id}>{column.cell(row)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)
