import type { ReactNode } from "react";
import type { Row } from "../../lib/types";
import { Empty } from "./Empty";
export function Table({
  columns,
  rows,
}: {
  columns: [string, (r: Row) => ReactNode][];
  rows: Row[];
}) {
  return rows.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(([h]) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}>
              {columns.map(([h, render]) => (
                <td key={h}>{render(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty />
  );
}
