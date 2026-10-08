"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { day } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal" | "accounts"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function PaymentFields({ modal, accounts }: Props) {
  return (
    <>
      {modal.type === "payment" && (
        <>
          <Field label="Scheme account">
            <select name="accountId" defaultValue={modal.accountId} required>
              <option value="">Select customer / scheme account</option>
              {accounts
                .filter((a) => a.status !== "Closed")
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.customer_name} · {a.number} · {a.scheme_name}
                  </option>
                ))}
            </select>
          </Field>
          <Input name="amount" label="Amount received (₹)" />
          <Input
            name="paymentDate"
            label="Payment date"
            type="date"
            defaultValue={day()}
          />
          <Field label="Payment method">
            <select name="method">
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank</option>
            </select>
          </Field>
          <Input
            name="reference"
            label="Transaction reference"
            required={false}
          />
          <Input name="notes" label="Notes" required={false} />
          <label className="check">
            <input type="checkbox" required />I verified that the shop received
            this money
          </label>
        </>
      )}
    </>
  );
}
