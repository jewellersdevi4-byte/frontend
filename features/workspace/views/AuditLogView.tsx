"use client";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data">;
export function AuditLogView({ page, data }: Props) {
  return (
    <>
      {page === "Audit log" && (
        <section className="card">
          <div className="banner">
            Immutable record of all shop activity and administrative events.
          </div>
          <Table
            rows={data || []}
            columns={[
              [
                "Time",
                (r) =>
                  new Date(r.created_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  }),
              ],
              ["Actor", (r) => r.actor_name || "System"],
              ["Action", (r) => <Badge value={r.action} />],
              [
                "Entity ID",
                (r) => (
                  <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {r.entity_id}
                  </span>
                ),
              ],
              [
                "Details",
                (r) => (
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 11,
                      maxHeight: 100,
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(r.details, null, 2)}
                  </pre>
                ),
              ],
            ]}
          />
        </section>
      )}
    </>
  );
}
