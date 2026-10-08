"use client";
import { Input } from "../../../components/ui/Input";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function ReverseFields({ modal }: Props) {
  return (
    <>
      {modal.type === "reverse" && (
        <>
          <div className="banner">
            Reverse {money(modal.record.amount)} on{" "}
            {modal.record.receipt_number}. This creates a permanent audit entry.
          </div>
          <Input name="reason" label="Reason for reversal" />
        </>
      )}
    </>
  );
}
