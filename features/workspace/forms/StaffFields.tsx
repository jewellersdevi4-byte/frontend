"use client";
import { Input } from "../../../components/ui/Input";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function StaffFields({ modal }: Props) {
  return (
    <>
      {modal.type === "staff" && (
        <>
          <Input name="name" label="Staff full name" />
          <Input name="username" label="Username" />
          <Input
            name="password"
            label="Initial password (at least 12 characters)"
            type="password"
          />
          {["customers", "payments", "inbox"].map((p) => (
            <label className="check" key={p}>
              <input name={p} type="checkbox" defaultChecked />
              {p}
            </label>
          ))}
        </>
      )}
    </>
  );
}
