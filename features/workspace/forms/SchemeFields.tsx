"use client";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function SchemeFields({ modal }: Props) {
  return (
    <>
      {modal.type === "scheme" && (
        <>
          <Input name="name" label="Scheme name" />
          <Input name="description" label="Description" />
          <Field label="Reference terms and unresolved questions" full>
            <textarea name="reference" required />
          </Field>
        </>
      )}
    </>
  );
}
