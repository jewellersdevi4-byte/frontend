"use client";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data" | "owner" | "open">;
export function PaymentProofsView({ page, data, owner, open }: Props) {
  return (
    <>
      {page === "Payment proofs" && (
        <section className="card">
          <div className="banner">
            Customer-reported payments and counter cash deposits. Verify receipt
            before issuing official receipt.
          </div>
          <Table
            rows={data || []}
            columns={[
              ["Customer", (r) => r.customer_name || "Unidentified sender"],
              [
                "Payment details",
                (r) => (
                  <strong>
                    {r.review_note || r.message?.text || "Payment reported"}
                  </strong>
                ),
              ],
              ["Status", (r) => <Badge value={r.status} />],
              [
                "Received",
                (r) =>
                  new Date(r.created_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  }),
              ],
              [
                "Receipt",
                (r) =>
                  r.receipt_number ? (
                    <a
                      className="receipt"
                      href={"/api/v1/receipts/" + r.receipt_id}
                      target="_blank"
                    >
                      {r.receipt_number}
                    </a>
                  ) : (
                    "—"
                  ),
              ],
              [
                "Actions",
                (r) =>
                  owner && r.status === "pending" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="link"
                        onClick={() => open("approveProof", { record: r })}
                      >
                        Approve
                      </button>
                      <button
                        className="link"
                        style={{ color: "#a23d2a" }}
                        onClick={() => open("rejectProof", { record: r })}
                      >
                        Reject
                      </button>
                    </div>
                  ) : r.review_note ? (
                    <span className="row-detail">{r.review_note}</span>
                  ) : null,
              ],
            ]}
          />
        </section>
      )}
    </>
  );
}
