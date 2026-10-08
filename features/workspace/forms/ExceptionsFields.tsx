"use client";
import { Badge } from "../../../components/ui/Badge";
import { Empty } from "../../../components/ui/Empty";
import { Table } from "../../../components/ui/Table";
import { api } from "../../../lib/api";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "modal" | "rates" | "setError" | "setSuccess" | "setModal" | "load"
> & { modal: NonNullable<WorkspaceModel["modal"]> };
export function ExceptionsFields({
  modal,
  rates,
  setError,
  setSuccess,
  setModal,
  load,
}: Props) {
  return (
    <>
      {modal.type === "exceptions" && (
        <div className="field full">
          <p className="muted" style={{ marginBottom: 18 }}>
            When an online payment arrives before the daily gold rate is
            published, it is safely recorded and flagged here until you specify
            the applicable rate.
          </p>
          {!modal.exceptions || modal.exceptions.length === 0 ? (
            <Empty text="No open exceptions." />
          ) : (
            <Table
              rows={modal.exceptions}
              columns={[
                ["Account", (r) => r.account_number],
                ["Customer", (r) => r.customer_name],
                ["Amount", (r) => money(r.amount)],
                ["Reason", (r) => r.reason],
                ["Status", (r) => <Badge value={r.status} />],
                [
                  "Resolve",
                  (r) =>
                    r.status === "open" && (
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <select
                          id={"rate-" + r.id}
                          style={{
                            minHeight: 36,
                            padding: 6,
                            fontSize: 12,
                            width: 180,
                          }}
                        >
                          <option value="">Select Rate</option>
                          {rates.map((rt) => (
                            <option key={rt.id} value={rt.id}>
                              {rt.purity} {money(rt.paise_per_gram)} ·{" "}
                              {new Date(rt.effective_at).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="button primary"
                          style={{
                            minHeight: 36,
                            padding: "6px 12px",
                            fontSize: 12,
                          }}
                          onClick={async () => {
                            const sel = (
                              document.getElementById(
                                "rate-" + r.id,
                              ) as HTMLSelectElement
                            )?.value;
                            if (!sel) {
                              setError("Select a rate first");
                              return;
                            }
                            try {
                              await api(
                                "/exceptions/" + r.id + "/resolve-rate",
                                "POST",
                                { rateId: sel },
                              );
                              setSuccess(
                                "Exception resolved and gold allocated.",
                              );
                              const ex = await api("/exceptions");
                              setModal({
                                type: "exceptions",
                                exceptions: ex,
                              });
                              await load();
                            } catch (err: any) {
                              setError(err.message);
                            }
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    ),
                ],
              ]}
            />
          )}
        </div>
      )}
    </>
  );
}
