"use client";
import { Table } from "../../../components/ui/Table";
import { money } from "../../../lib/format";
import type { Row } from "../../../lib/types";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "page" | "report" | "setReport" | "from" | "setFrom" | "to" | "setTo" | "data"
>;
export function ReportsView({
  page,
  report,
  setReport,
  from,
  setFrom,
  to,
  setTo,
  data,
}: Props) {
  return (
    <>
      {page === "Reports" && (
        <section className="card">
          <div className="toolbar">
            <select
              aria-label="Report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              style={{ width: 200 }}
            >
              {[
                "daily",
                "monthly",
                "methods",
                "online",
                "exceptions",
                "gold_by_purity",
                "outstanding",
                "ledger",
                "maturing",
                "redemptions",
                "staff",
              ].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <input
              aria-label="From date"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{ width: 160 }}
            />
            <input
              aria-label="To date"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ width: 160 }}
            />
            <a
              className="button"
              href={`/api/v1/reports/${report}?from=${from}&to=${to}&format=csv`}
            >
              Export CSV
            </a>
          </div>
          <Table
            rows={data || []}
            columns={Object.keys(data?.[0] || {}).map((k) => [
              k.replaceAll("_", " "),
              (r: Row) =>
                k.includes("paise") ? money(r[k]) : String(r[k] ?? ""),
            ])}
          />
        </section>
      )}
    </>
  );
}
