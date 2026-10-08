"use client";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal" | "setModal"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function DeleteCustomerFields({ modal, setModal }: Props) {
  return (
    <>
      {modal.type === "deleteCustomer" && (
        <div className="field full">
          <div
            className="banner danger"
            style={{
              background: "#fdeeed",
              borderColor: "#e74c3c",
              color: "#c0392b",
              lineHeight: 1.6,
            }}
          >
            ⚠️ <strong>Permanently Delete Customer?</strong>
            <br />
            Are you sure you want to delete <strong>
              {modal.record.name}
            </strong>{" "}
            ({modal.record.number}
            )? This will delete all scheme accounts, recorded payments, and
            receipts. This cannot be undone.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              type="submit"
              className="button danger"
              style={{ background: "#c0392b", color: "#fff" }}
            >
              Yes, delete customer permanently
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
