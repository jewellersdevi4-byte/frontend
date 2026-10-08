"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { day } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal" | "accounts"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function ApproveProofFields({ modal, accounts }: Props) {
  return (
    <>
      {modal.type === "approveProof" && (
        <>
          <div className="field full banner">
            Verify receipt of money at counter or in bank before issuing
            official receipt.
          </div>
          <Field label="Customer / Scheme account">
            <select
              name="accountId"
              required
              defaultValue={
                accounts.find(
                  (a) =>
                    modal.record?.customer_id &&
                    a.customer_id === modal.record.customer_id,
                )?.id || ""
              }
            >
              <option value="">Select account</option>
              {accounts
                .filter(
                  (a) =>
                    a.status !== "Closed" &&
                    (!modal.record?.customer_id ||
                      a.customer_id === modal.record.customer_id),
                )
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.customer_name} · {a.number} ({a.scheme_name})
                  </option>
                ))}
            </select>
          </Field>
          <Input
            name="amount"
            label="Verified amount received (₹)"
            defaultValue={(() => {
              const match = (modal.record?.review_note || "").match(
                /₹\s*([\d,]+(\.\d{2})?)/,
              );
              return match ? match[1].replace(/,/g, "") : "";
            })()}
          />
          <Input
            name="paymentDate"
            label="Payment date"
            type="date"
            defaultValue={day()}
          />
          <Field label="Payment method">
            <select
              name="method"
              defaultValue={(() => {
                const note = (modal.record?.review_note || "").toLowerCase();
                if (note.includes("cash")) return "Cash";
                if (note.includes("upi")) return "UPI";
                if (note.includes("bank")) return "Bank";
                return "Cash";
              })()}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank</option>
            </select>
          </Field>
          <Input
            name="reference"
            label="Transaction / UTR reference (optional)"
            required={false}
          />
          <Input
            name="note"
            label="Verification note (optional)"
            defaultValue="Verified by shop owner"
            required={false}
          />
          <label className="check">
            <input name="bankVerified" type="checkbox" required />I confirmed
            receipt of this money
          </label>
        </>
      )}
    </>
  );
}
