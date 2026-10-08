"use client";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Table } from "../../../components/ui/Table";
import { api } from "../../../lib/api";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "page" | "data" | "options" | "setModal" | "open" | "setPage"
>;
export function DashboardView({
  page,
  data,
  options,
  setModal,
  open,
  setPage,
}: Props) {
  return (
    <>
      {page === "Dashboard" && data && (
        <>
          <div className="stats">
            {[
              ["Customers", data.customers, "Registered with your shop"],
              [
                "Active accounts",
                data.activeAccounts,
                "Across confirmed schemes",
              ],
              [
                "Collected this month",
                money(data.collected),
                "Confirmed payments only",
              ],
              [
                "Currently outstanding",
                money(data.outstanding),
                "Due and overdue instalments",
              ],
            ].map(([label, value, hint]) => (
              <div className="stat" key={label}>
                <div className="label">
                  {label}
                  <ArrowUpRight size={15} />
                </div>
                <strong>{value}</strong>
                <small>{hint}</small>
              </div>
            ))}
          </div>
          {data.openExceptions > 0 && (
            <div
              className="banner"
              style={{
                background: "#fff0eb",
                borderColor: "#ecc7bc",
                color: "#9a3324",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <span>
                ⚠️ <strong>{data.openExceptions} payment(s)</strong> awaiting
                gold rate announcement or resolution.
              </span>
              <button
                className="button"
                onClick={async () => {
                  await options();
                  const ex = await api("/exceptions");
                  setModal({ type: "exceptions", exceptions: ex });
                }}
              >
                Review & resolve exceptions
              </button>
            </div>
          )}
          {data.adapter !== "meta" && (
            <div className="banner">
              WhatsApp is in isolated test mode. Test messages are never
              delivered through WhatsApp.
            </div>
          )}
          <div className="grid">
            <div>
              <section className="card">
                <header>
                  <h2>Today’s work</h2>
                  <span className="pill">Asia / Kolkata</span>
                </header>
                <Table
                  rows={[
                    {
                      name: "Record a customer payment",
                      detail: "Verify receipt of money, then record it.",
                      go: () => open("payment"),
                    },
                    {
                      name: "Register a new customer",
                      detail: "Contact details and WhatsApp consent.",
                      go: () => open("customer"),
                    },
                    {
                      name: "Check customer enquiries",
                      detail: "Reply personally through the shop inbox.",
                      go: () => setPage("WhatsApp inbox"),
                    },
                  ]}
                  columns={[
                    [
                      "Action",
                      (r) => (
                        <>
                          <button className="link" onClick={r.go}>
                            {r.name}
                          </button>
                          <span className="row-detail">{r.detail}</span>
                        </>
                      ),
                    ],
                    [
                      "",
                      (r) => (
                        <button className="link" onClick={r.go}>
                          <ChevronRight size={17} />
                        </button>
                      ),
                    ],
                  ]}
                />
              </section>
              <section className="card">
                <header>
                  <h2>Needs your attention</h2>
                </header>
                <div className="key-value">
                  <p>
                    <small>Accounts nearing completion</small>
                    <strong>{data.nearingCompletion}</strong>
                  </p>
                  <p>
                    <small>Failed or uncertain messages</small>
                    <strong>{data.failedMessages}</strong>
                  </p>
                </div>
                <button className="button" onClick={() => setPage("Messages")}>
                  Review messages <ArrowUpRight size={15} />
                </button>
              </section>
            </div>
            <section className="card">
              <img
                className="shop-photo"
                src="/shop.png"
                alt="Devi Jewellers shop interior from supplied presentation"
              />
              <div className="eyebrow">A TRADITION OF TRUST</div>
              <h2>Made for your daily routine.</h2>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
                Register customers, record verified payments and keep every
                scheme account clear.
              </p>
              <div className="banner">
                Scheme offers from your presentation stay in draft until their
                calculation rules are confirmed.
              </div>
              <button className="button" onClick={() => setPage("Schemes")}>
                Review schemes <ArrowUpRight size={15} />
              </button>
            </section>
          </div>
        </>
      )}
    </>
  );
}
