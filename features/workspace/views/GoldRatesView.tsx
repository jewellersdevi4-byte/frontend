"use client";
import { Table } from "../../../components/ui/Table";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data">;
export function GoldRatesView({ page, data }: Props) {
  return (
    <>
      {page === "Gold rates" && (
        <section className="card">
          <div className="banner">
            Rates retain their effective time. Historical bookings keep the
            agreed rate.
          </div>
          <Table
            rows={data || []}
            columns={[
              ["Purity", (r) => <strong>{r.purity}</strong>],
              ["Rate / gram", (r) => money(r.paise_per_gram)],
              [
                "Effective time",
                (r) =>
                  new Date(r.effective_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  }) + " IST",
              ],
              ["Entered by", (r) => r.entered_by_name],
              ["Notes", (r) => r.notes || "—"],
            ]}
          />
        </section>
      )}
    </>
  );
}
