"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { day, money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "modal" | "customers" | "schemes" | "rates"
> & { modal: NonNullable<WorkspaceModel["modal"]> };
export function EnrolFields({ modal, customers, schemes, rates }: Props) {
  return (
    <>
      {modal.type === "enrol" && (
        <>
          <Field label="Customer">
            <select name="customerId" defaultValue={modal.customerId} required>
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.number}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Confirmed scheme version">
            <select name="versionId" required>
              <option value="">Select confirmed scheme</option>
              {schemes
                .filter((s) => s.versions.length)
                .map((s) => (
                  <option key={s.id} value={s.versions[0].id}>
                    {s.name} · v{s.versions[0].version}
                  </option>
                ))}
            </select>
          </Field>
          <Input
            name="shares"
            label="Number of shares (Lucky Draw Scheme 1: 1 share = ₹100 / month)"
            type="number"
            defaultValue="1"
            min="1"
            required={false}
          />
          <Input
            name="startDate"
            label="Start date"
            type="date"
            defaultValue={day()}
          />
          <Input
            name="paymentAmount"
            label="Initial payment amount (₹, optional)"
            required={false}
          />
          <Field label="Agreed rate (gold schemes only)">
            <select name="rateId">
              <option value="">Not applicable</option>
              {rates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.purity} {money(r.paise_per_gram)} ·{" "}
                  {new Date(r.effective_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </Field>
          <label className="check">
            <input name="termsAccepted" type="checkbox" required />
            Customer has accepted the selected version’s terms
          </label>
        </>
      )}
    </>
  );
}
