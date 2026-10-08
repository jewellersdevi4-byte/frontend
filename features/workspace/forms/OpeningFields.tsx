"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { day } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function OpeningFields({ modal }: Props) {
  return (
    <>
      {modal.type === "opening" && (
        <>
          <div className="banner">
            Use only for a verified existing balance before recording payments.
            This does not create historical receipts.
          </div>
          <Input name="amount" label="Verified opening amount (₹)" />
          <Input
            name="effectiveDate"
            label="Effective date"
            type="date"
            defaultValue={day()}
          />
          <Field label="Historical punctuality benefit eligibility">
            <select name="benefitEligibility">
              <option value="">Not applicable / not established</option>
              <option value="yes">Verified eligible under agreed terms</option>
              <option value="no">Verified not eligible</option>
            </select>
          </Field>
          <Field label="Supporting record / explanation" full>
            <textarea name="note" minLength={10} required />
          </Field>
        </>
      )}
    </>
  );
}
