"use client";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data" | "busy" | "open">;
export function StaffView({ page, data, busy, open }: Props) {
  return (
    <>
      {page === "Staff" && (
        <section className="card">
          <Table
            rows={data || []}
            columns={[
              [
                "Name",
                (r) => (
                  <>
                    {r.name}
                    <span className="row-detail">{r.username}</span>
                  </>
                ),
              ],
              ["Role", (r) => r.role],
              [
                "Permissions",
                (r) =>
                  Object.entries(r.permissions)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join(", "),
              ],
              [
                "Status",
                (r) => <Badge value={r.active ? "Active" : "Disabled"} />,
              ],
              [
                "Access",
                (r) =>
                  r.role === "staff" && (
                    <button
                      className="link"
                      disabled={busy}
                      onClick={() => open("staffEdit", { record: r })}
                    >
                      Manage access
                    </button>
                  ),
              ],
            ]}
          />
        </section>
      )}
    </>
  );
}
