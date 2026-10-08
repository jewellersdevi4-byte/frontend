"use client";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import { api } from "../../../lib/api";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "page" | "data" | "owner" | "busy" | "action"
>;
export function MessagesView({ page, data, owner, busy, action }: Props) {
  return (
    <>
      {page === "Messages" && (
        <section className="card">
          <div className="banner">
            Accepted does not mean delivered. Unknown outcomes require provider
            reconciliation before any resend.
          </div>
          <Table
            rows={data || []}
            columns={[
              ["Customer", (r) => r.customer_name || "Unknown sender"],
              ["Message", (r) => r.kind],
              ["Job state", (r) => <Badge value={r.state} />],
              [
                "Delivery",
                (r) => <Badge value={r.delivery_status || "Not dispatched"} />,
              ],
              [
                "Details",
                (r) => r.error || new Date(r.created_at).toLocaleString(),
              ],
              [
                "Action",
                (r) =>
                  owner &&
                  r.state === "failed" && (
                    <button
                      className="link"
                      disabled={busy}
                      onClick={() =>
                        action(() =>
                          api("/messages/" + r.id + "/retry", "POST"),
                        )
                      }
                    >
                      Retry rejection
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
