"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal" | "account" | "rates"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function RedeemFields({ modal, account, rates }: Props) {
  return (
    <>
      {modal.type === "redeem" && (
        <>
          <div className="banner">
            Available money credit:{" "}
            {account?.remainingCredit === null
              ? "Gold formula applies"
              : money(account?.remainingCredit)}
            . Only mature, fully funded accounts may redeem.
          </div>
          <Input
            name="amount"
            label="Money amount (₹; 0 for gold)"
            defaultValue="0"
          />
          <Input
            name="weightMicrograms"
            label="Gold weight (micrograms; 0 for money)"
            defaultValue="0"
          />
          <Field label="Redemption rate (lower-rate formula)">
            <select name="rateId">
              <option value="">Not applicable</option>
              {rates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.purity} · {money(r.paise_per_gram)}
                </option>
              ))}
            </select>
          </Field>
          <Input
            name="billReference"
            label="External jewellery bill reference"
          />
          <Input name="note" label="Redemption note" />
          <label className="check">
            <input type="checkbox" required />I reviewed the agreed terms and
            bill
          </label>
        </>
      )}
    </>
  );
}
