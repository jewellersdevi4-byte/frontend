"use client";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import { api } from "../../../lib/api";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  | "account"
  | "page"
  | "setAccount"
  | "open"
  | "setModal"
  | "setError"
  | "owner"
  | "paymentColumns"
>;
export function AccountDetailsView({
  account,
  page,
  setAccount,
  open,
  setModal,
  setError,
  owner,
  paymentColumns,
}: Props) {
  return (
    <>
      {account && page === "Customers" && (
        <>
          <div className="toolbar">
            <button className="button" onClick={() => setAccount(null)}>
              ← Back
            </button>
            <button
              className="button primary"
              onClick={() => open("payment", { accountId: account.id })}
            >
              Record payment
            </button>
            <button
              className="button"
              onClick={async () => {
                try {
                  const intent = await api(
                    "/accounts/" + account.id + "/pay-link",
                    "POST",
                  );
                  setModal({ type: "payLink", intent });
                } catch (e: any) {
                  setError(e.message);
                }
              }}
            >
              Generate Pay Link
            </button>
            {owner && (
              <>
                <button className="button" onClick={() => open("opening")}>
                  Opening balance
                </button>
                <button className="button" onClick={() => open("redeem")}>
                  Redeem / complete
                </button>
              </>
            )}
          </div>
          <section className="card">
            <header>
              <div>
                <h2>
                  {account.number} · {account.customer_name}
                </h2>
                <small>{account.scheme_name}</small>
              </div>
              <Badge value={account.status} />
            </header>
            <div className="key-value">
              <p>
                <small>Started / expected maturity</small>
                {account.start_date} / {account.maturity_date}
              </p>
              <p>
                <small>Formula / Rate</small>
                {account.isGoldScheme
                  ? account.rules.formula === "gold_accumulation"
                    ? "Gold accumulation (Per-payment daily rate)"
                    : "Locked rate: " +
                      money(account.locked_rate) +
                      "/g · " +
                      account.rules.purity
                  : "Money-based scheme"}
              </p>
            </div>
          </section>
          <div className="stats">
            {[
              ["Total funded", account.totalPaid],
              ["Due now", account.dueNow],
              ["Future instalments", account.future],
              ["Available credit", account.remainingCredit],
            ].map(([l, v]) => (
              <div className="stat" key={l}>
                <div className="label">{l}</div>
                <strong>{v === null ? "Gold formula" : money(v)}</strong>
              </div>
            ))}
          </div>
          <section className="card">
            <div className="key-value">
              <p>
                <small>Overdue amount</small>
                {money(account.overdue)}
              </p>
              <p>
                <small>Applied benefit</small>
                {money(account.benefit)}
              </p>
              <p>
                <small>{account.goldGramsLabel || "Total gold quantity"}</small>
                <strong>
                  {account.totalReservedGrams
                    ? account.totalReservedGrams + " grams"
                    : "0.0000 grams"}
                </strong>
              </p>
              <p>
                <small>Remaining gold</small>
                <strong>
                  {account.remainingReservedGrams
                    ? account.remainingReservedGrams + " grams"
                    : "0.0000 grams"}
                </strong>
              </p>
              <p>
                <small>Gold redeemed</small>
                {account.redeemedGrams
                  ? account.redeemedGrams + " grams"
                  : money(account.redeemed)}
              </p>
              <p>
                <small>
                  {account.currentEstimatedValueLabel ||
                    "Current estimated value"}
                </small>
                <strong>
                  {account.currentEstimatedValue
                    ? money(account.currentEstimatedValue)
                    : "N/A"}
                </strong>
              </p>
            </div>
            {account.opening && (
              <div className="banner">
                Opening credit: {money(account.opening.amount)} as of{" "}
                {account.opening.effective_date}. {account.opening.note}
              </div>
            )}
          </section>
          <section className="card">
            <h2>Instalment schedule</h2>
            <Table
              rows={account.instalments}
              columns={[
                ["Instalment", (r) => r.seq],
                ["Due date", (r) => r.due],
                ["Scheduled", (r) => money(r.amount)],
                ["Allocated", (r) => money(r.paid)],
                ["Status", (r) => <Badge value={r.status} />],
              ]}
            />
          </section>
          <section className="card">
            <h2>Payments & receipts</h2>
            <Table rows={account.payments || []} columns={paymentColumns} />
          </section>
          <section className="card">
            <h2>Accepted terms</h2>
            <p className="terms">{account.rules.termsEn}</p>
            <p className="terms" lang="kn">
              {account.rules.termsKn}
            </p>
            <small>Version ID: {account.version_id}</small>
          </section>
        </>
      )}
    </>
  );
}
