"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function VersionFields({ modal }: Props) {
  return (
    <>
      {modal.type === "version" && (
        <>
          <div className="field full banner">
            Every field below requires an explicit business decision. This
            approval creates an immutable version. Unresolved rate and other
            instalment offers must remain drafts.
          </div>
          <Field label="Scheme type">
            <select name="schemeType" required>
              <option value="">Choose</option>
              <option value="monthly">Monthly savings</option>
              <option value="one_time">One-time payment</option>
              <option value="rate_booking">Gold-rate booking</option>
            </select>
          </Field>
          <Input name="amount" label="Amount per instalment (₹)" />
          <Input name="count" label="Instalment count" type="number" />
          <Input
            name="durationMonths"
            label="Maturity duration in months"
            type="number"
          />
          <Input name="dueDay" label="Monthly due day (1–28)" type="number" />
          <Field label="First instalment">
            <select name="firstDue" required>
              <option value="">Choose</option>
              <option value="start">On start date</option>
              <option value="next_due_day">Next monthly due day</option>
            </select>
          </Field>
          <Field label="Maturity calculation">
            <select name="maturity" required>
              <option value="">Choose</option>
              <option value="months_from_start">
                Duration from start date
              </option>
              <option value="last_due">Final instalment due date</option>
            </select>
          </Field>
          <Input
            name="benefit"
            label="Fixed completion benefit (₹, 0 if none)"
          />
          <Field label="Late-payment benefit rule">
            <select name="benefitLatePolicy" required>
              <option value="">Choose</option>
              <option value="allowed">Benefit remains available</option>
              <option value="forfeit">Late payment forfeits benefit</option>
            </select>
          </Field>
          <Field label="Redemption formula">
            <select name="formula" required>
              <option value="">Choose</option>
              <option value="money">Money credit</option>
              <option value="locked_rate">Weight at locked rate</option>
              <option value="lower_rate">
                Weight at lower of agreed / redemption rate
              </option>
            </select>
          </Field>
          <Field label="Purity">
            <select name="purity">
              <option value="">Not applicable</option>
              <option>22K</option>
              <option>24K</option>
            </select>
          </Field>
          <Field label="Round weight down to microgram increment">
            <select name="roundingMicrograms" required>
              <option value="">Choose</option>
              {["1", "10", "100", "1000", "10000"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <label className="check">
            <input name="partial" type="checkbox" />
            Permit partial payments
          </label>
          <label className="check">
            <input name="advance" type="checkbox" />
            Permit advance payments
          </label>
          <Input name="makingTerms" label="Making-charge terms / exclusions" />
          <Input
            name="decisionNote"
            label="Owner decision record (min. 10 characters)"
          />
          <Field label="Owner-reviewed English terms" full>
            <textarea name="termsEn" minLength={20} required />
          </Field>
          <Field label="Owner-reviewed Kannada terms" full>
            <textarea name="termsKn" minLength={20} required />
          </Field>
          <div className="banner field full">
            Missed instalments carry forward. Refunds and early closure remain
            disabled. Opening balances require an explicit eligibility decision
            if benefits depend on historical punctuality.
          </div>
          <label className="check">
            <input name="confirmation" type="checkbox" required />I confirm all
            calculations and both language texts
          </label>
        </>
      )}
    </>
  );
}
