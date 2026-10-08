"use client";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  | "page"
  | "customer"
  | "account"
  | "setCustomer"
  | "open"
  | "owner"
  | "setModal"
  | "selectAccount"
>;
export function CustomerDetailsView({
  page,
  customer,
  account,
  setCustomer,
  open,
  owner,
  setModal,
  selectAccount,
}: Props) {
  return (
    <>
      {page === "Customers" && customer && !account && (
        <>
          <div className="toolbar">
            <button className="button" onClick={() => setCustomer(null)}>
              ← All customers
            </button>
            <button
              className="button"
              onClick={() => open("customer", { record: customer })}
            >
              Edit customer
            </button>
            {owner && (
              <button
                className="button danger"
                style={{ background: "#c0392b", color: "#fff" }}
                onClick={() =>
                  setModal({ type: "deleteCustomer", record: customer })
                }
              >
                Delete customer
              </button>
            )}
          </div>
          <section className="card">
            <div className="key-value">
              <p>
                <small>Customer ID</small>
                {customer.number}
              </p>
              <p>
                <small>Mobile / WhatsApp</small>
                {customer.mobile} / {customer.whatsapp}
              </p>
              <p>
                <small>Address</small>
                {customer.address}
              </p>
              <p>
                <small>Consent</small>
                {customer.consent ? "Opted in" : "Not opted in"} ·{" "}
                {customer.consent_method || "No method recorded"}
              </p>
            </div>
          </section>
          <section className="card">
            <header>
              <h2>Scheme accounts</h2>
            </header>
            <Table
              rows={customer.accounts}
              columns={[
                [
                  "Account",
                  (r) => (
                    <button className="link" onClick={() => selectAccount(r)}>
                      {r.number}
                      <span className="row-detail">{r.scheme_name}</span>
                    </button>
                  ),
                ],
                ["Total funded", (r) => money(r.totalPaid)],
                ["Due now", (r) => money(r.dueNow)],
                [
                  "Gold quantity",
                  (r) => (
                    <strong>
                      {r.totalReservedGrams ? r.totalReservedGrams + " g" : "—"}
                    </strong>
                  ),
                ],
                ["Status", (r) => <Badge value={r.status} />],
              ]}
            />
          </section>
          <section className="card">
            <h2>WhatsApp history</h2>
            <Table
              rows={customer.messages}
              columns={[
                ["Date", (r) => new Date(r.created_at).toLocaleString()],
                ["Message", (r) => r.body.text || r.kind],
                ["Status", (r) => <Badge value={r.status} />],
              ]}
            />
          </section>
        </>
      )}
    </>
  );
}
