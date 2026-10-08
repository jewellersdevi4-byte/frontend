"use client";
import { Input } from "../../../components/ui/Input";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function StaffEditFields({ modal }: Props) {
  return (
    <>
      {modal.type === "staffEdit" && (
        <>
          <label className="check">
            <input
              name="active"
              type="checkbox"
              defaultChecked={modal.record.active}
            />
            Active staff access
          </label>
          {["customers", "payments", "inbox"].map((p) => (
            <label className="check" key={p}>
              <input
                name={p}
                type="checkbox"
                defaultChecked={modal.record.permissions[p]}
              />
              Allow {p}
            </label>
          ))}
          <Input
            name="password"
            label="Reset password (optional, 12+ characters)"
            type="password"
            required={false}
          />
        </>
      )}
    </>
  );
}
