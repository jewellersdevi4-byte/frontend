"use client";
import { Input } from "../../../components/ui/Input";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function RejectProofFields({ modal }: Props) {
  return (
    <>
      {modal.type === "rejectProof" && (
        <>
          <div className="field full banner">
            Specify why this payment proof is being rejected.
          </div>
          <Input name="reason" label="Rejection reason (min 5 characters)" />
        </>
      )}
    </>
  );
}
