"use client";
import { Table } from "../../../components/ui/Table";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data" | "paymentColumns">;
export function PaymentsView({ page, data, paymentColumns }: Props) {
  return (
    <>
      {page === "Payments" && (
        <section className="card">
          <Table rows={data || []} columns={paymentColumns} />
        </section>
      )}
    </>
  );
}
