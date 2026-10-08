"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { day, money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal" | "schemes" | "rates"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function CustomerFields({ modal, schemes, rates }: Props) {
  return (
    <>
      {modal.type === "customer" && (
        <>
          <Input
            label="Full name"
            name="name"
            defaultValue={modal.record?.name}
          />
          <Input
            label="Mobile number"
            name="mobile"
            defaultValue={modal.record?.mobile}
          />
          <Input
            label="WhatsApp number (blank = mobile)"
            name="whatsapp"
            defaultValue={modal.record?.whatsapp}
            required={false}
          />
          <Field label="Preferred language">
            <select
              name="language"
              defaultValue={modal.record?.language || "kn"}
            >
              <option value="kn">Kannada</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Input
            name="address"
            label="Address"
            defaultValue={modal.record?.address}
          />
          <Input
            name="consentMethod"
            label="Consent method (optional)"
            defaultValue={
              modal.record?.consent_method || "In-store customer consent"
            }
            required={false}
          />
          <label className="check">
            <input
              name="consent"
              type="checkbox"
              defaultChecked={modal.record ? modal.record.consent : true}
            />
            Customer agreed to scheme WhatsApp messages
          </label>
          <Input
            name="notes"
            label="Notes (optional)"
            defaultValue={modal.record?.notes}
            required={false}
          />
          {!modal.record && (
            <>
              <div className="field full banner" style={{ margin: "8px 0" }}>
                Optional: Enrol customer in a scheme immediately upon
                registration
              </div>
              <Field label="Select scheme (optional)">
                <select name="versionId">
                  <option value="">No scheme now</option>
                  {schemes
                    .filter((s) => s.versions.length)
                    .map((s) => (
                      <option key={s.id} value={s.versions[0].id}>
                        {s.name} · v{s.versions[0].version} (
                        {s.versions[0].rules.type.replace("_", " ")})
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
                label="Scheme joining date"
                type="date"
                defaultValue={day()}
                required={false}
              />
              <Field label="Agreed gold rate (if applicable)">
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
              <Input
                name="paymentAmount"
                label="Initial payment amount (₹, optional)"
                required={false}
              />
              <label className="check">
                <input name="termsAccepted" type="checkbox" />
                Customer accepted the scheme terms
              </label>
            </>
          )}
        </>
      )}
    </>
  );
}
