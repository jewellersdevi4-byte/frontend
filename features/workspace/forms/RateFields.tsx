"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function RateFields({ modal }: Props) {
  return (
    <>
      {modal.type === "rate" && (
        <>
          {modal.dailyPopup && (
            <div
              className="field full banner"
              style={{
                background: "#fef9e7",
                borderColor: "#f1c40f",
                color: "#7d6608",
                marginBottom: 12,
              }}
            >
              ⭐ <strong>Daily Gold Rate Entry</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13 }}>
                Today's gold rate has not been entered yet. Please enter the
                current market rate.
              </p>
            </div>
          )}
          <Field label="Purity">
            <select name="purity">
              <option>22K</option>
              <option>24K</option>
            </select>
          </Field>
          <Input name="amount" label="Rate per gram (₹)" />
          <Input
            name="effectiveAt"
            label="Effective time"
            type="datetime-local"
            defaultValue={new Date(
              Date.now() - new Date().getTimezoneOffset() * 60000,
            )
              .toISOString()
              .slice(0, 16)}
          />
          <Input name="notes" label="Notes (optional)" required={false} />
        </>
      )}
    </>
  );
}
